const request = require('supertest')
const { app, productsRoute } = require('../index') // or wherever you're initializing it
const { v4: uuidv4 } = require('uuid')

const testDbUrl = 'postgresql://neondb_owner:npg_ZUgQeMX64rTm@ep-dry-term-a8pxk2za-pooler.eastus2.azure.neon.tech/neondb?sslmode=require'

// Assuming this initializes the routes
beforeAll(() => {
  productsRoute(app, testDbUrl)
})

describe('Product Routes', () => {
  let storeId
  let productId

  
  beforeAll(async () => {
    const storeRes = await request(app).post('/stores').send({
      clerkId: 'user_2weIquySWssq85GcSQenYQ0ZQKa',
      storeName: 'Product Store',
      storeDescription: 'For product tests',
      stitchClientKey: 'test_key',
      stitchClientSecret: 'test_secret',
      town: 'Townsville',
      postalCode: '12345',
      streetName: 'Main',
      streetNumber: '42'
    })
    storeId = storeRes.body.id
  })

  afterAll(async () => {
    if (storeId) {
      await request(app).delete(`/stores/${storeId}`)
    }
  })

  test('POST /products - should create a product', async () => {
    const res = await request(app).post('/products').send({
      storeId,
      name: 'Test Product',
      description: 'A good product',
      price: 9.99,
      stockQuantity: 100,
      category: 'Test',
      imageUrl: 'http://image.url/product.png'
    })

    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    productId = res.body.id
  })

  test('GET /products/:id - should return the product', async () => {
    const res = await request(app).get(`/products/${productId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.id).toBe(productId)
  })

  test('PUT /products/:id - should update the product', async () => {
    const res = await request(app).put(`/products/${productId}`).send({
      name: 'Updated Product',
      stockQuantity: 50
    })
    expect(res.statusCode).toBe(200)
    expect(res.body.name).toBe('Updated Product')
    expect(res.body.stockQuantity).toBe(50)
  })

  test('DELETE /products/:id - should delete the product', async () => {
    const res = await request(app).delete(`/products/${productId}`)
    expect(res.statusCode).toBe(204)
  })

  test('GET /products/:id - should return 404 after deletion', async () => {
    const res = await request(app).get(`/products/${productId}`)
    expect(res.statusCode).toBe(400)
  })
})
