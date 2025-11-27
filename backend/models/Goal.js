import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['weight_loss', 'weight_gain', 'muscle_gain', 'maintenance', 'body_fat', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  startValue: {
    type: Number,
    required: true
  },
  targetValue: {
    type: Number,
    required: true
  },
  currentValue: {
    type: Number,
    default: function() { return this.startValue; }
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'lbs', '%', 'cm', 'inches']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  milestones: [{
    date: Date,
    value: Number,
    note: String
  }],
  reminderFrequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'none'],
    default: 'weekly'
  }
}, {
  timestamps: true
});

// Index for efficient queries
goalSchema.index({ userId: 1, status: 1, targetDate: 1 });

export default mongoose.model('Goal', goalSchema);