import express from 'express';
import Recipe from '../models/Recipe.js';
import CustomFood from '../models/CustomFood.js';
import { protect as auth } from '../middleware/auth.js';
import indianFoods from '../data/indianFoods.js';

const router = express.Router();

// Get user's recipes
router.get('/', auth, async (req, res) => {
  try {
    const { search, tags } = req.query;
    let query = { userId: req.user.id };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    const recipes = await Recipe.find(query).sort({ name: 1 });
    res.json(recipes);
  } catch (error) {
    console.error('Recipes fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get recipe by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      $or: [
        { userId: req.user.id },
        { isPublic: true }
      ]
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Recipe fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate nutrition for ingredients
const calculateNutrition = async (ingredients) => {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;

  for (const ingredient of ingredients) {
    let nutrition = null;

    if (ingredient.isCustomFood) {
      // Get from custom foods
      const customFood = await CustomFood.findById(ingredient.foodId);
      if (customFood) {
        nutrition = {
          calories: customFood.calories,
          protein: customFood.protein,
          carbs: customFood.carbs,
          fat: customFood.fat
        };
      }
    } else {
      // Get from Indian foods
      const food = indianFoods.find(f => f.id === ingredient.foodId);
      if (food) {
        nutrition = {
          calories: food.calories,
          protein: food.protein,
          carbs: food.carbs,
          fat: food.fat
        };
      }
    }

    if (nutrition) {
      const multiplier = ingredient.quantity / 100; // Nutrition is per 100g
      totalCalories += nutrition.calories * multiplier;
      totalProtein += nutrition.protein * multiplier;
      totalCarbs += nutrition.carbs * multiplier;
      totalFat += nutrition.fat * multiplier;
    }
  }

  return {
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10
  };
};

// Create recipe
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      description,
      servings,
      ingredients,
      prepTime,
      cookTime,
      instructions,
      tags,
      photo
    } = req.body;

    if (!name || !ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ 
        message: 'Name and at least one ingredient are required' 
      });
    }

    // Calculate total nutrition
    const nutrition = await calculateNutrition(ingredients);

    const recipe = new Recipe({
      userId: req.user.id,
      name: name.trim(),
      description: description?.trim(),
      servings: servings || 1,
      ingredients,
      ...nutrition,
      prepTime,
      cookTime,
      instructions: instructions || [],
      tags: tags || [],
      photo
    });

    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Recipe create error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update recipe
router.put('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const {
      name,
      description,
      servings,
      ingredients,
      prepTime,
      cookTime,
      instructions,
      tags,
      photo
    } = req.body;

    if (name) recipe.name = name.trim();
    if (description !== undefined) recipe.description = description?.trim();
    if (servings) recipe.servings = servings;
    if (prepTime !== undefined) recipe.prepTime = prepTime;
    if (cookTime !== undefined) recipe.cookTime = cookTime;
    if (instructions) recipe.instructions = instructions;
    if (tags) recipe.tags = tags;
    if (photo !== undefined) recipe.photo = photo;

    // Recalculate nutrition if ingredients changed
    if (ingredients && Array.isArray(ingredients)) {
      recipe.ingredients = ingredients;
      const nutrition = await calculateNutrition(ingredients);
      Object.assign(recipe, nutrition);
    }

    await recipe.save();
    res.json(recipe);
  } catch (error) {
    console.error('Recipe update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete recipe
router.delete('/:id', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Recipe delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public recipes
router.get('/public/all', auth, async (req, res) => {
  try {
    const { search, tags, limit = 20 } = req.query;
    let query = { isPublic: true };

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }

    const recipes = await Recipe.find(query)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .select('-userId'); // Don't expose user IDs

    res.json(recipes);
  } catch (error) {
    console.error('Public recipes fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make recipe public/private
router.put('/:id/public', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    recipe.isPublic = !recipe.isPublic;
    await recipe.save();

    res.json({ 
      message: `Recipe ${recipe.isPublic ? 'made public' : 'made private'}`,
      isPublic: recipe.isPublic
    });
  } catch (error) {
    console.error('Toggle recipe public error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;