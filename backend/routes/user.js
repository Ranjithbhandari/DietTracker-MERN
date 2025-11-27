// backend/routes/user.js
import express from 'express';
import User from '../models/User.js';
import { protect as auth } from '../middleware/auth.js';
import { calculateAssessment } from '../utils/calculations.js';

const router = express.Router();

// PROTECT ALL ROUTES IN THIS FILE (Best practice!)
router.use(auth);

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/user/profile
// @desc    Update profile + calculate BMR/TDEE/macros
// @access  Private
router.put('/profile', async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, dietType, burnGoal } = req.body;

    // Required fields
    if (!age || !gender || !height || !weight || !activityLevel || !goal || !dietType) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields',
      });
    }

    // Burn goal validation
    if (burnGoal !== undefined && (burnGoal < 100 || burnGoal > 3000)) {
      return res.status(400).json({
        success: false,
        message: 'Daily burn goal must be 100–3000 kcal',
      });
    }

    // Calculate nutrition targets
    const assessment = calculateAssessment(
      Number(age),
      gender,
      Number(height),
      Number(weight),
      activityLevel,
      goal,
      dietType
    );

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        activityLevel,
        goal,
        dietType,
        burnGoal: burnGoal ? Number(burnGoal) : 500,
        bmr: assessment.bmr,
        tdee: assessment.tdee,
        calorieTarget: assessment.calorieTarget,
        macros: assessment.macros,
      },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/user/settings
// @desc    Update custom calorie target
// @access  Private
router.put('/settings', async (req, res) => {
  try {
    const { customCalorieTarget, useCustomTarget } = req.body;

    const updates = {};
    if (useCustomTarget && customCalorieTarget) {
      const target = Number(customCalorieTarget);
      if (target < 800 || target > 8000) {
        return res.status(400).json({
          success: false,
          message: 'Custom target must be 800–8000 kcal',
        });
      }
      updates.customCalorieTarget = target;
      updates.useCustomTarget = true;
    } else {
      updates.useCustomTarget = false;
      updates.customCalorieTarget = null;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      user,
      message: 'Settings saved!',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;