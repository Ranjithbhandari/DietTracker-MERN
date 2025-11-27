import mongoose from 'mongoose';

const weightLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  weight: {
    type: Number,
    required: true,
    min: 20,
    max: 300
  },
  bmi: {
    type: Number
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    maxlength: 200
  }
}, {
  timestamps: true
});

// Index for efficient queries
weightLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model('WeightLog', weightLogSchema);