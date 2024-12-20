import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  tags: { type: String, required: true },
  files: [
    {
      filePath: { type: String, required: true },
      fileType: { type: String, required: true }
    }
  ]
});

const File = mongoose.model('File', fileSchema);

export default File;
