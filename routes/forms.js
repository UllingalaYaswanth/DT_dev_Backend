import express from 'express';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import Form from '../models/Form.js';
import { NodeHttpHandler } from '@smithy/node-http-handler';

dotenv.config();

// AWS S3 Configuration
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 60000,
    socketTimeout: 60000,
  }),
});

// Set up multer to store files in S3
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'digitaltwin-data',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      // Generate a unique file name
      cb(null, `images/${Date.now().toString()}-${file.originalname}`);
    },
  }),

  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB file size limit
  },
});

// Create router for form-related API
const router = express.Router();

router.post('/ins-submit', upload.fields([
  { name: 'azimuthAnglesImages', maxCount: 3 },
  { name: 'annotationsImages', maxCount: 4 },
]), async (req, res) => {
  try {
    const formData = req.body;

    // Ensure the operators data is properly parsed if it's a stringified JSON
    if (typeof formData.operators === 'string') {
      formData.operators = JSON.parse(formData.operators);
    }

    // Log to check the structure of formData and operators
    console.log('Form data received:', formData);

    // Check if formData and formData.operators are properly populated
    if (!formData || !formData.operators) {
      return res.status(400).json({ message: 'Invalid form data: operators field is missing.' });
    }

    // Ensure that azimuthAngles exists in the operators object
    const operator = formData.operators;  // operators is an object, not an array
    if (!operator.azimuthAngles) {
      operator.azimuthAngles = [];  // Initialize as empty array if undefined
    }

    // Process azimuthAnglesImages if any are uploaded
    if (req.files?.azimuthAnglesImages?.length > 0) {
      console.log('Azimuth angles images uploaded:', req.files.azimuthAnglesImages);

      operator.azimuthAngles = req.files.azimuthAnglesImages.map((file, index) => {
        // Initialize azimuthAngles[index] to prevent undefined errors
        const angleData = operator.azimuthAngles[index] || {};

        return {
          angle: angleData.angle || 'Unknown',  // If no angle data, default to 'Unknown'
          details: angleData.details || 'Unknown',  // If no details, default to 'Unknown'
          imagePath: file.location,  // AWS S3 URL
        };
      });
    }

    // Process annotationsImages if any are uploaded
    if (req.files?.annotationsImages?.length > 0) {
      console.log('Annotations images uploaded:', req.files.annotationsImages);

      operator.annotations = req.files.annotationsImages.map((file) => {
        return {
          image: file.originalname,  // Use original file name
          imagePath: file.location,  // AWS S3 URL
        };
      });
    }

    // Log the updated form data to check if image paths are assigned correctly
    console.log('Updated form data with image paths:', formData);

    // Save the form data to the database
    const newForm = new Form(formData);
    await newForm.save();

    res.status(201).json({ message: 'Form submitted successfully', form: newForm });
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
});


router.get('/ins-get', async (req, res) => {
  try {
    const forms = await Form.find();

    const responseData = forms.map(form => {
      form.operators.forEach(operator => {
        if (operator.azimuthAngles) {
          operator.azimuthAngles.forEach(angle => {
            angle.imagePath = angle.imagePath || '';
          });
        }
        if (operator.annotations) {
          operator.annotations.forEach(annotation => {
            annotation.imagePath = annotation.imagePath || '';
          });
        }
      });
      return form;
    });

    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ message: 'Error fetching form data', error });
  }
});
export default router;