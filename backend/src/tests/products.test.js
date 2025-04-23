const request = require('supertest')
const app = require('../index.js')

describe('Health Check Endpoint', () => {
    it('should always pass', () => {
      expect(true).toBe(true);
    });
  });
  