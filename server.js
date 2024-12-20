// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import formRoutes from './routes/form.js';
// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import uploadRoutes from './routes/uploads.js';

// const app = express();
// const mongoURI = 'mongodb+srv://sruthi:test@test.vo8k0.mongodb.net/';

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// mongoose.connect(mongoURI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/form', formRoutes);
// app.use('/api/upload', uploadRoutes);

// const filename = fileURLToPath(import.meta.url);
// const dirname = path.dirname(filename);

// app.get('/api/models', (req, res) => {
//   const userEmail = req.query.email;
//   let directoryPath;

//   if (userEmail === 'admin@gmail.com') {
//     directoryPath = path.join(dirname, '../frontend/public/DADAL00398B_OBJ/Data');
//   } else if (userEmail === 'operator@gmail.com') {
//     directoryPath = path.join(dirname, '../frontend/public/1/Data');
//   } else {
//     return res.status(400).json({ error: 'Invalid email' });
//   }

//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       console.error('Error reading directory:', err);
//       return res.status(500).json({ error: 'Unable to scan directory' });
//     }

//     const supportedExtensions = ['.obj', '.mtl', '.fbx', '.dae', '.gltf', '.glb', '.jpg', '.png', '.tiff', '.bmp'];
//     const filteredFiles = files.filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()));

//     res.json(filteredFiles);
//   });
// });

// app.use(express.static(path.join(dirname, '../frontend/public')));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import formRoutes from './routes/form.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadRoutes from './routes/uploads.js';

const app = express();
const mongoURI = 'mongodb+srv://sruthi:test@test.vo8k0.mongodb.net/';

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/form', formRoutes);
app.use('/api/upload', uploadRoutes);

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

app.get('/api/models', (req, res) => {
  const userEmail = req.query.email;
  let directoryPath;

  if (userEmail === 'admin@gmail.com') {
    directoryPath = path.join(dirname, '../frontend/public/DADAL00398B_OBJ/Data');
  } else if (userEmail === 'operator@gmail.com') {
    directoryPath = path.join(dirname, '../frontend/public/1/Data');
  } else {
    return res.status(400).json({ error: 'Invalid email' });
  }

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).json({ error: 'Unable to scan directory' });
    }

    const supportedExtensions = ['.obj', '.mtl', '.fbx', '.dae', '.gltf', '.glb', '.jpg', '.png', '.tiff', '.bmp'];
    const filteredFiles = files.filter(file => supportedExtensions.includes(path.extname(file).toLowerCase()));

    res.json(filteredFiles);
  });
});

app.use(express.static(path.join(dirname, '../frontend/public')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));