import mongoose from 'mongoose';

const fastingSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['16:8', '18:6', '20:4', '24:0', 'custom'],
    required: true
  },
  fastingHours: {
    type: Number,
    required: true,
    min: 12,
    max: 48
  },
  eatingHours: {
    type: Number,
    required: true,
    min: 0,
    max: 12
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'broken'],
    default: 'active'
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for efficient queries
fastingSessionSchema.index({ userId: 1, startTime: -1 });

export default mongoose.model('FastingSession', fastingSessionSchema);