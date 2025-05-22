const { neon } = require('@neondatabase/serverless')
const { isValidUUID } = require('./utils')
const { Parser } = require ('json2csv');


/*            
  ___  _ __ __| | ___ _ __ ___ 
 / _ \| '__/ _` |/ _ \ '__/ __|
| (_) | | | (_| |  __/ |  \__ \
 \___/|_|  \__,_|\___|_|  |___/

*/
const ordersRoute = (app, dbUrl) => {
  const sql = neon(dbUrl)

app.get("/orders/:storeId/csv", async (req, res)  => {
  const storeId = req.params.storeId;
  const { daily } = req.query;

  if (!isValidUUID(storeId)) {
    return res.status(400).json({ error: 'Invalid store ID format (must be a UUID).' });
  }

  try {
    let orders;

    if (daily === 'true') {
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      orders = await sql`
        SELECT
          "storeId",
          "buyerName",
          "phoneNumber",
          "deliveryMethod",
          city,
          town,
          "streetName",
          "streetNumber",
          "postalCode",
          "created_at",
          status
        FROM orders
        WHERE "storeId" = ${storeId}
          AND "created_at" >= ${yesterday.toISOString()}
        ORDER BY "created_at" DESC;
      `;
    } else {
      orders = await sql`
        SELECT
          "storeId",
          "buyerName",
          "phoneNumber",
          "deliveryMethod",
          city,
          town,
          "streetName",
          "streetNumber",
          "postalCode",
          "created_at",
          status
        FROM orders
        WHERE "storeId" = ${storeId}
        ORDER BY "created_at" DESC;
      `;
    }

    const fields = [
      "storeId",
      "buyerName",
      "phoneNumber",
      "deliveryMethod",
      "city",
      "town",
      "streetName",
      "streetNumber",
      "postalCode",
      "created_at",
      "status",
      "paymentStatus",
      "paymentId"
    ];

    const parser = new Parser({fields});
    
    if (!orders || orders.length === 0) {
      const emptyCsv = parser.parse([]); // empty array = empty CSV with headers only if you provide fields option
      res.header('Content-Type', 'text/csv');
      res.attachment(`daily_tasks_${storeId}.csv`);
      return res.send(emptyCsv);
    }
    
    const csv = parser.parse(orders);

    res.header('Content-Type', 'text/csv');
    res.attachment(`daily_tasks_${storeId}.csv`);
    return res.send(csv);

  } catch (error) {
    console.error('Error fetching orders or generating CSV:', error);
    res.status(500).json({ error: 'Error fetching orders or generating CSV' });
  }
});
  
  /*
  GET   orders/:storeid ->Get all the orders belonging to a particular store

   */
app.get('/orders/id/:orderId', async (req, res) => {
  const orderId = req.params.orderId;

  if (!orderId) {
    return res.status(400).json({ Error: "The store ID is not valid" });
  }

  try {

    const orders = await sql`SELECT * FROM orders WHERE order_id = ${orderId}`;
    if (orders.length === 0) {
      return res.json({ Error: "You Currently have No orders." });
    }

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ Error: "Database query failed", Details: error.message });
  }
});
  /*
  GET   orders/:storeid ->Get all the orders belonging to a particular store

   */
app.get('/orders/store/:storeid', async (req, res) => {
  const storeid = req.params.storeid;

  if (!storeid) {
    return res.status(400).json({ Error: "The store ID is not valid" });
  }

  try {

    const orders = await sql`SELECT * FROM orders WHERE "storeId" = ${storeid}`;
    if (orders.length === 0) {
      return res.json({ Error: "You Currently have No orders." });
    }

    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ Error: "Database query failed", Details: error.message });
  }
});

  /*
  This is a function to add an order 
  Post function
  */
app.post('/orders', async (req, res) => {
  const {
    storeId,
    buyerName,
    phoneNumber,
    deliveryMethod,
    city,
    town,
    streetName,
    streetNumber,
    postalCode,
  } = req.body;

  // --- Required Field Validation ---
  if (!storeId || !buyerName || !deliveryMethod) {
    return res.status(400).json({
      error: 'Missing required fields: storeId, buyerName, and delivery_option are required.'
    });
  }

  // --- Format Validation ---
  if (typeof buyerName !== 'string' || typeof deliveryMethod !== 'string') {
    return res.status(400).json({
      error: 'buyerName and delivery_option must be strings.'
    });
  }

  if (!isValidUUID(storeId)) {
    return res.status(400).json({ error: 'Invalid storeId format (must be a UUID).' });
  }

  // --- Delivery Address Validation ---
  if (
    deliveryMethod !== 'pickup' &&
    (!city || !town || !streetName)
  ) {
    return res.status(400).json({
      error: 'Incomplete delivery address: city, town, and streetname are required for delivery.'
    });
  }

  try {

    const [order] = await sql`
      INSERT INTO orders (
        "storeId",
        "buyerName",
        "phoneNumber",
        "deliveryMethod",
        "city",
        "town",
        "streetName",
        "streetNumber",
        "postalCode",
        "paymentStatus",
        status
      )
      VALUES (
        ${storeId},
        ${buyerName},
        ${phoneNumber || ''},
        ${deliveryMethod},
        ${city || ''},
        ${town || ''},
        ${streetName || ''},
        ${streetNumber || ''},
        ${postalCode || ''},
        'unpaid',
        'pending'
      )
      RETURNING *;
    `;

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);

    if (error.code === '23503') {
      return res
        .status(400)
        .json({ error: `Store with ID ${storeId} does not exist.` });
    }

    res.status(500).json({ error: 'Internal server error.' });
  }
});

/*
 * GET /orders/:order_id - Get a specific order by its ID (UUID)
 */
app.get('/orders/:order_id', async (req, res) => {
  const orderId = req.params.order_id

  // Basic UUID format validation (not exhaustive, but enough)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(orderId)) {
    return res
      .status(400)
      .send({ error: 'Invalid order ID format (must be a UUID).' })
  }

  try {
    const orders = await sql`SELECT * FROM orders WHERE id = ${orderId};`

    if (orders.length === 0) {
      return res.status(404).send({ error: 'Order not found.' })
    }

    res.json(orders[0])
  } catch (error) {
    console.error('Error fetching order:', error)
    res.status(500).send({ error: 'Error fetching order' })
  }
})

/*
 * PUT /orders/:order_id - Update a specific order by UUID
 */app.put('/orders/:order_id', async (req, res) => {
  const orderId = req.params.order_id;
  const body = req.body;

  // Basic UUID format validation
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(orderId)) {
    return res
      .status(400)
      .json({ error: 'Invalid order ID format (must be a UUID).' });
  }

  // Allowed columns and expected types
  const schema = {
    phoneNumber: 'string',
    deliveryMethod: 'string',
    status: 'string',
    paymentStatus: 'string',
    city: 'string',
    town: 'string',
    streetName: 'string',
    streetNumber: 'string',
    postalCode: 'string',
    buyerName: 'string',
    paymentId: 'string',
  };

  const updates = {};
  for (const key in schema) {
    if (key in body) {
      if (typeof body[key] !== schema[key]) {
        return res.status(400).json({
          error: `${key} must be a ${schema[key]}.`,
        });
      }
      updates[key] = body[key];
    }
  }

  const fields = Object.keys(updates);
  if (fields.length === 0) {
    return res
      .status(400)
      .json({ error: 'No valid fields provided for update.' });
  }

  // Dynamically construct SET clauses
  const setClauses = fields.map((field, i) => `"${field}" = $${i + 1}`);
  const values = fields.map((field) => updates[field]);
  values.push(orderId); // Add orderId as the final param for WHERE clause

  const query = `
    UPDATE orders
    SET ${setClauses.join(', ')}
    WHERE order_id = $${values.length}
    RETURNING *;
  `;

  try {
    const result = await sql(query, values);
    if (result.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

}

module.exports = { ordersRoute};