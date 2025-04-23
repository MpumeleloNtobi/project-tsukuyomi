const request = require('supertest')
const app = require('../index') // Adjust the import based on your project structure
const { neon } = require('@neondatabase/serverless') // For interacting with Neon DB

// Helper function to get the database connection
const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.')
  }
  return neon(process.env.DATABASE_URL)
}

// Clear products and stores after each test to ensure no residual data
afterEach(async () => {
  const sql = getDb()
  await sql`DELETE FROM products;`
  await sql`DELETE FROM stores;`
})

describe('Products API Tests', () => {
  let storeId

  beforeEach(async () => {
    // Set up a store for creating products
    const sql = getDb()
    const store = await sql`
      INSERT INTO stores ("clerkId", name) 
      VALUES ('clerk123', 'Store 1') 
      RETURNING id;`
    storeId = store[0].id // Store the ID for future use
  })

  test('POST /products - Create a product', async () => {
    const newProduct = {
      storeId,
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      stockQuantity: 10,
      category: 'Category 1',
      imageUrl: 'http://example.com/product1.jpg'
    }

    const response = await request(app)
      .post('/products')
      .send(newProduct)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('name', newProduct.name)
    expect(response.body).toHaveProperty('storeId', newProduct.storeId)
  })

  test('POST /products - Fail on missing fields', async () => {
    const newProduct = {
      storeId,
      name: 'Product 1',
      description: 'Description of Product 1',
      price: 100,
      stockQuantity: 10,
      category: 'Category 1',
      // imageUrl is missing here
    }

    const response = await request(app)
      .post('/products')
      .send(newProduct)

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Missing required fields: storeId, name, description, price, stockQuantity, category, imageUrl are required.')
  })

  test('GET /products - Get all products', async () => {
    // Insert a product first
    const sql = getDb()
    await sql`
      INSERT INTO products ("storeId", name, description, price, "stockQuantity", category, "imageUrl")
      VALUES (${storeId}, 'Product 1', 'Description of Product 1', 100, 10, 'Category 1', 'http://example.com/product1.jpg');
    `

    const response = await request(app).get('/products')
    expect(response.status).toBe(200)
    expect(response.body.length).toBeGreaterThan(0) // Expect at least one product
  })

  test('GET /products/:product_id - Get a product by ID', async () => {
    // Insert a product first
    const sql = getDb()
    const product = await sql`
      INSERT INTO products ("storeId", name, description, price, "stockQuantity", category, "imageUrl")
      VALUES (${storeId}, 'Product 1', 'Description of Product 1', 100, 10, 'Category 1', 'http://example.com/product1.jpg')
      RETURNING id;`

    const productId = product[0].id

    const response = await request(app).get(`/products/${productId}`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', productId)
  })

  test('GET /products/:product_id - Fail if product not found', async () => {
    const response = await request(app).get('/products/999999999') // An ID that doesn't exist
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product not found.')
  })

  test('PUT /products/:product_id - Update a product', async () => {
    // Insert a product first
    const sql = getDb()
    const product = await sql`
      INSERT INTO products ("storeId", name, description, price, "stockQuantity", category, "imageUrl")
      VALUES (${storeId}, 'Product 1', 'Description of Product 1', 100, 10, 'Category 1', 'http://example.com/product1.jpg')
      RETURNING id;`

    const productId = product[0].id

    const updatedProduct = {
      name: 'Updated Product',
      price: 150
    }

    const response = await request(app)
      .put(`/products/${productId}`)
      .send(updatedProduct)

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('name', updatedProduct.name)
    expect(response.body).toHaveProperty('price', updatedProduct.price)
  })

  test('PUT /products/:product_id - Fail to update non-existent product', async () => {
    const updatedProduct = { name: 'Updated Product', price: 150 }
    const response = await request(app)
      .put('/products/999999999')
      .send(updatedProduct)
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product not found')
  })

  test('DELETE /products/:product_id - Delete a product', async () => {
    // Insert a product first
    const sql = getDb()
    const product = await sql`
      INSERT INTO products ("storeId", name, description, price, "stockQuantity", category, "imageUrl")
      VALUES (${storeId}, 'Product 1', 'Description of Product 1', 100, 10, 'Category 1', 'http://example.com/product1.jpg')
      RETURNING id;`

    const productId = product[0].id

    const response = await request(app).delete(`/products/${productId}`)
    expect(response.status).toBe(204) // No content
  })

  test('DELETE /products/:product_id - Fail to delete non-existent product', async () => {
    const response = await request(app).delete('/products/999999999')
    expect(response.status).toBe(404)
    expect(response.body.error).toBe('Product not found')
  })
})


