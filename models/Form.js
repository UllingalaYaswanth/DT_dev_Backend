// import mongoose from 'mongoose';

// const operatorSchema = new mongoose.Schema({
//   operator: String,
//   radCenter: String,
//   emptyMounts: String,
//   lastMaintenance: String,
//   aspectdetails:[{
//     aspect:String,
//     description:String
//   }],
//   azimuthAngles: [{
//     angle: String,
//     details: String,
//     imageUrl: String
//   }],
//   annotations: [{
//   image:String,
//   imageUrl:String
//   }],
//   missingParts: [{
//     part: String,
//     description: String
//   }]
// });

// const formSchema = new mongoose.Schema({
//   siteID: { type: String},
//   operators: [operatorSchema]
// });

// const Form = mongoose.model('Form', formSchema);

// export default Form;


// import mongoose from 'mongoose';

// const operatorSchema = new mongoose.Schema({
//   operator: String,
//   radCenter: String,
//   emptyMounts: String,
//   lastMaintenance: String,
//   aspectdetails: [
//     {
//       aspect: String,
//       description: String,
//     },
//   ],  
//   azimuthAngles:[
// {
//   angle:String,
//   details:String,
//   imageUrl:Buffer,
// }
//   ],

//   annotations: [
//     {
//       image: String, // Binary image data
//       imageUrl: Buffer,
//     },
//   ],
//   missingParts: [
//     {
//       part: String,
//       description: String,
//     },
//   ],
// });

// const formSchema = new mongoose.Schema({
//   siteID: { type: String, unique: true },
//   operators: [operatorSchema],
// });

// const Form = mongoose.model('Form', formSchema);

// export default Form;

import mongoose from 'mongoose';

const operatorSchema = new mongoose.Schema({
  operator: String,
  radCenter: String,
  emptyMounts: String,
  lastMaintenance: String,
  aspectdetails:[{
    aspect:String,
    description:String
  }],
  azimuthAngles: [{
    angle: String,
    details: String,
    imageUrl: Buffer
  }],
  annotations: [{
  image:String,
  imageUrl:Buffer
  }],
  missingParts: [{
    part: String,
    description: String
  }]
});

const formSchema = new mongoose.Schema({
  siteID: { type: String},
  operators: [operatorSchema]
});

const Form = mongoose.model('Form', formSchema);

export default Form;