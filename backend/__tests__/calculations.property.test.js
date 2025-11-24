import fc from 'fast-check';
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacros,
  calculateAssessment,
} from '../utils/calculations.js';

describe('Property 5: BMR calculation correctness', () => {
  // Feature: diet-tracker, Property 5: BMR calculation correctness
  it('should calculate BMR correctly using Mifflin-St Jeor equation', () => {
    fc.assert(
      fc.property(
        fc.record({
          age: fc.integer({ min: 1, max: 150 }),
          height: fc.integer({ min: 50, max: 300 }),
          weight: fc.integer({ min: 20, max: 500 }),
          gender: fc.constantFrom('male', 'female'),
        }),
        (data) => {
          const bmr = calculateBMR(data.age, data.gender, data.height, data.weight);
          
          // Calculate expected BMR
          let expectedBMR;
          if (data.gender === 'male') {
            expectedBMR = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
          } else {
            expectedBMR = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
          }
          
          expect(bmr).toBe(expectedBMR);
          expect(bmr).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 6: TDEE calculation correctness', () => {
  // Feature: diet-tracker, Property 6: TDEE calculation correctness
  it('should calculate TDEE by multiplying BMR with activity level multiplier', () => {
    fc.assert(
      fc.property(
        fc.record({
          bmr: fc.integer({ min: 1000, max: 3000 }),
          activityLevel: fc.constantFrom('sedentary', 'light', 'moderate', 'active', 'very_active'),
        }),
        (data) => {
          const tdee = calculateTDEE(data.bmr, data.activityLevel);
          
          const multipliers = {
            sedentary: 1.2,
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            very_active: 1.9,
          };
          
          const expectedTDEE = data.bmr * multipliers[data.activityLevel];
          
          expect(tdee).toBe(expectedTDEE);
          expect(tdee).toBeGreaterThan(data.bmr);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 7: Calorie target calculation correctness', () => {
  // Feature: diet-tracker, Property 7: Calorie target calculation correctness
  it('should calculate calorie target based on goal', () => {
    fc.assert(
      fc.property(
        fc.record({
          tdee: fc.integer({ min: 1500, max: 4000 }),
          goal: fc.constantFrom('lose', 'maintain', 'gain'),
        }),
        (data) => {
          const target = calculateCalorieTarget(data.tdee, data.goal);
          
          let expectedTarget;
          if (data.goal === 'lose') {
            expectedTarget = data.tdee - 500;
          } else if (data.goal === 'gain') {
            expectedTarget = data.tdee + 500;
          } else {
            expectedTarget = data.tdee;
          }
          
          expect(target).toBe(expectedTarget);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 8: Macro distribution calculation correctness', () => {
  // Feature: diet-tracker, Property 8: Macro distribution calculation correctness
  it('should calculate macros according to diet type percentages', () => {
    fc.assert(
      fc.property(
        fc.record({
          calories: fc.integer({ min: 1000, max: 5000 }),
          dietType: fc.constantFrom('balanced', 'low_carb', 'high_protein', 'keto'),
        }),
        (data) => {
          const macros = calculateMacros(data.calories, data.dietType);
          
          const distributions = {
            balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
            low_carb: { protein: 0.35, carbs: 0.25, fat: 0.4 },
            high_protein: { protein: 0.4, carbs: 0.3, fat: 0.3 },
            keto: { protein: 0.25, carbs: 0.05, fat: 0.7 },
          };
          
          const dist = distributions[data.dietType];
          const expectedProtein = Math.round((data.calories * dist.protein) / 4);
          const expectedCarbs = Math.round((data.calories * dist.carbs) / 4);
          const expectedFat = Math.round((data.calories * dist.fat) / 9);
          
          expect(macros.protein).toBe(expectedProtein);
          expect(macros.carbs).toBe(expectedCarbs);
          expect(macros.fat).toBe(expectedFat);
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 9: Assessment data persistence', () => {
  // Feature: diet-tracker, Property 9: Assessment data persistence
  it('should calculate and return consistent assessment data', () => {
    fc.assert(
      fc.property(
        fc.record({
          age: fc.integer({ min: 1, max: 150 }),
          gender: fc.constantFrom('male', 'female'),
          height: fc.integer({ min: 50, max: 300 }),
          weight: fc.integer({ min: 20, max: 500 }),
          activityLevel: fc.constantFrom('sedentary', 'light', 'moderate', 'active', 'very_active'),
          goal: fc.constantFrom('lose', 'maintain', 'gain'),
          dietType: fc.constantFrom('balanced', 'low_carb', 'high_protein', 'keto'),
        }),
        (data) => {
          const assessment1 = calculateAssessment(
            data.age,
            data.gender,
            data.height,
            data.weight,
            data.activityLevel,
            data.goal,
            data.dietType
          );
          
          const assessment2 = calculateAssessment(
            data.age,
            data.gender,
            data.height,
            data.weight,
            data.activityLevel,
            data.goal,
            data.dietType
          );
          
          // Same inputs should produce same outputs
          expect(assessment1.bmr).toBe(assessment2.bmr);
          expect(assessment1.tdee).toBe(assessment2.tdee);
          expect(assessment1.calorieTarget).toBe(assessment2.calorieTarget);
          expect(assessment1.macros).toEqual(assessment2.macros);
        }
      ),
      { numRuns: 100 }
    );
  });
});
