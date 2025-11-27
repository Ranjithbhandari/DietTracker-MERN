import mongoose from 'mongoose';

const weightSchema = new mongoose.Schema({
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
weightSchema.index({ userId: 1, date: -1 });

export default mongoose.model('Weight', weightSchema);