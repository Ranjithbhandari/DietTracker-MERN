import express from 'express';
import { protect as auth } from '../middleware/auth.js';
import {
  getWeightHistory,
  addWeight,
  getLatestWeight,
  getWeightTrend,
  deleteWeight
} from '../controllers/weightController.js';

const router = express.Router();

// All routes are protected
router.use(auth);

// @route   GET /api/weight/history
router.get('/history', getWeightHistory);

// @route   GET /api/weight/latest
router.get('/latest', getLatestWeight);

// @route   GET /api/weight/trend
router.get('/trend', getWeightTrend);

// @route   POST /api/weight
router.post('/', addWeight);

// @route   DELETE /api/weight/:id
router.delete('/:id', deleteWeight);

export default router;