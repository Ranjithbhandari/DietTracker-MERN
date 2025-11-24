import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { calculateAssessment } from '../utils/calculations.js';

const router = express.Router();

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

// @route   PUT /api/user/profile
// @desc    Update user profile and assessment
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const { age, gender, height, weight, activityLevel, goal, dietType } = req.body;

    // Validation
    if (!age || !gender || !height || !weight || !activityLevel || !goal || !dietType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      });
    }

    // Calculate assessment
    const assessment = calculateAssessment(
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
      dietType
    );

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        age,
        gender,
        height,
        weight,
        activityLevel,
        goal,
        dietType,
        calorieTarget: assessment.calorieTarget,
        macros: assessment.macros,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
      assessment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
});

export default router;
