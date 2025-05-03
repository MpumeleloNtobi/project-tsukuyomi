// const request = require('supertest')
// const app = require('../index') 

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