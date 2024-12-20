import mongoose from 'mongoose';

const antennaLayoutSchema = new mongoose.Schema({
    siteId: String,
    reportVersion: String,
    scanDate: String,
    mountLevel: String,
    noOperators: String,
    location: String,
    AntennaLayouta2: {
        radCenter: { type: String, required: true },
        azimuth: { type: String, required: true },
        mechTilt: { type: String, required: true },
    },
    AntennaLayoutb2: {
        radCenter: { type: String, required: true },
        azimuth: { type: String, required: true },
        mechTilt: { type: String, required: true },
    },
    AntennaLayoutc2: {
        radCenter: { type: String, required: true },
        azimuth: { type: String, required: true },
        mechTilt: { type: String, required: true },
    },
    image: { type: Buffer }, // Enable storing image in binary format
    a2Swing: {
        radCenter: { type: String, },
        azimuth: { type: String, },
        mechTilt: { type: String,  },
        skew: { type: String, required: true  },
        antSwingAngleNeg: { type: String , required: true },
        antSwingAnglePos: { type: String, required: true  },
    },
    b2Swing: {
        radCenter: { type: String , required: true   },
        azimuth: { type: String , required: true   },
        mechTilt: { type: String , required: true  },
        skew: { type: String , required: true   },
        antSwingAngleNeg: { type: String  , required: true  },
        antSwingAnglePos: { type: String , required: true   },
    },
    c2Swing: {
        radCenter: { type: String , required: true   },
        azimuth: { type: String  , required: true  },
        mechTilt: { type: String  , required: true  },
        skew: { type: String , required: true   },
        antSwingAngleNeg: { type: String , required: true   },
        antSwingAnglePos: { type: String , required: true   },
    },

 mounts: {
        sectorA: {
            memberSchedule: {
                p1Size: String,
                p1Length: String,
                p2Size: String,
                p2Length: String,
            },
            dimensions: {
                A: String,
                B: String,
                C: String,
                D: String,
                E: String,
                F: String,
            }
        },
        sectorB: {
            memberSchedule: {
                p1Size: String,
                p1Length: String,
                p2Size: String,
                p2Length: String,
            },
            dimensions: {
                A: String,
                B: String,
                C: String,
                D: String,
                E: String,
                F: String,
            }
        },
        sectorC: {
            memberSchedule: {
                p1Size: String,
                p1Length: String,
                p2Size: String,
                p2Length: String,
            },
            dimensions: {
                A: String,
                B: String,
                C: String,
                D: String,
                E: String,
                F: String,
            }
        }
    }

  });
  

const AntennaLayout = mongoose.model('AntennaLayout', antennaLayoutSchema);
export default AntennaLayout;
