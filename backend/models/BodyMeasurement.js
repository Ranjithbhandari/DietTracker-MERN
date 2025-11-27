import mongoose from 'mongoose';

const bodyMeasurementSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  // Measurements in cm
  neck: {
    type: Number,
    min: 20,
    max: 60
  },
  waist: {
    type: Number,
    min: 40,
    max: 200
  },
  hips: {
    type: Number,
    min: 50,
    max: 200
  },
  chest: {
    type: Number,
    min: 60,
    max: 200
  },
  bicep: {
    type: Number,
    min: 15,
    max: 60
  },
  thigh: {
    type: Number,
    min: 30,
    max: 100
  },
  // Calculated values
  bodyFatPercentage: {
    type: Number,
    min: 3,
    max: 50
  },
  muscleMass: {
    type: Number
  },
  notes: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Index for efficient queries
bodyMeasurementSchema.index({ userId: 1, date: -1 });

export default mongoose.model('BodyMeasurement', bodyMeasurementSchema);