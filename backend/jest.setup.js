// Jest setup for ES modules and MongoDB
import { jest } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key-for-testing-purposes-only';

// Global test setup
global.jest = jest;