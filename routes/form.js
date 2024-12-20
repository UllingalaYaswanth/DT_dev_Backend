import express from 'express';
import multer from 'multer';
import AntennaLayout from '../models/AntennaLayout.js';
import Form from '../models/Form.js';

const router = express.Router();
const upload = multer(); // Initialize multer without any specific storage settings

// Middleware to handle file upload
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


  // router.post('/ins-submit', async (req, res) => {
  //   const { siteID, operators } = req.body;
  
  //   try {
  //     // Validate required fields
  //     if (!siteID || !operators || !Array.isArray(operators)) {
  //       return res.status(400).json({ message: 'siteID and a valid operators array are required' });
  //     }
  
  //     // Process base64 images and convert them to Buffer
  //     operators.forEach(operator => {
  //       // Initialize azimuthAngles keys
  //       operator.azimuthAngles = operator.azimuthAngles || {};
  //       ['0-120 degrees', '120-240 degrees', '240-360 degrees'].forEach(range => {
  //         const angleData = operator.azimuthAngles[range] || {};
  
  //         // Convert base64 image to Buffer if it exists
  //         if (angleData.image && angleData.image.startsWith('data:image')) {
  //           angleData.image = Buffer.from(angleData.image.split(',')[1], 'base64');
  //         }
  
  //         // Ensure the data field exists
  //         angleData.data = angleData.data || '';
  
  //         // Assign back to the operator's azimuthAngles
  //         operator.azimuthAngles[range] = angleData;
  //       });
  
  //       // Process annotations
  //       operator.annotations.forEach(annotation => {
  //         if (annotation.image && annotation.image.startsWith('data:image')) {
  //           annotation.image = Buffer.from(annotation.image.split(',')[1], 'base64');
  //         }
  //       });
  //     });
  
  //     // Check if the document for the given siteID already exists
  //     let formData = await Form.findOne({ siteID });
  
  //     if (!formData) {
  //       // Create a new document if it doesn't exist
  //       formData = new Form({ siteID, operators });
  //     } else {
  //       // Merge operators into the existing document
  //       operators.forEach(newOperator => {
  //         const existingOperator = formData.operators.find(
  //           op => op.operator === newOperator.operator
  //         );
  
  //         if (existingOperator) {
  //           // Update existing operator details
  //           Object.entries(newOperator.azimuthAngles).forEach(([range, newAngle]) => {
  //             if (existingOperator.azimuthAngles[range]) {
  //               // Update image and data if new data exists
  //               if (newAngle.image) existingOperator.azimuthAngles[range].image = newAngle.image;
  //               if (newAngle.data) existingOperator.azimuthAngles[range].data = newAngle.data;
  //             } else {
  //               // Add new azimuth range entry
  //               existingOperator.azimuthAngles[range] = newAngle;
  //             }
  //           });
  
  //           newOperator.annotations.forEach(newAnnotation => {
  //             if (
  //               !existingOperator.annotations.some(
  //                 annotation =>
  //                   annotation.image && annotation.image.equals(Buffer.from(newAnnotation.image))
  //               )
  //             ) {
  //               existingOperator.annotations.push(newAnnotation);
  //             }
  //           });
  //         } else {
  //           // Add a new operator
  //           formData.operators.push(newOperator);
  //         }
  //       });
  //     }
  
  //     // Save the updated or new document
  //     await formData.save();
  
  //     res.status(201).json({ message: 'Form data saved successfully', formData });
  //   } catch (error) {
  //     console.error('Error saving form data:', error);
  //     res.status(500).json({ message: 'Error saving form data', error });
  //   }
  // });
  
  // router.get('/ins-get', async (req, res) => {
  //   try {
  //     const forms = await Form.find();
  //     res.status(200).json(forms);
  //   } catch (error) {
  //     console.error('Error retrieving form data:', error);
  //     res.status(500).json({ message: 'Error retrieving form data', error });
  //   }
  // });


  router.post('/ins-submit', async (req, res) => {
    try {
      const { operators, siteID } = req.body;
  
      // Ensure the images are in binary format and store the full base64 string
      operators.forEach(operator => {
        // Process azimuthAngles if it exists
        if (operator.azimuthAngles) {
          operator.azimuthAngles.forEach(angle => {
            if (angle.imageUrl && angle.imageUrl.startsWith('data:image')) {
              // Remove the base64 prefix to get the actual base64 data
              angle.imageUrl = Buffer.from(angle.imageUrl.split(',')[1], 'base64');
            }
          });
        }
  
        // Process annotations if it exists
        if (operator.annotations) {
          operator.annotations.forEach(annotation => {
            if (annotation.imageUrl && annotation.imageUrl.startsWith('data:image')) {
              annotation.imageUrl = Buffer.from(annotation.imageUrl.split(',')[1], 'base64');
            }
          });
        }
      });
  
      const formData = new Form({ siteID, operators });
      await formData.save();
      res.status(201).json({ message: 'Form data saved successfully', formData });
    } catch (error) {
      console.error('Error saving form data:', error);
      res.status(500).json({ message: 'Error saving form data', error });
    }
  });

  router.get("/ins-get", async (req, res) => {
    try {
      const forms = await Form.find(); // Fetch all forms from the database

      // Helper function to process image fields
      const processImageField = (imageUrl) =>
        imageUrl && Buffer.isBuffer(imageUrl)
          ? `data:image/jpeg;base64,${imageUrl.toString("base64")}`
          : null; // Return null if no valid image is found

      // Function to process nested structures
      const formatData = (forms) =>
        forms.map((form) => ({
          ...form.toObject(), // Convert form to plain object
          operators: form.operators.map((operator) => ({
            ...operator,
            azimuthAngles: operator.azimuthAngles.map((angle) => ({
              ...angle,
              imageUrl: processImageField(angle.imageUrl), // Process azimuth angle images
            })),
            annotations: operator.annotations.map((annotation) => ({
              ...annotation,
              imageUrl: processImageField(annotation.imageUrl), // Process annotation images
            })),
          })),
        }));

      // Format all forms
      const formattedForms = formatData(forms);

      res.status(200).json(formattedForms); // Return processed data
    } catch (error) {
      console.error("Error retrieving form data:", error);
      res.status(500).json({ message: "Error retrieving form data", error });
    }
  });
  
export default router;