import express from 'express';
import File from '../models/File.js'; // Ensure this path is correct for your model
import AntennaLayout from '../models/AntennaLayout.js';


const router = express.Router();
// Save path route
// router.post('/save-path', async (req, res) => {
//   const { tags, files } = req.body;  // Destructure files from the request body

//   if (!tags || !files || files.length === 0) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Create a new file document with the received files data
//     const newFile = new File({
//       tags,
//       files, // This will store the array of files (filePath and fileType)
//     });

//     // Save the document to the database
//     await newFile.save();
//     res.status(201).json({ message: 'File paths saved successfully' });
//   } catch (error) {
//     console.error('Error saving file path:', error);
//     res.status(500).json({ message: 'Failed to save file path' });
//   }
// });

router.post('/save-path', async (req, res) => {
  const { tags, files } = req.body; // Destructure files and tags from the request body

  if (!tags || !files || files.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if a document with the same tags already exists
    const existingFile = await File.findOne({ tags });

    if (existingFile) {
      // If document exists, append new files to the files array
      existingFile.files = [...existingFile.files, ...files]; // Merge old and new files
      await existingFile.save(); // Save the updated document
      res.status(200).json({ message: 'Files appended successfully to existing tags' });
    } else {
      // If no document exists, create a new one
      const newFile = new File({
        tags,
        files, // Save the files array
      });
      await newFile.save();
      res.status(201).json({ message: 'New tags and files saved successfully' });
    }
  } catch (error) {
    console.error('Error saving file path:', error);
    res.status(500).json({ message: 'Failed to save file path' });
  }
});

router.get('/files/:siteId', async (req, res) => {
  console.log('Received request for siteId:', req.params.siteId, 'fileType:', req.query.fileType); // Log request parameters
  const { siteId } = req.params;
  const { fileType } = req.query;

  try {
    // Check if the siteId exists in the AntennaLayout collection
    const antennaData = await AntennaLayout.findOne({ siteId });
    if (!antennaData) {
      return res.status(404).json({ message: 'Antenna layout not found for the given siteId.' });
    }

    // Fetch files associated with the siteId
    const filesData = await File.findOne({ tags: siteId });
    if (!filesData || filesData.files.length === 0) {
      return res.status(404).json({ message: 'No files found for the given siteId.' });
    }

    console.log('Files found:', filesData.files); // Log all files found

    // Filter files by fileType if provided
    const validFiles = filesData.files
      .filter(file => !fileType || file.fileType === fileType)
      .map(file => ({
        filePath: file.filePath,
        fileType: file.fileType,
      }));

    console.log('Filtered valid files:', validFiles); // Log valid files after filtering

    if (validFiles.length === 0) {
      return res.status(404).json({ message: 'No valid files found for the given siteId and fileType.' });
    }

    res.status(200).json({ files: validFiles, tags: filesData.tags });
  } catch (error) {
    console.error('Error retrieving files:', error);
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
});


export default router;