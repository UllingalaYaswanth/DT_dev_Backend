import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import File from '../models/File.js';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();


const router = express.Router();

// AWS S3 Client Configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  maxAttempts: 10, // Retry failed requests
  requestTimeout: 30 * 60 * 1000, // Set timeout to 15 minutes
  connectionTimeout: 30 * 60 * 1000, // Set connection timeout to 15 minutes
});


// File Upload Setup using Multer
const upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const folderName = req.body.tags; // Folder name (tags)
      cb(null, `uploads/${folderName}/${Date.now()}_${file.originalname}`); // Unique key for each file in S3
    },
  }),
  limits: { fileSize: 20 * 1024 * 1024 * 1024 }, // 20GB file size limit
  fileFilter: (req, file, cb) => {
    const allowedFields = ['excel', 'obj', 'laz', 'kml', 'pdf'];
    if (!allowedFields.includes(file.fieldname)) {
      return cb(new Error('Unexpected field'));
    }
    cb(null, true);
  },
});

// File Upload Route
router.post('/upload', upload.fields([
  { name: 'excel', maxCount: 1 },
  { name: 'obj', maxCount: 1 },
  { name: 'laz', maxCount: 1 },
  { name: 'kml', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]), async (req, res) => {
  try {
    const { tags } = req.body;
    const uploadedFiles = req.files;
    const fileData = [];

    if (!tags || !uploadedFiles || Object.keys(uploadedFiles).length === 0) {
      return res.status(400).json({ message: 'Please provide a folder name and upload all required files.' });
    }

    Object.keys(uploadedFiles).forEach((field) => {
      uploadedFiles[field].forEach((file) => {
        fileData.push({
          fileName: file.originalname,
          filePath: file.location, // S3 URL
          fileType: field, // File type (e.g., 'excel', 'obj', etc.)
        });
      });
    });

    let folderDoc = await File.findOne({ tags });

    if (!folderDoc) {
      folderDoc = new File({
        tags, // Folder name
        files: fileData, // Array of file metadata
      });
      await folderDoc.save();
    } else {
      folderDoc.files.push(...fileData);
      await folderDoc.save();
    }

    res.status(200).json({ message: 'Files uploaded successfully!', folder: folderDoc });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ message: 'Error uploading files', error: error.message });
  }
});

// GET Route to fetch all files
router.get('/', async (req, res) => {
  try {
    const allFiles = await File.find();

    if (allFiles.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }

    res.status(200).json({ message: 'Files retrieved successfully', data: allFiles });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ message: 'Error fetching files', error: error.message });
  }
});

// GET Route to fetch files by tags (folder)
router.get('/:tags', async (req, res) => {
  try {
    const { tags } = req.params;
    const folderDoc = await File.findOne({ tags });

    if (!folderDoc) {
      return res.status(404).json({ message: `No files found for folder: ${tags}` });
    }

    res.status(200).json({ message: `Files for folder ${tags} retrieved successfully`, data: folderDoc });
  } catch (error) {
    console.error('Error fetching files by tags:', error);
    res.status(500).json({ message: 'Error fetching files by tags', error: error.message });
  }
});

// DELETE Route to delete a specific folder (by tags)
router.delete('/:tags', async (req, res) => {
  try {
    const { tags } = req.params;
    const folderDoc = await File.findOne({ tags });

    if (!folderDoc) {
      return res.status(404).json({ message: `Folder with tags ${tags} not found` });
    }

    await File.deleteOne({ tags });
    res.status(200).json({ message: `Folder ${tags} and its files have been deleted successfully` });
  } catch (error) {
    console.error('Error deleting folder:', error);
    res.status(500).json({ message: 'Error deleting folder', error: error.message });
  }
});

export default router;
