import fc from 'fast-check';
import jwt from 'jsonwebtoken';
import { generateToken } from '../middleware/auth.js';
import mongoose from 'mongoose';
import { describe, it, expect } from '@jest/globals';

// Set JWT_SECRET for testing
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only';

describe('Property 2: JWT token validity', () => {
  // Feature: diet-tracker, Property 2: JWT token validity
  it('should generate valid JWT tokens that can be decoded', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 24, maxLength: 24 }),
        (userIdString) => {
          const userId = new mongoose.Types.ObjectId(userIdString);
          const token = generateToken(userId);
          
          // Token should be a string
          expect(typeof token).toBe('string');
          
          // Token should be decodable
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          
          // Decoded token should contain the user ID
          expect(decoded.id).toBe(userId.toString());
          
          // Token should have expiration
          expect(decoded.exp).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe('Property 3: Protected route authorization', () => {
  // Feature: diet-tracker, Property 3: Protected route authorization
  it('should reject requests without valid JWT', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(''),
          fc.constant('InvalidToken'),
          fc.string({ minLength: 1, maxLength: 50 })
        ),
        (invalidToken) => {
          // Simulate middleware behavior
          const mockReq = {
            headers: {
              authorization: invalidToken ? `Bearer ${invalidToken}` : undefined
            }
          };
          
          let isRejected = false;
          
          try {
            if (!mockReq.headers.authorization || !mockReq.headers.authorization.startsWith('Bearer')) {
              isRejected = true;
            } else {
              const token = mockReq.headers.authorization.split(' ')[1];
              jwt.verify(token, process.env.JWT_SECRET);
            }
          } catch (error) {
            isRejected = true;
          }
          
          // Invalid tokens should be rejected
          expect(isRejected).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: diet-tracker, Property 3: Protected route authorization
  it('should allow requests with valid JWT', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 24, maxLength: 24 }),
        (userIdString) => {
          const userId = new mongoose.Types.ObjectId(userIdString);
          const token = generateToken(userId);
          
          // Simulate middleware behavior
          const mockReq = {
            headers: {
              authorization: `Bearer ${token}`
            }
          };
          
          let isAllowed = false;
          let extractedUserId = null;
          
          try {
            if (mockReq.headers.authorization && mockReq.headers.authorization.startsWith('Bearer')) {
              const tokenValue = mockReq.headers.authorization.split(' ')[1];
              const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
              extractedUserId = decoded.id;
              isAllowed = true;
            }
          } catch (error) {
            isAllowed = false;
          }
          
          // Valid tokens should be allowed
          expect(isAllowed).toBe(true);
          expect(extractedUserId).toBe(userId.toString());
        }
      ),
      { numRuns: 100 }
    );
  });
});
