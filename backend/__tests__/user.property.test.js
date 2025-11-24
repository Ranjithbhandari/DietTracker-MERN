import fc from 'fast-check';
import User from '../models/User.js';
import { calculateAssessment } from '../utils/calculations.js';
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

afterEach(async () => {
  await User.deleteMany({});
});

describe('Property 9: Assessment data persistence', () => {
  // Feature: diet-tracker, Property 9: Assessment data persistence
  it('should save and retrieve assessment data consistently', async () => {
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
          // Calculate expected assessment
          const expectedAssessment = calculateAssessment(
            userData.age,
            userData.gender,
            userData.height,
            userData.weight,
            userData.activityLevel,
            userData.goal,
            userData.dietType
          );

          // Create user with assessment
          const user = await User.create({
            name: userData.name,
            email: userData.email,
            password: userData.password,
            age: userData.age,
            gender: userData.gender,
            height: userData.height,
            weight: userData.weight,
            activityLevel: userData.activityLevel,
            goal: userData.goal,
            dietType: userData.dietType,
            calorieTarget: expectedAssessment.calorieTarget,
            macros: expectedAssessment.macros,
          });

          // Retrieve user
          const retrievedUser = await User.findById(user._id);

          // Verify all assessment data matches
          expect(retrievedUser.calorieTarget).toBe(expectedAssessment.calorieTarget);
          expect(retrievedUser.macros.protein).toBe(expectedAssessment.macros.protein);
          expect(retrievedUser.macros.carbs).toBe(expectedAssessment.macros.carbs);
          expect(retrievedUser.macros.fat).toBe(expectedAssessment.macros.fat);
        }
      ),
      { numRuns: 50 }
    );
  });
});
