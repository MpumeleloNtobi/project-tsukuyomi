const request = require('supertest')

const { app, storesRoute } = require('../index')

const testDbUrl = 'postgresql://neondb_owner:npg_ZUgQeMX64rTm@ep-dry-term-a8pxk2za-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'

beforeAll(() => {
  storesRoute(app, testDbUrl)
})

describe('Store Routes', () => {
  let createdStoreId // this will hold the ID of the store we create
  test('GET /stores - should return an array of stores', async () => {
    const res = await request(app).get('/stores')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  test('POST /stores - validation should fail on missing fields', async () => {
    const res = await request(app).post('/stores').send({
      clerkId: 'user_2vgsDIvJJuDUsGTYO4nM956nKG6',
      storeName: 'Test Store'
      // Missing required fields like description, address...
    })

    expect(res.statusCode).toBe(400)
    expect(res.text).toMatch(/missing fields/i)
  })

  test('POST /stores - should create a store', async () => {
    const res = await request(app).post('/stores').send({
      clerkId: 'user_2weIquySWssq85GcSQenYQ0ZQKa',
      storeName: 'Test Store',
      storeDescription: 'Test description',
      stitchClientKey: 'client_key_123',
      stitchClientSecret: 'client_secret_123',
      town: 'Test Town',
      postalCode: '12345',
      streetName: 'Main St',
      streetNumber: '12'
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe('Test Store')
    createdStoreId = res.body.id // Save the ID for later tests
  })

  test('PUT /stores/:store_id - should update store name and status', async () => {
    const res = await request(app).put(`/stores/${createdStoreId}`).send({
      name: 'Updated Store Name',
      status: 'approved'
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('Updated Store Name')
    expect(res.body.status).toBe('approved')
  })

  test('DELETE /stores/:store_id - should delete the store', async () => {
    const res = await request(app).delete(`/stores/${createdStoreId}`)
    expect(res.statusCode).toBe(204)

    // Confirm deletion with a follow-up GET
    const followUp = await request(app).get(`/stores/${createdStoreId}`)
    expect(followUp.statusCode).toBe(404)
  })
})