import mongoose from 'mongoose';

const recipeIngredientSchema = new mongoose.Schema({
  foodId: {
    type: String, // Can be from indianFoods or CustomFood._id
    required: true
  },
  foodName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    default: 'g'
  },
  isCustomFood: {
    type: Boolean,
    default: false
  }
});

const recipeSchema = new mongoose.Schema({
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
  description: {
    type: String,
    maxlength: 500
  },
  servings: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  ingredients: [recipeIngredientSchema],
  // Calculated nutrition per serving
  totalCalories: {
    type: Number,
    required: true
  },
  totalProtein: {
    type: Number,
    required: true
  },
  totalCarbs: {
    type: Number,
    required: true
  },
  totalFat: {
    type: Number,
    required: true
  },
  prepTime: {
    type: Number, // in minutes
    min: 0
  },
  cookTime: {
    type: Number, // in minutes
    min: 0
  },
  instructions: [{
    step: Number,
    instruction: String
  }],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  photo: {
    type: String // URL or base64
  }
}, {
  timestamps: true
});

// Index for efficient queries
recipeSchema.index({ userId: 1, name: 1 });
recipeSchema.index({ isPublic: 1, tags: 1 });

export default mongoose.model('Recipe', recipeSchema);