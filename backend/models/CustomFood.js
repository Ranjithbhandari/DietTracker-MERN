import mongoose from 'mongoose';

const customFoodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  brand: {
    type: String,
    trim: true,
    maxlength: 50
  },
  // Nutrition per 100g
  calories: {
    type: Number,
    required: true,
    min: 0
  },
  protein: {
    type: Number,
    required: true,
    min: 0
  },
  carbs: {
    type: Number,
    required: true,
    min: 0
  },
  fat: {
    type: Number,
    required: true,
    min: 0
  },
  fiber: {
    type: Number,
    default: 0,
    min: 0
  },
  sugar: {
    type: Number,
    default: 0,
    min: 0
  },
  sodium: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['grains', 'vegetables', 'fruits', 'dairy', 'meat', 'snacks', 'beverages', 'other'],
    default: 'other'
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for efficient queries
customFoodSchema.index({ userId: 1, name: 1 });
customFoodSchema.index({ isPublic: 1, category: 1 });

export default mongoose.model('CustomFood', customFoodSchema);