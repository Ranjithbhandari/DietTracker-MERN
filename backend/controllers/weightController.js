import Weight from '../models/Weight.js';

// Get weight history
export const getWeightHistory = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const weights = await Weight.find({
      userId: req.user.id,
      date: { $gte: startDate }
    }).sort({ date: -1 });

    res.json(weights);
  } catch (error) {
    console.error('Weight history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add weight entry
export const addWeight = async (req, res) => {
  try {
    const { weight, date, notes } = req.body;

    if (!weight || weight <= 0) {
      return res.status(400).json({ message: 'Valid weight is required' });
    }

    const weightEntry = new Weight({
      userId: req.user.id,
      weight: parseFloat(weight),
      date: date ? new Date(date) : new Date(),
      notes
    });

    await weightEntry.save();
    res.json(weightEntry);
  } catch (error) {
    console.error('Add weight error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get latest weight with trend
export const getLatestWeight = async (req, res) => {
  try {
    const latestWeight = await Weight.findOne({
      userId: req.user.id
    }).sort({ date: -1 });

    if (!latestWeight) {
      return res.json(null);
    }

    // Get previous weight for trend calculation
    const previousWeight = await Weight.findOne({
      userId: req.user.id,
      date: { $lt: latestWeight.date }
    }).sort({ date: -1 });

    let trend = 'stable';
    if (previousWeight) {
      const difference = latestWeight.weight - previousWeight.weight;
      if (difference > 0.5) trend = 'up';
      else if (difference < -0.5) trend = 'down';
    }

    res.json({
      ...latestWeight.toObject(),
      trend
    });
  } catch (error) {
    console.error('Latest weight error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get weight trend
export const getWeightTrend = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentWeights = await Weight.find({
      userId: req.user.id,
      date: { $gte: thirtyDaysAgo }
    }).sort({ date: 1 });

    if (recentWeights.length < 2) {
      return res.json({
        trend: 'insufficient_data',
        change: 0,
        averageWeeklyChange: 0
      });
    }

    const firstWeight = recentWeights[0].weight;
    const lastWeight = recentWeights[recentWeights.length - 1].weight;
    const totalChange = lastWeight - firstWeight;
    const daysDiff = Math.max(1, (recentWeights[recentWeights.length - 1].date - recentWeights[0].date) / (1000 * 60 * 60 * 24));
    const averageWeeklyChange = (totalChange / daysDiff) * 7;

    let trend = 'stable';
    if (Math.abs(averageWeeklyChange) > 0.2) {
      trend = averageWeeklyChange > 0 ? 'gaining' : 'losing';
    }

    res.json({
      trend,
      change: Math.round(totalChange * 10) / 10,
      averageWeeklyChange: Math.round(averageWeeklyChange * 10) / 10,
      dataPoints: recentWeights.length
    });
  } catch (error) {
    console.error('Weight trend error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete weight entry
export const deleteWeight = async (req, res) => {
  try {
    const weight = await Weight.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!weight) {
      return res.status(404).json({ message: 'Weight entry not found' });
    }

    await Weight.findByIdAndDelete(req.params.id);
    res.json({ message: 'Weight entry deleted successfully' });
  } catch (error) {
    console.error('Weight delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};