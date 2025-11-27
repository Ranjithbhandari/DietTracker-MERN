import express from 'express';
import FastingSession from '../models/FastingSession.js';
import { protect as auth } from '../middleware/auth.js';

const router = express.Router();

// Get active fasting session
router.get('/active', auth, async (req, res) => {
  try {
    const activeSession = await FastingSession.findOne({
      userId: req.user.id,
      status: 'active',
      endTime: { $gt: new Date() }
    }).sort({ startTime: -1 });

    res.json(activeSession);
  } catch (error) {
    console.error('Active fasting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start fasting session
router.post('/start', auth, async (req, res) => {
  try {
    const { type, fastingHours, eatingHours, startTime } = req.body;

    if (!type || !fastingHours || !startTime) {
      return res.status(400).json({ message: 'Type, fasting hours, and start time are required' });
    }

    // End any active sessions
    await FastingSession.updateMany(
      { userId: req.user.id, status: 'active' },
      { status: 'broken' }
    );

    const start = new Date(startTime);
    const end = new Date(start.getTime() + (fastingHours * 60 * 60 * 1000));

    const fastingSession = new FastingSession({
      userId: req.user.id,
      type,
      fastingHours,
      eatingHours: eatingHours || (24 - fastingHours),
      startTime: start,
      endTime: end
    });

    await fastingSession.save();
    res.json(fastingSession);
  } catch (error) {
    console.error('Start fasting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete fasting session
router.put('/complete/:id', auth, async (req, res) => {
  try {
    const session = await FastingSession.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ message: 'Active fasting session not found' });
    }

    session.status = 'completed';
    session.completedAt = new Date();
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Complete fasting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Break fasting session
router.put('/break/:id', auth, async (req, res) => {
  try {
    const session = await FastingSession.findOne({
      _id: req.params.id,
      userId: req.user.id,
      status: 'active'
    });

    if (!session) {
      return res.status(404).json({ message: 'Active fasting session not found' });
    }

    session.status = 'broken';
    await session.save();

    res.json(session);
  } catch (error) {
    console.error('Break fasting error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fasting history
router.get('/history', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const sessions = await FastingSession.find({
      userId: req.user.id,
      startTime: { $gte: startDate }
    }).sort({ startTime: -1 });

    res.json(sessions);
  } catch (error) {
    console.error('Fasting history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get fasting statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await FastingSession.aggregate([
      {
        $match: {
          userId: req.user.id,
          startTime: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          },
          averageFastingHours: { $avg: '$fastingHours' },
          longestFast: { $max: '$fastingHours' },
          totalFastingHours: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'completed'] },
                '$fastingHours',
                0
              ]
            }
          }
        }
      }
    ]);

    const result = stats[0] || {
      totalSessions: 0,
      completedSessions: 0,
      averageFastingHours: 0,
      longestFast: 0,
      totalFastingHours: 0
    };

    result.successRate = result.totalSessions > 0 
      ? Math.round((result.completedSessions / result.totalSessions) * 100)
      : 0;

    res.json(result);
  } catch (error) {
    console.error('Fasting stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;