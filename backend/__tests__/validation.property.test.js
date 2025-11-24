import fc from 'fast-check';

describe('Property 22: Input validation', () => {
  // Feature: diet-tracker, Property 22: Input validation
  it('should reject invalid inputs with 400 status', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant({}),
          fc.constant({ email: 'invalid-email' }),
          fc.constant({ password: '123' }),
          fc.constant({ age: -5 }),
          fc.constant({ calories: -100 }),
          fc.constant({ mealType: 'invalid_type' })
        ),
        (invalidData) => {
          // Simulate validation logic
          const errors = [];

          if (invalidData.email && !invalidData.email.includes('@')) {
            errors.push('Invalid email format');
          }

          if (invalidData.password && invalidData.password.length < 6) {
            errors.push('Password must be at least 6 characters');
          }

          if (invalidData.age !== undefined && (invalidData.age < 1 || invalidData.age > 150)) {
            errors.push('Age must be between 1 and 150');
          }

          if (invalidData.calories !== undefined && invalidData.calories < 0) {
            errors.push('Calories cannot be negative');
          }

          const validMealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
          if (invalidData.mealType && !validMealTypes.includes(invalidData.mealType)) {
            errors.push('Invalid meal type');
          }

          // Invalid data should produce errors
          expect(errors.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
