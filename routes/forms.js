import express from 'express';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import dotenv from 'dotenv';
import Form from '../models/Form.js';
import { NodeHttpHandler } from '@smithy/node-http-handler';
import AntennaLayout from '../models/AntennaLayout.js';
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
  { name: 'siteImage', maxCount: 1 }, // Add a field for site image
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
    const operator = formData.operators; // operators is an object, not an array
    if (!operator.azimuthAngles) {
      operator.azimuthAngles = []; // Initialize as empty array if undefined
    }

    // Process azimuthAnglesImages if any are uploaded
    if (req.files?.azimuthAnglesImages?.length > 0) {
      console.log('Azimuth angles images uploaded:', req.files.azimuthAnglesImages);

      operator.azimuthAngles = req.files.azimuthAnglesImages.map((file, index) => {
        // Initialize azimuthAngles[index] to prevent undefined errors
        const angleData = operator.azimuthAngles[index] || {};

        return {
          angle: angleData.angle || 'Unknown', // If no angle data, default to 'Unknown'
          details: angleData.details || 'Unknown', // If no details, default to 'Unknown'
          imagePath: file.location, // AWS S3 URL
        };
      });
    }

    // Process annotationsImages if any are uploaded
    if (req.files?.annotationsImages?.length > 0) {
      console.log('Annotations images uploaded:', req.files.annotationsImages);

      operator.annotations = req.files.annotationsImages.map((file) => {
        return {
          image: file.originalname, // Use original file name
          imagePath: file.location, // AWS S3 URL
        };
      });
    }

    // Process siteImage if uploaded
    if (req.files?.siteImage?.length > 0) {
      console.log('Site image uploaded:', req.files.siteImage[0]);

      formData.siteImagePath = req.files.siteImage[0].location; // Store the AWS S3 URL
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

router.post('/submit', upload.single('image'), async (req, res) => {
  console.log("Received request:", req.body);
  
  try {
      const antennaData = new AntennaLayout({
          siteId: req.body.siteId,
          reportVersion: req.body.reportVersion,
          scanDate: req.body.scanDate,
          mountLevel: req.body.mountLevel,
          noOperators: req.body.operators,
          location: req.body.location,
          AntennaLayouta2: {
              radCenter: String(req.body.a2RadCenter),
              azimuth: String(req.body.a2Azimuth),
              mechTilt: String(req.body.a2MechTilt),
          },
          AntennaLayoutb2: {
              radCenter: String(req.body.b2RadCenter),
              azimuth: String(req.body.b2Azimuth),
              mechTilt: String(req.body.b2MechTilt),
          },
          AntennaLayoutc2: {
              radCenter: String(req.body.c2RadCenter),
              azimuth: String(req.body.c2Azimuth),
              mechTilt: String(req.body.c2MechTilt),
          },
          image: req.file ? req.file.buffer : null,
          a2Swing: {
              radCenter: String(req.body.a2SwingRadCenter),
              azimuth: String(req.body.a2SwingAzimuth),
              mechTilt: String(req.body.a2SwingMechTilt),
              skew: String(req.body.a2SwingSkew),
              antSwingAngleNeg: String(req.body.a2SwingAntSwingAngleNeg),
              antSwingAnglePos: String(req.body.a2SwingAntSwingAnglePos),
          },
          b2Swing: {
              radCenter: String(req.body.b2SwingRadCenter),
              azimuth: String(req.body.b2SwingAzimuth),
              mechTilt: String(req.body.b2SwingMechTilt),
              skew: String(req.body.b2SwingSkew),
              antSwingAngleNeg: String(req.body.b2SwingAntSwingAngleNeg),
              antSwingAnglePos: String(req.body.b2SwingAntSwingAnglePos),
          },
          c2Swing: {
              radCenter: String(req.body.c2SwingRadCenter),
              azimuth: String(req.body.c2SwingAzimuth),
              mechTilt: String(req.body.c2SwingMechTilt),
              skew: String(req.body.c2SwingSkew),
              antSwingAngleNeg: String(req.body.c2SwingAntSwingAngleNeg),
              antSwingAnglePos: String(req.body.c2SwingAntSwingAnglePos),
          },
          mounts: {
              sectorA: {
                  memberSchedule: {
                      p1Size: String(req.body.sectorAP1Size),
                      p1Length: String(req.body.sectorAP1Length),
                      p2Size: String(req.body.sectorAP2Size),
                      p2Length: String(req.body.sectorAP2Length),
                  },
                  dimensions: {
                      A: String(req.body.sectorADimA || ''),
                      B: String(req.body.sectorADimB || ''),
                      C: String(req.body.sectorADimC || ''),
                      D: String(req.body.sectorADimD || ''),
                      E: String(req.body.sectorADimE || ''),
                      F: String(req.body.sectorADimF || ''),
                  }
              },
              sectorB: {
                  memberSchedule: {
                      p1Size: String(req.body.sectorBP1Size),
                      p1Length: String(req.body.sectorBP1Length),
                      p2Size: String(req.body.sectorBP2Size),
                      p2Length: String(req.body.sectorBP2Length),
                  },
                  dimensions: {
                      A: String(req.body.sectorBDimA || ''),
                      B: String(req.body.sectorBDimB || ''),
                      C: String(req.body.sectorBDimC || ''),
                      D: String(req.body.sectorBDimD || ''),
                      E: String(req.body.sectorBDimE || ''),
                      F: String(req.body.sectorBDimF || ''),
                  }
              },
              sectorC: {
                  memberSchedule: {
                      p1Size: String(req.body.sectorCP1Size),
                      p1Length: String(req.body.sectorCP1Length),
                      p2Size: String(req.body.sectorCP2Size),
                      p2Length: String(req.body.sectorCP2Length),
                  },
                  dimensions: {
                      A: String(req.body.sectorCDimA || ''),
                      B: String(req.body.sectorCDimB || ''),
                      C: String(req.body.sectorCDimC || ''),
                      D: String(req.body.sectorCDimD || ''),
                      E: String(req.body.sectorCDimE || ''),
                      F: String(req.body.sectorCDimF || ''),
                  }
              }
          }
      });

      await antennaData.save();
      res.status(200).json({ message: 'Data saved successfully.' });
  } catch (error) {
      console.error('Error saving data:', error);
      res.status(500).json({ message: 'Error saving data', error: error.message });
  }
});

router.get('/antenna-layouts', async (req, res) => {
  try {
      const antennaLayouts = await AntennaLayout.find({});
      res.json(antennaLayouts);
  } catch (error) {
      console.error("Error fetching antenna layouts:", error);
      res.status(500).json({ message: 'Failed to fetch antenna layouts.' });
  }
});


export default router;