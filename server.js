// import express from 'express';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import bodyParser from 'body-parser';
// import formRoutes from './routes/form.js';
// import uploadRoutes from './routes/uploads.js';

// const app = express();
// const mongoURI = 'mongodb+srv://sruthi:test@test.vo8k0.mongodb.net/';

// // Middleware
// // app.use(cors());
// app.use(cors({
//   origin: '*',  // Allows all origins, but not recommended for production
// }));

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// mongoose.connect(mongoURI)
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((err) => console.error('MongoDB connection error:', err));

// // Routes
// app.use('/api/form', formRoutes);
// app.use('/api/upload', uploadRoutes);


// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import fileRoutes from './routes/fileRoutes.js';
// import formRoutes from './routes/form.js';
// import uploadRoutes from './routes/uploads.js';
// dotenv.config();

// console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);
// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware setup
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log(err));


// // Routes
// app.use('/api/form', formRoutes);
// app.use('/api/upload', uploadRoutes);
// app.use('/api/files', fileRoutes);

// // Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// }).setTimeout(0); // Prevent timeout for large file uploads


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import fileRoutes from './routes/fileRoutes.js';
import formRoutes from './routes/forms.js'; // Ensure file name matches

import uploadRoutes from './routes/uploads.js';
dotenv.config();

console.log("AWS_BUCKET_NAME:", process.env.AWS_BUCKET_NAME);
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));


// Routes
app.use('/api/forms', formRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/files', fileRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).setTimeout(0); // Prevent timeout for large file uploads