const request = require('supertest');
const app = require('../app');

describe('Health Check Endpoint', () => {
  it('should return status 200 with UP message', async () => {
    const response = await request(app).get('/api/health/');
    
    // Assert status code
    expect(response.status).toBe(200);
    // Assert response body contains { status: 'UP' }
    expect(response.body.status).toBe('UP');
  });
});
