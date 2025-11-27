import express from 'express';
import CustomFood from '../models/CustomFood.js';
import { protect as auth } from '../middleware/auth.js';
const router = express.Router();

// Get user's custom foods
router.get('/', auth, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = { userId: req.user.id };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const customFoods = await CustomFood.find(query).sort({ name: 1 });
    res.json(customFoods);
  } catch (error) {
    console.error('Custom foods fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create custom food
router.post('/', auth, async (req, res) => {
  try {
    const {
      name,
      brand,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      category
    } = req.body;

    if (!name || calories === undefined || protein === undefined || 
        carbs === undefined || fat === undefined) {
      return res.status(400).json({ 
        message: 'Name, calories, protein, carbs, and fat are required' 
      });
    }

    // Check if food already exists for this user
    const existingFood = await CustomFood.findOne({
      userId: req.user.id,
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingFood) {
      return res.status(400).json({ message: 'Food with this name already exists' });
    }

    const customFood = new CustomFood({
      userId: req.user.id,
      name: name.trim(),
      brand: brand?.trim(),
      calories,
      protein,
      carbs,
      fat,
      fiber: fiber || 0,
      sugar: sugar || 0,
      sodium: sodium || 0,
      category: category || 'other'
    });

    await customFood.save();
    res.status(201).json(customFood);
  } catch (error) {
    console.error('Custom food create error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update custom food
router.put('/:id', auth, async (req, res) => {
  try {
    const customFood = await CustomFood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customFood) {
      return res.status(404).json({ message: 'Custom food not found' });
    }

    const {
      name,
      brand,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      sugar,
      sodium,
      category
    } = req.body;

    if (name) customFood.name = name.trim();
    if (brand !== undefined) customFood.brand = brand?.trim();
    if (calories !== undefined) customFood.calories = calories;
    if (protein !== undefined) customFood.protein = protein;
    if (carbs !== undefined) customFood.carbs = carbs;
    if (fat !== undefined) customFood.fat = fat;
    if (fiber !== undefined) customFood.fiber = fiber;
    if (sugar !== undefined) customFood.sugar = sugar;
    if (sodium !== undefined) customFood.sodium = sodium;
    if (category) customFood.category = category;

    await customFood.save();
    res.json(customFood);
  } catch (error) {
    console.error('Custom food update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete custom food
router.delete('/:id', auth, async (req, res) => {
  try {
    const customFood = await CustomFood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customFood) {
      return res.status(404).json({ message: 'Custom food not found' });
    }

    await CustomFood.findByIdAndDelete(req.params.id);
    res.json({ message: 'Custom food deleted successfully' });
  } catch (error) {
    console.error('Custom food delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get public custom foods (community foods)
router.get('/public', auth, async (req, res) => {
  try {
    const { category, search, limit = 50 } = req.query;
    let query = { isPublic: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const publicFoods = await CustomFood.find(query)
      .limit(parseInt(limit))
      .sort({ name: 1 })
      .select('-userId'); // Don't expose user IDs

    res.json(publicFoods);
  } catch (error) {
    console.error('Public foods fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Make food public
router.put('/:id/public', auth, async (req, res) => {
  try {
    const customFood = await CustomFood.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!customFood) {
      return res.status(404).json({ message: 'Custom food not found' });
    }

    customFood.isPublic = !customFood.isPublic;
    await customFood.save();

    res.json({ 
      message: `Food ${customFood.isPublic ? 'made public' : 'made private'}`,
      isPublic: customFood.isPublic
    });
  } catch (error) {
    console.error('Toggle public error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;