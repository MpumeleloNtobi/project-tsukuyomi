const request = require('supertest');
const { app, paymentsRoute, storesRoute } = require('../index');
const { v4: uuidv4 } = require('uuid');

const testDbUrl = 'postgresql://neondb_owner:npg_ZUgQeMX64rTm@ep-dry-term-a8pxk2za-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';

let storeId;

beforeAll(async () => {
  // Register routes
  storesRoute(app, testDbUrl);
  paymentsRoute(app, testDbUrl);

  // Create a store for payment tests
  const storeRes = await request(app).post('/stores').send({
    clerkId: `user_2wfipmUA0kgcJfAwDzcbwWOLu1k`, // Random clerk ID
    storeName: 'Payment Store',
    storeDescription: 'For payment tests',
    stitchClientKey: 'test_key',
    stitchClientSecret: 'test_secret',
    town: 'Townsville',
    postalCode: '12345',
    streetName: 'Main',
    streetNumber: '42',
  });

  if (storeRes.statusCode !== 201) {
    console.error('❌ Failed to create store:', storeRes.body);
    throw new Error('Store creation failed');
  }

  storeId = storeRes.body.id;
  console.log('✅ Created store with ID:', storeId);
});

afterAll(async () => {
  if (storeId) {
    const delRes = await request(app).delete(`/stores/${storeId}`);
    console.log('🧹 Deleted store:', delRes.statusCode, delRes.body);
  }
});

describe('Payment Routes', () => {
  test('POST /stitch/payment-link - should return 400 if required fields are missing', async () => {
    const res = await request(app).post('/stitch/payment-link').send({
      storeId,
      amount: 100, // missing orderId
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Missing required fields: storeId, amount, and orderId are required.');
  });

  test('POST /stitch/payment-link - should return 404 if store does not exist', async () => {
    const nonExistentStoreId = uuidv4();

    const res = await request(app).post('/stitch/payment-link').send({
      storeId: nonExistentStoreId,
      amount: 150,
      orderId: uuidv4(),
      payerName: 'Jane Doe',
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Store not found');
  });

  test('POST /stitch/payment-link - should return 500 if token is missing in response', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: {} }), // Missing accessToken
    });

    const res = await request(app).post('/stitch/payment-link').send({
      storeId,
      amount: 200,
      orderId: uuidv4(),
      payerName: 'Ghost User',
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Internal server error');
  });
});
