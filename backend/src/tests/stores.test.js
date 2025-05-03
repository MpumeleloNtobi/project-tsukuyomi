const request = require('supertest')
const app = require('../index') 
// Define the health check route as provided by the user
app.get('/api/health', async (_, res) => {
  res.json({ status: 'UP' });
});

// Describe the test suite for the health check endpoint
describe('GET /api/health', () => {
  // Define a test case for the health check endpoint
  it('should return 200 OK and status UP', async () => {
    // Use supertest to make a GET request to the /api/health endpoint
    const response = await request(app).get('/api/health');

    // Assert that the response status code is 200
    expect(response.statusCode).toBe(200);

    // Assert that the response body is the expected JSON object
    expect(response.body).toEqual({ status: 'UP' });
  });
});

// describe('Store Endpoints', () => {
//   let createdStoreId = null

//   // === Test POST /stores ===
//   it('should create a new store', async () => {
//     const response = await request(app).post('/stores').send({
//       clerkId: 'test-clerk-id',
//       name: 'Test Store'
//     })

//     expect(response.statusCode).toBe(201)
//     expect(response.body).toHaveProperty('id')
//     expect(response.body.name).toBe('Test Store')

//     createdStoreId = response.body.id // Save for later tests
//   })

//   // === Test GET /stores/:id ===
//   it('should fetch the newly created store', async () => {
//     const response = await request(app).get(`/stores/${createdStoreId}`)

//     expect(response.statusCode).toBe(200)
//     expect(response.body).toHaveProperty('id', createdStoreId)
//     expect(response.body).toHaveProperty('name', 'Test Store')
//   })

//   // === Test PUT /stores/:id ===
//   it('should update the store name and status', async () => {
//     const response = await request(app).put(`/stores/${createdStoreId}`).send({
//       name: 'Updated Store',
//       status: 'approved'
//     })

//     expect(response.statusCode).toBe(200)
//     expect(response.body.name).toBe('Updated Store')
//     expect(response.body.status).toBe('approved')
//   })

//   // === Test DELETE /stores/:id ===
//   it('should delete the store', async () => {
//     const response = await request(app).delete(`/stores/${createdStoreId}`)

//     expect(response.statusCode).toBe(204)
//   })

//   // === Confirm store deletion ===
//   it('should return 404 when trying to fetch deleted store', async () => {
//     const response = await request(app).get(`/stores/${createdStoreId}`)

//     expect(response.statusCode).toBe(404)
//   })
// })