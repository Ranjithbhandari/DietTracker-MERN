import fc from 'fast-check';
import User from '../models/User.js';
import Meal from '../models/Meal.js';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Property 17: User schema completeness', () => {
  // Feature: diet-tracker, Property 17: User schema completeness
  it('should store all required User fields', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
          age: fc.integer({ min: 1, max: 150 }),
          gender: fc.constantFrom('male', 'female'),
          height: fc.integer({ min: 50, max: 300 }),
          weight: fc.integer({ min: 20, max: 500 }),
          activityLevel: fc.constantFrom('sedentary', 'light', 'moderate', 'active', 'very_active'),
          goal: fc.constantFrom('lose', 'maintain', 'gain'),
          dietType: fc.constantFrom('balanced', 'low_carb', 'high_protein', 'keto'),
        }),
        async (userData) => {
          const user = new User(userData);
          expect(user.name).toBe(userData.name);
          expect(user.email).toBe(userData.email.toLowerCase());
          expect(user.age).toBe(userData.age);
          expect(user.gender).toBe(userData.gender);
          expect(user.height).toBe(userData.height);
          expect(user.weight).toBe(userData.weight);
          expect(user.activityLevel).toBe(userData.activityLevel);
          expect(user.goal).toBe(userData.goal);
          expect(user.dietType).toBe(userData.dietType);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 18: Meal schema completeness', () => {
  // Feature: diet-tracker, Property 18: Meal schema completeness
  it('should store all required Meal fields', async () => {
    const userId = new mongoose.Types.ObjectId();
    
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
          const meal = new Meal({
            userId,
            date: new Date(),
            ...mealData,
          });
          expect(meal.userId).toEqual(userId);
          expect(meal.mealType).toBe(mealData.mealType);
          expect(meal.foodName).toBe(mealData.foodName);
          expect(meal.calories).toBe(mealData.calories);
          expect(meal.protein).toBe(mealData.protein);
          expect(meal.carbs).toBe(mealData.carbs);
          expect(meal.fat).toBe(mealData.fat);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 1: Password hashing integrity', () => {
  // Feature: diet-tracker, Property 1: Password hashing integrity
  it('should hash password and allow verification', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name: fc.string({ minLength: 1, maxLength: 100 }),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 6, maxLength: 50 }),
        }),
        async (userData) => {
          const user = new User(userData);
          const plainPassword = userData.password;
          
          // Password should be hashed before saving
          expect(user.password).not.toBe(plainPassword);
          
          // matchPassword method should verify correctly
          const isMatch = await user.matchPassword(plainPassword);
          expect(isMatch).toBe(true);
          
          // Wrong password should not match
          const wrongMatch = await user.matchPassword('wrongpassword');
          expect(wrongMatch).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
