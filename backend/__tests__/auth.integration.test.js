import fc from 'fast-check';
import User from '../models/User.js';
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

describe('Property 4: Data isolation', () => {
  // Feature: diet-tracker, Property 4: Data isolation
  it('should only return data belonging to authenticated user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          name1: fc.string({ minLength: 1, maxLength: 100 }),
          email1: fc.emailAddress(),
          password1: fc.string({ minLength: 6, maxLength: 50 }),
          name2: fc.string({ minLength: 1, maxLength: 100 }),
          email2: fc.emailAddress(),
          password2: fc.string({ minLength: 6, maxLength: 50 }),
        }),
        async (userData) => {
          // Create two different users
          const user1 = await User.create({
            name: userData.name1,
            email: userData.email1,
            password: userData.password1,
          });

          const user2 = await User.create({
            name: userData.name2,
            email: userData.email2,
            password: userData.password2,
          });

          // Each user should only see their own data
          const retrievedUser1 = await User.findById(user1._id);
          const retrievedUser2 = await User.findById(user2._id);

          expect(retrievedUser1._id).toEqual(user1._id);
          expect(retrievedUser2._id).toEqual(user2._id);
          expect(retrievedUser1._id).not.toEqual(retrievedUser2._id);
          expect(retrievedUser1.email).toBe(userData.email1);
          expect(retrievedUser2.email).toBe(userData.email2);
        }
      ),
      { numRuns: 50 }
    );
  });
});
