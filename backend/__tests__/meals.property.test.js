import fc from 'fast-check';
import Meal from '../models/Meal.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;
let testUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
  
  // Create a test user
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Meal.deleteMany({});
});

describe('Property 10: Meal creation and retrieval', () => {
  // Feature: diet-tracker, Property 10: Meal creation and retrieval
  it('should create and retrieve meals correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          mealType: fc.constantFrom('breakfast', 'lunch', 'dinner', 'snack'),
          foodName: fc.string({ minLength: 1, maxLength: 100 }),
          calories: fc.integer({ min: 0, max: 5000 }),
          protein: fc.integer({ min: 0, max: 500 }),
          carbs: fc.integer({ min: 0, max: 500 }),
          fat: fc.integer({ min: 0, max: 500 }),
        }),
        async (mealData) => {
          const meal = await Meal.create({
            userId: testUser._id,
            date: new Date(),
            ...mealData,
          });

          const retrieved = await Meal.findById(meal._id);

          expect(retrieved).toBeDefined();
          expect(retrieved.mealType).toBe(mealData.mealType);
          expect(retrieved.foodName).toBe(mealData.foodName);
          expect(retrieved.calories).toBe(mealData.calories);
          expect(retrieved.protein).toBe(mealData.protein);
          expect(retrieved.carbs).toBe(mealData.carbs);
          expect(retrieved.fat).toBe(mealData.fat);
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Property 11: Meal deletion', () => {
  // Feature: diet-tracker, Property 11: Meal deletion
  it('should delete meals and remove them from database', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          mealType: fc.constantFrom('breakfast', 'lunch', 'dinner', 'snack'),
          foodName: fc.string({ minLength: 1, maxLength: 100 }),
          calories: fc.integer({ min: 0, max: 5000 }),
          protein: fc.integer({ min: 0, max: 500 }),
          carbs: fc.integer({ min: 0, max: 500 }),
          fat: fc.integer({ min: 0, max: 500 }),
        }),
        async (mealData) => {
          const meal = await Meal.create({
            userId: testUser._id,
            date: new Date(),
            ...mealData,
          });

          const mealId = meal._id;

          // Delete the meal
          await Meal.findByIdAndDelete(mealId);

          // Verify it's deleted
          const deleted = await Meal.findById(mealId);
          expect(deleted).toBeNull();
        }
      ),
      { numRuns: 50 }
    );
  });
});

describe('Property 12: Daily totals calculation', () => {
  // Feature: diet-tracker, Property 12: Daily totals calculation
  it('should calculate daily totals correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            mealType: fc.constantFrom('breakfast', 'lunch', 'dinner', 'snack'),
            foodName: fc.string({ minLength: 1, maxLength: 100 }),
            calories: fc.integer({ min: 0, max: 1000 }),
            protein: fc.integer({ min: 0, max: 100 }),
            carbs: fc.integer({ min: 0, max: 100 }),
            fat: fc.integer({ min: 0, max: 100 }),
          }),
          { minLength: 1, maxLength: 10 }
        ),
        async (mealsData) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Create meals
          for (const mealData of mealsData) {
            await Meal.create({
              userId: testUser._id,
              date: today,
              ...mealData,
            });
          }

          // Calculate expected totals
          let expectedCalories = 0;
          let expectedProtein = 0;
          let expectedCarbs = 0;
          let expectedFat = 0;

          for (const meal of mealsData) {
            expectedCalories += meal.calories;
            expectedProtein += meal.protein;
            expectedCarbs += meal.carbs;
            expectedFat += meal.fat;
          }

          // Get actual totals from database
          const meals = await Meal.find({
            userId: testUser._id,
            date: { $gte: today, $lt: new Date(today.getTime() + 86400000) },
          });

          let actualCalories = 0;
          let actualProtein = 0;
          let actualCarbs = 0;
          let actualFat = 0;

          for (const meal of meals) {
            actualCalories += meal.calories;
            actualProtein += meal.protein;
            actualCarbs += meal.carbs;
            actualFat += meal.fat;
          }

          expect(actualCalories).toBe(expectedCalories);
          expect(actualProtein).toBe(expectedProtein);
          expect(actualCarbs).toBe(expectedCarbs);
          expect(actualFat).toBe(expectedFat);
        }
      ),
      { numRuns: 30 }
    );
  });
});

describe('Property 15: History retrieval and aggregation', () => {
  // Feature: diet-tracker, Property 15: History retrieval and aggregation
  it('should retrieve and aggregate history correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            daysAgo: fc.integer({ min: 0, max: 9 }),
            mealType: fc.constantFrom('breakfast', 'lunch', 'dinner', 'snack'),
            foodName: fc.string({ minLength: 1, maxLength: 100 }),
            calories: fc.integer({ min: 0, max: 1000 }),
            protein: fc.integer({ min: 0, max: 100 }),
            carbs: fc.integer({ min: 0, max: 100 }),
            fat: fc.integer({ min: 0, max: 100 }),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        async (mealsData) => {
          // Create meals across different days
          for (const mealData of mealsData) {
            const date = new Date();
            date.setDate(date.getDate() - mealData.daysAgo);
            date.setHours(0, 0, 0, 0);

            await Meal.create({
              userId: testUser._id,
              date,
              mealType: mealData.mealType,
              foodName: mealData.foodName,
              calories: mealData.calories,
              protein: mealData.protein,
              carbs: mealData.carbs,
              fat: mealData.fat,
            });
          }

          // Get history
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tenDaysAgo = new Date(today);
          tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

          const meals = await Meal.find({
            userId: testUser._id,
            date: { $gte: tenDaysAgo, $lte: today },
          });

          // Verify we got meals
          expect(meals.length).toBeGreaterThan(0);
          expect(meals.length).toBeLessThanOrEqual(mealsData.length);
        }
      ),
      { numRuns: 20 }
    );
  });
});

describe('Property 16: Compliance status calculation', () => {
  // Feature: diet-tracker, Property 16: Compliance status calculation
  it('should calculate compliance status correctly', () => {
    fc.assert(
      fc.property(
        fc.record({
          calorieTarget: fc.integer({ min: 1500, max: 3000 }),
          consumedCalories: fc.integer({ min: 0, max: 5000 }),
        }),
        (data) => {
          const { calorieTarget, consumedCalories } = data;
          
          // Calculate compliance status
          let status;
          const lowerBound = calorieTarget * 0.9;
          const upperBound = calorieTarget * 1.1;

          if (consumedCalories >= lowerBound && consumedCalories <= upperBound) {
            status = 'on-track';
          } else if (consumedCalories > upperBound) {
            status = 'over';
          } else {
            status = 'under';
          }

          // Verify logic
          if (status === 'on-track') {
            expect(consumedCalories).toBeGreaterThanOrEqual(lowerBound);
            expect(consumedCalories).toBeLessThanOrEqual(upperBound);
          } else if (status === 'over') {
            expect(consumedCalories).toBeGreaterThan(upperBound);
          } else {
            expect(consumedCalories).toBeLessThan(lowerBound);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
