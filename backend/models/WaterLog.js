import mongoose from 'mongoose';

const waterLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  target: {
    type: Number,
    default: 3500 // 3.5L in ml
  }
}, {
  timestamps: true
});

// Index for efficient queries
waterLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model('WaterLog', waterLogSchema);