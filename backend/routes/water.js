import express from 'express';
import WaterLog from '../models/WaterLog.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

// Get today's water intake
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const waterLogs = await WaterLog.find({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: -1 });

    const totalAmount = waterLogs.reduce((sum, log) => sum + log.amount, 0);
    const target = waterLogs.length > 0 ? waterLogs[0].target : 3500;

    res.json({
      logs: waterLogs,
      totalAmount,
      target,
      percentage: Math.round((totalAmount / target) * 100)
    });
  } catch (error) {
    console.error('Water fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add water intake
router.post('/add', auth, async (req, res) => {
  try {
    const { amount, target = 3500 } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    const waterLog = new WaterLog({
      userId: req.user.id,
      amount,
      target
    });

    await waterLog.save();

    // Get updated today's total
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayLogs = await WaterLog.find({
      userId: req.user.id,
      date: { $gte: today, $lt: tomorrow }
    });

    const totalAmount = todayLogs.reduce((sum, log) => sum + log.amount, 0);

    res.json({
      waterLog,
      totalAmount,
      target,
      percentage: Math.round((totalAmount / target) * 100)
    });
  } catch (error) {
    console.error('Water add error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update water target
router.put('/target', auth, async (req, res) => {
  try {
    const { target } = req.body;

    if (!target || target <= 0) {
      return res.status(400).json({ message: 'Valid target is required' });
    }

    // Update today's logs with new target
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    await WaterLog.updateMany(
      {
        userId: req.user.id,
        date: { $gte: today, $lt: tomorrow }
      },
      { target }
    );

    res.json({ message: 'Target updated successfully', target });
  } catch (error) {
    console.error('Water target update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get water history (last 30 days)
router.get('/history', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const waterLogs = await WaterLog.aggregate([
      {
        $match: {
          userId: req.user.id,
          date: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          target: { $first: '$target' },
          date: { $first: '$date' }
        }
      },
      {
        $sort: { date: -1 }
      }
    ]);

    res.json(waterLogs);
  } catch (error) {
    console.error('Water history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;