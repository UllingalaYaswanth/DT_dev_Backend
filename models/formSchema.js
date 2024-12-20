import mongoose from 'mongoose';

const aspectDetailSchema = new mongoose.Schema({
  aspect: String,
  description: String,
});

const azimuthAngleSchema = new mongoose.Schema({
  angle: String,
  details: String,
  imageUrl: String,  // Store image URL or file path after saving the file
});

const annotationSchema = new mongoose.Schema({
  image: String,  // Image name or identifier
  imageUrl: String,  // Store image URL or file path after saving the file
});

const missingPartSchema = new mongoose.Schema({
  part: String,
  description: String,
});

const operatorSchema = new mongoose.Schema({
  operator: String,
  radCenter: String,
  emptyMounts: String,
  lastMaintenance: Date,
  aspectdetails: [aspectDetailSchema],
  azimuthAngles: [azimuthAngleSchema],
  annotations: [annotationSchema],
  missingParts: [missingPartSchema],
});

const formSchema = new mongoose.Schema({
  siteID: String,
  operators: [operatorSchema],
});

const Form = mongoose.model('Form', formSchema);

export default Form;
