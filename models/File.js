// import mongoose from 'mongoose';

// const fileSchema = new mongoose.Schema({
//   tags: { type: String, required: true },
//   files: [
//     {
//       filePath: { type: String, required: true },
//       fileType: { type: String, required: true }
//     }
//   ]
// });

// const File = mongoose.model('File', fileSchema);

// export default File;


import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  tags: {
    type: String,
    required: true,
  },
  files: [
    {
      fileName: { type: String, required: true },
      filePath: { type: String, required: true }, // S3 URL
      fileType: { type: String, required: true }, // e.g., 'excel', 'obj', etc.
    },
  ],
});

const File = mongoose.model('File', fileSchema);

export default File;
