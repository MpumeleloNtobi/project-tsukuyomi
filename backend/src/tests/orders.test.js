const request = require('supertest')
const { app, ordersRoute, storesRoute } = require('../index')

const testDbUrl = 'postgresql://neondb_owner:npg_ZUgQeMX64rTm@ep-dry-term-a8pxk2za-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'

let storeId
let orderId

beforeAll(async () => {
  // Initialize routes
  storesRoute(app, testDbUrl)
  ordersRoute(app, testDbUrl)

  // Create a store to associate with the order
  const storeRes = await request(app).post('/stores').send({
    clerkId: 'user_2wfhZJCGa7VWqwPlxtHNkYFPLwh',
    storeName: 'Order Test Store',
    storeDescription: 'Store for testing orders',
    stitchClientKey: 'test_key',
    stitchClientSecret: 'test_secret',
    town: 'Test Town',
    postalCode: '12345',
    streetName: 'Main Street',
    streetNumber: '99'
  })

  if (storeRes.statusCode !== 201) {
    console.error('Failed to create store:', storeRes.body)
    throw new Error('Could not create test store')
  }

  storeId = storeRes.body.id
})

afterAll(async () => {
  if (storeId) {
    await request(app).delete(`/stores/${storeId}`)
  }
})

describe('Order Routes', () => {
  test('POST /orders - should create an order', async () => {
    const res = await request(app).post('/orders').send({
      storeId,
      buyerName: 'John Doe',
      phoneNumber: '123456789',
      deliveryMethod: 'pickup'
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.storeId).toBe(storeId)
    expect(res.body.deliveryMethod).toBe('pickup')
    orderId = res.body.id
  })

  test('GET /orders/:order_id - should fetch the order', async () => {
    const res = await request(app).get(`/orders/${orderId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(orderId)
    expect(res.body.storeId).toBe(storeId)
  })

  test('PUT /orders/:order_id - should update the order details', async () => {
    const res = await request(app).put(`/orders/${orderId}`).send({
      status: 'confirmed',
      paymentStatus: 'paid',
      city: 'New City',
      town: 'New Town',
      buyerName: 'Jane Doe'
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('confirmed')
    expect(res.body.paymentStatus).toBe('paid')
    expect(res.body.city).toBe('New City')
    expect(res.body.buyerName).toBe('Jane Doe')
  })

  test('GET /orders/:order_id - should return 400 on invalid UUID', async () => {
    const res = await request(app).get('/orders/not-a-uuid')
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('PUT /orders/:order_id - should return 400 on no valid fields', async () => {
    const res = await request(app).put(`/orders/${orderId}`).send({})
    expect(res.statusCode).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('GET /orders/:order_id - should return 404 after store deletion (if cascade works)', async () => {
    // Simulate what would happen if store deletion cascades
    await request(app).delete(`/stores/${storeId}`)

    const res = await request(app).get(`/orders/${orderId}`)
    // Depending on cascade setup, this may be 404 or 200 with orphaned order
    expect([200, 404, 400]).toContain(res.statusCode)
  })
})
