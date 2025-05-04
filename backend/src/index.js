// File: backend/src/index.js
// Description: This is the main entry point for the Express application.
// It sets up the server, connects to the database, and defines the API routes everything.
const express = require('express')
const cors = require('cors');
const { config } = require('dotenv')
const { neon, sql: neonSqlHelper } = require('@neondatabase/serverless')
const { Clerk } = require('@clerk/backend');

config()

const clerk = new Clerk({
  secretKey:'sk_test_Lo9YZO4TWhU0veJ5K5L71oYYLJM8nrVNrOo2QhWHv8'
});

// Helper function to get the SQL query function
// This ensures you're using the DATABASE_URL from your environment
const getDb = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set.')
  }
  // Initialize neon sql function for each request (common pattern for serverless)
  return neon(process.env.DATABASE_URL)
}

// 1. Create the application + use json
const app = express()
app.use(express.json())
app.use(cors());
const port = process.env.PORT || 5000

app.get('/', async (_, res) => {
  const sql = neon(`${process.env.DATABASE_URL}`)
  const response = await sql`SELECT version()`
  const { version } = response[0]
  res.json({ version })
})

app.get('/api/health', async (_, res) => {
  res.json({ status: 'UP' })
}
)

/*
/            _                      
/        ___| |_ ___  _ __ ___  ___ 
/       / __| __/ _ \| '__/ _ \/ __|
/       \__ \ || (_) | | |  __/\__ \
/       |___/\__\___/|_|  \___||___/
/       
*/

const storesRoute = (app, dbUrl) => {
  const sql = neon(dbUrl)

  /*
   * GET all stores
   */
  app.get('/stores', async (req, res) => {
    try {
      const stores = await sql`SELECT * FROM stores;`
      res.json(stores)
    } catch (error) {
      console.error('Error fetching stores:', error)
      res.status(500).send('Error fetching stores')
    }
  })

  /*
   * GET a specific store by ID
   */
  app.get('/stores/:store_id', async (req, res) => {
    const storeId = req.params.store_id
    try {
      const stores = await sql`SELECT * FROM stores WHERE id = ${storeId};`

      if (stores.length === 0) {
        return res.status(404).send('Store not found')
      }
      res.json(stores[0])
    } catch (error) {
      console.error('Error fetching store:', error)
      res.status(500).send('Error fetching store')
    }
  })

  /*
   * POST create a new store
   */
  app.post('/stores', async (req, res) => {
    const { clerkId, storeName, storeDescription, stitchClientKey, stitchClientSecret, town, postalCode, streetName, streetNumber } = req.body;
    if (!clerkId || !storeName || !storeDescription || !stitchClientKey || !town || !postalCode || !streetName || !streetNumber) {
      return res.status(400).send('There are some missing fields!')
    }
    if (typeof clerkId !== 'string' || typeof storeName !== 'string') {
      return res.status(400).send('clerkId and name must be strings')
    }

    try {
      const newStores = await sql`
        INSERT INTO 
          stores (
            "clerkId", 
            name, 
            description, 
            "stitchClientKey", 
            "stitchClientSecret",
            town, 
            "postalCode", 
            "streetName", 
            "streetNumber"
          )
        VALUES 
          (${clerkId}, ${storeName}, ${storeDescription}, ${stitchClientKey},  ${stitchClientSecret}, ${town}, ${postalCode}, ${streetName}, ${streetNumber})
        RETURNING *;
      `

      await clerk.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          role: 'seller',
          storeId: newStores[0].id,
        },
      });

      res.status(201).json(newStores[0])
    } catch (error) {
      console.error('Error creating store:', error)
      res.status(500).send('Error creating store')
    }
  })

  /*
   * PUT update a store
   */
  app.put('/stores/:store_id', async (req, res) => {
    const storeId = req.params.store_id

    if (!isValidUUID(storeId)) {
      return res.status(400).json({ error: 'Invalid store ID format (must be a UUID).' })
    }

    const { name, status } = req.body
    const updates = {}
    const columnMappings = {
      name: 'name',
      status: 'status'
    }
    const allowedStatuses = ["awaiting approval", "approved", "watchlist", "banned"]

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Name must be a non-empty string.' })
      }
      updates.name = name
    }

    if (status !== undefined) {
      if (typeof status !== 'string') {
        return res.status(400).json({ error: 'Status must be a string.' })
      }
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: `Invalid status. Allowed: ${allowedStatuses.join(', ')}` })
      }
      updates.status = status
    }

    const updateFields = Object.keys(updates)
    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields provided for update (provide name or status).' })
    }

    const setClauses = []
    const values = []
    let i = 1
    updateFields.forEach((field) => {
      const column = columnMappings[field]
      setClauses.push(`${column} = $${i}`)
      values.push(updates[field])
      i++
    })

    values.push(storeId)
    const query = `
      UPDATE stores
      SET ${setClauses.join(', ')}
      WHERE id = $${i}
      RETURNING *;
    `

    try {
      const result = await sql.query(query, values)
      if (result.length === 0) {
        return res.status(404).json({ error: 'Store not found.' })
      }
      res.json(result[0])
    } catch (error) {
      console.error('Error updating store:', error)
      res.status(500).json({ error: 'Error updating store' })
    }
  })

  /*
   * DELETE a store
   */
  app.delete('/stores/:store_id', async (req, res) => {
    const storeId = req.params.store_id
    try {
      const deleted = await sql`
        DELETE FROM stores
        WHERE id = ${storeId}
        RETURNING id;
      `

      if (deleted.length === 0) {
        return res.status(404).json({ error: 'Store not found' })
      }
      res.status(204).send()
    } catch (error) {
      console.error('Error deleting store:', error)
      res.status(500).json({ error: 'Error deleting store' })
    }
  })
}

/*                  _            _       
 _ __  _ __ ___   __| |_   _  ___| |_ ___ 
| '_ \| '__/ _ \ / _` | | | |/ __| __/ __|
| |_) | | | (_) | (_| | |_| | (__| |_\__ \
| .__/|_|  \___/ \__,_|\__,_|\___|\__|___/
|_|                                       

*/
// --- UUID Validation Helper (Basic) ---
const isValidUUID = (uuid) => {
  if (!uuid || typeof uuid !== 'string') return false
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(uuid)
}

// === CRUD Routes for Products ===
const productsRoute = (app, dbUrl) => {
  const sql = neon(dbUrl)

/*
 * POST /products - Create a new product
 */
app.post('/products', async (req, res) => {
  // Destructure all expected fields from the body
  const {
    storeId,
    name,
    description,
    price,
    stockQuantity,
    category,
    imageUrl
  } = req.body

  // --- Validation ---
  if (
    !storeId ||
    !name ||
    description === undefined ||
    price === undefined ||
    stockQuantity === undefined ||
    !category ||
    !imageUrl
  ) {
    return res
      .status(400)
      .json({
        error:
          'Missing required fields: storeId, name, description, price, stockQuantity, category, imageUrl are required.'
      })
  } // -- Validating the created store (all fields are required) --
  if (!isValidUUID(storeId)) {
    return res
      .status(400)
      .json({ error: 'Invalid storeId format (must be a UUID).' })
  } // -- Validating the format of the ID --
  if (
    typeof name !== 'string' ||
    typeof description !== 'string' ||
    typeof category !== 'string' ||
    typeof imageUrl !== 'string'
  ) {
    return res
      .status(400)
      .json({
        error: 'name, description, category, and imageUrl must be strings.'
      })
  } // -- Validating the format of the fields that are required to be strings. --
  if (typeof price !== 'number' || typeof stockQuantity !== 'number') {
    return res
      .status(400)
      .json({ error: 'price and stockQuantity must be numbers.' })
  } // -- Validating the format of the fields that are required to be numbers. --
  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    return res
      .status(400)
      .json({ error: 'stockQuantity must be a non-negative integer.' })
  } // -- Validating the correct format of the Quantity of stocks. --
  // Add more validation as needed (e.g., price > 0, string lengths)

  try {
    const sql = getDb()
    // Use column names exactly as defined in your schema (quoting if necessary)
    // Assuming lowercase or case-insensitive names based on the image conventions, except for potentially mixedCase ones.
    // Quote "storeId", "stockQuantity", "imageUrl" if they strictly require that casing in PG.
    const newProducts = await sql`
        INSERT INTO products
          ("storeId", name, description, price, "stockQuantity", category, "imageUrl")
        VALUES
          (${storeId}, ${name}, ${description}, ${price}, ${stockQuantity}, ${category}, ${imageUrl})
        RETURNING *;
      `
    res.status(201).json(newProducts[0])
  } catch (error) {
    console.error('Error creating product:', error)
    // Check for foreign key violation (e.g., storeId doesn't exist)
    if (error.code === '23503') {
      // PostgreSQL foreign key violation error code
      return res
        .status(400)
        .json({ error: `Store with ID ${storeId} does not exist.` })
    }
    res.status(500).send('Error creating product')
  }
})

/*
 * GET /products - Get all products (optionally filtered by storeId)
 */
app.get('/products', async (req, res) => {
  const { storeId } = req.query // Check for storeId in query parameters

  try {
    const sql = getDb()
    let products

    if (storeId) {
      // Validate UUID if provided
      if (!isValidUUID(storeId)) {
        return res
          .status(400)
          .json({ error: 'Invalid storeId format for filtering.' })
      }
      // Add WHERE clause for filtering
      products = await sql`SELECT * FROM products WHERE "storeId" = ${storeId};`
    } else {
      // Fetch all products if no filter
      products = await sql`SELECT * FROM products;`
    }

    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).send('Error fetching products')
  }
})

/*
 * GET /products/:product_id - Get a specific product by its ID
 */
app.get('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id

  // Validate product ID (should be an integer based on schema)
  if (isNaN(parseInt(productId)) || !Number.isInteger(Number(productId))) {
    return res
      .status(400)
      .send({error: 'Invalid product ID format (must be an integer).'})
  }

  try {
    const sql = getDb()
    const products = await sql`SELECT * FROM products WHERE id = ${productId};`

    if (products.length === 0) {
      return res.status(404).send({error:'Product not found.'})
    }
    res.json(products[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).send({error: 'Error fetching product'})
  }
})

/*
 * PUT /products/:product_id - Update a specific product (Corrected)
 */
app.put('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id

  // Validate product ID
  if (isNaN(parseInt(productId)) || !Number.isInteger(Number(productId))) {
    return res
      .status(400)
      .json({ error: 'Invalid product ID format (must be an integer).' })
  }

  // --- Build updates object and validate provided fields ---
  const { name, description, price, stockQuantity, category, imageUrl } =
    req.body
  const updates = {} // Store validated fields to update
  const columnMappings = {
    // Map request fields to potential quoted DB columns
    name: 'name',
    description: 'description',
    price: 'price',
    stockQuantity: '"stockQuantity"', // Quote if needed in DB
    category: 'category',
    imageUrl: '"imageUrl"' // Quote if needed in DB
  }

  // (Validation logic remains the same as before...)
  if (name !== undefined) {
    if (typeof name !== 'string')
      return res.status(400).json({ error: 'name must be a string.' })
    updates.name = name
  }
  if (description !== undefined) {
    if (typeof description !== 'string')
      return res.status(400).json({ error: 'description must be a string.' })
    updates.description = description
  }
  if (price !== undefined) {
    if (typeof price !== 'number')
      return res.status(400).json({ error: 'price must be a number.' })
    updates.price = price
  }
  if (stockQuantity !== undefined) {
    if (
      typeof stockQuantity !== 'number' ||
      !Number.isInteger(stockQuantity) ||
      stockQuantity < 0
    ) {
      return res
        .status(400)
        .json({ error: 'stockQuantity must be a non-negative integer.' })
    }
    updates.stockQuantity = stockQuantity // Use the key that matches columnMappings
  }
  if (category !== undefined) {
    if (typeof category !== 'string')
      return res.status(400).json({ error: 'category must be a string.' })
    updates.category = category
  }
  if (imageUrl !== undefined) {
    if (typeof imageUrl !== 'string')
      return res.status(400).json({ error: 'imageUrl must be a string.' })
    updates.imageUrl = imageUrl // Use the key that matches columnMappings
  }

  const updateFields = Object.keys(updates)

  // Check if there's anything to update
  if (updateFields.length === 0) {
    return res
      .status(400)
      .json({ error: 'No valid fields provided for update.' })
  }

  // --- Manually Construct the Query ---
  const setClauses = []
  const values = []
  let placeholderIndex = 1

  updateFields.forEach((fieldKey) => {
    // Get the correct DB column name (potentially quoted)
    const columnName = columnMappings[fieldKey]
    setClauses.push(`${columnName} = $${placeholderIndex}`)
    values.push(updates[fieldKey]) // Add the value to the parameters array
    placeholderIndex++
  })

  // Add the product ID for the WHERE clause as the last parameter
  values.push(productId)

  const queryString = `
      UPDATE products
      SET ${setClauses.join(', ')}
      WHERE id = $${placeholderIndex} -- Use the next placeholder index for the id
      RETURNING *;
    `

  try {
    const sql = getDb()
    // *** Use sql.query() for conventional query string + parameters array ***
    const updatedProducts = await sql.query(queryString, values)

    // The 'neon' driver returns the results directly in the array when using .query too
    if (updatedProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.json(updatedProducts[0]) // Send back the updated product object
  } catch (error) {
    console.error('Error updating product:', error) // Log the actual Neon error
    res.status(500).json({ error: 'Error updating product' })
  }
})

/*
 * DELETE /products/:product_id - Delete a specific product
 */
app.delete('/products/:product_id', async (req, res) => {
  const productId = req.params.product_id

  // Validate product ID
  if (isNaN(parseInt(productId)) || !Number.isInteger(Number(productId))) {
    return res
      .status(400)
      .json({ error: 'Invalid product ID format (must be an integer).' })
  }

  try {
    const sql = getDb()
    const deletedProducts = await sql`
        DELETE FROM products
        WHERE id = ${productId}
        RETURNING id; -- Check if a row was actually deleted
      `

    if (deletedProducts.length === 0) {
      return res.status(404).json({ error: 'Product not found' })
    }
    res.status(204).send() // Success, no content
  } catch (error) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Error deleting product' })
  }
})
}
/*            
  ___  _ __ __| | ___ _ __ ___ 
 / _ \| '__/ _` |/ _ \ '__/ __|
| (_) | | | (_| |  __/ |  \__ \
 \___/|_|  \__,_|\___|_|  |___/

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
    const sql = getDb();

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
    const sql = getDb()
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
 */
app.put('/orders/:order_id', async (req, res) => {
  const orderId = req.params.order_id

  // Validate UUID format
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(orderId)) {
    return res
      .status(400)
      .json({ error: 'Invalid order ID format (must be a UUID).' })
  }

  // --- Extract and validate fields ---
  const {
    phoneNumber,
    deliveryMethod,
    status,
    paymentStatus,
    city,
    town,
    streetName,
    streetNumber,
    postalCode,
    buyerName,
    paymentId
  } = req.body

  const updates = {}
  const columnMappings = {
    phoneNumber: '"phoneNumber"',
    deliveryMethod: '"deliveryMethod"',
    status: 'status',
    paymentStatus: '"paymentStatus"',
    city: 'city',
    town: 'town',
    streetName: '"streetName"',
    streetNumber: '"streetNumber"',
    postalCode: '"postalCode"',
    buyerName: '"buyerName"',
    paymentId: '"paymentId"'
  }

  if (phoneNumber !== undefined) {
    if (typeof phoneNumber !== 'string')
      return res.status(400).json({ error: 'phoneNumber must be a string.' })
    updates.phoneNumber = phoneNumber
  }
  if (deliveryMethod !== undefined) {
    if (typeof deliveryMethod !== 'string')
      return res
        .status(400)
        .json({ error: 'deliveryMethod must be a string.' })
    updates.deliveryMethod = deliveryMethod
  }
  if (status !== undefined) {
    if (typeof status !== 'string')
      return res.status(400).json({ error: 'status must be a string.' })
    updates.status = status
  }
  if (paymentStatus !== undefined) {
    if (typeof paymentStatus !== 'string')
      return res.status(400).json({ error: 'paymentStatus must be a string.' })
    updates.paymentStatus = paymentStatus
  }
  if (city !== undefined) {
    if (typeof city !== 'string')
      return res.status(400).json({ error: 'city must be a string.' })
    updates.city = city
  }
  if (town !== undefined) {
    if (typeof town !== 'string')
      return res.status(400).json({ error: 'town must be a string.' })
    updates.town = town
  }
  if (streetName !== undefined) {
    if (typeof streetName !== 'string')
      return res.status(400).json({ error: 'streetName must be a string.' })
    updates.streetName = streetName
  }
  if (streetNumber !== undefined) {
    if (typeof streetNumber !== 'string')
      return res.status(400).json({ error: 'streetNumber must be a string.' })
    updates.streetNumber = streetNumber
  }
  if (postalCode !== undefined) {
    if (typeof postalCode !== 'string')
      return res.status(400).json({ error: 'postalCode must be a string.' })
    updates.postalCode = postalCode
  }
  if (buyerName !== undefined) {
    if (typeof buyerName !== 'string')
      return res.status(400).json({ error: 'buyerName must be a string.' })
    updates.buyerName = buyerName
  }
  if (paymentId !== undefined) {
    if (typeof paymentId !== 'string')
      return res.status(400).json({ error: 'paymentId must be a string.' })
    updates.paymentId = paymentId
  }

  const updateFields = Object.keys(updates)
  if (updateFields.length === 0) {
    return res
      .status(400)
      .json({ error: 'No valid fields provided for update.' })
  }

  // --- Build query ---
  const setClauses = []
  const values = []
  let placeholderIndex = 1

  updateFields.forEach((fieldKey) => {
    const columnName = columnMappings[fieldKey]
    setClauses.push(`${columnName} = $${placeholderIndex}`)
    values.push(updates[fieldKey])
    placeholderIndex++
  })

  values.push(orderId) // Final value for WHERE clause

  const queryString = `
    UPDATE orders
    SET ${setClauses.join(', ')}
    WHERE id = $${placeholderIndex}
    RETURNING *;
  `

  try {
    const sql = getDb()
    const updatedOrders = await sql(queryString, values)
  
    if (updatedOrders.length === 0) {
      return res.status(404).json({ error: 'Order not found' })
    }
  
    res.json(updatedOrders[0])
  } catch (error) {
    console.error('Error updating order:', error)
    res.status(500).json({ error: 'Error updating order' })
  }
  
})


/*
     _   _ _       _        __                                      _       
 ___| |_(_) |_ ___| |__    / / __   __ _ _   _ _ __ ___   ___ _ __ | |_ ___ 
/ __| __| | __/ __| '_ \  / / '_ \ / _` | | | | '_ ` _ \ / _ \ '_ \| __/ __|
\__ \ |_| | || (__| | | |/ /| |_) | (_| | |_| | | | | | |  __/ | | | |_\__ \
|___/\__|_|\__\___|_| |_/_/ | .__/ \__,_|\__, |_| |_| |_|\___|_| |_|\__|___/
                            |_|          |___/                              

*/

app.get('/auth/token', async (req, res) => {
  const { storeId } = req.query

  if (!storeId) {
    return res.status(400).json({ error: 'Missing storeId parameter' })
  }

  try {
    const sql = getDb()
    const [store] = await sql`
      SELECT "stitchClientKey", "stitchClientSecret"
      FROM stores
      WHERE id = ${storeId}
      LIMIT 1;
    `

    if (!store) {
      return res.status(404).json({ error: 'Store not found' })
    }

    const { stitchClientKey, stitchClientSecret } = store

    if (!stitchClientKey || !stitchClientSecret) {
      return res.status(400).json({
        error: 'Missing Stitch credentials for this store'
      })
    }

    const response = await fetch('https://express.stitch.money/api/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // This cookie is optional. If required, replace with a real value:
        'Cookie': 'GAESA=CrABMDA3ZjY1...fake...yNTEzNzM0MWU3YzBkZTgwOTMzYmViYmJmYjBiNDRkYzgQ_6rf2Oky'
      },
      body: JSON.stringify({
        clientId: stitchClientKey,
        clientSecret: stitchClientSecret,
        scope: 'client_paymentrequest'
      })
    })

    if (!response.ok) {
      const errBody = await response.text()
      return res.status(response.status).json({
        error: 'Failed to get token from Stitch',
        detail: errBody
      })
    }

    const data = await response.json()
    res.json({ token: data.access_token || data.token || data })
  } catch (err) {
    console.error('Token fetch error:', err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

app.post('/stitch/payment-link', async (req, res) => {
  const { storeId, amount, orderId, payerName = '', deliveryFee = 0 } = req.body;

  if (!storeId || !amount || !orderId) {
    console.warn('[Stitch] Missing required fields:', { storeId, amount, orderId });
    return res.status(400).json({
      error: 'Missing required fields: storeId, amount, and orderId are required.'
    });
  }

  try {
    const sql = getDb();
    console.log(`[Stitch] Fetching credentials for storeId: ${storeId}`);
    const [store] = await sql`
      SELECT "stitchClientKey", "stitchClientSecret"
      FROM stores
      WHERE id = ${storeId}
    `;

    if (!store) {
      console.warn(`[Stitch] Store not found for storeId: ${storeId}`);
      return res.status(404).json({ error: 'Store not found' });
    }

    // Step 1: Get Stitch token
    let token;
    try {
      console.log('[Stitch] Requesting token...');
      const tokenRes = await fetch('https://express.stitch.money/api/v1/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: store.stitchClientKey,
          clientSecret: store.stitchClientSecret,
          scope: 'client_paymentrequest'
        })
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        console.error('[Stitch] Token request failed:', tokenData);
        return res.status(500).json({ error: 'Failed to get token', details: tokenData });
      }

      token = tokenData?.data?.accessToken;
      if (!token) {
        return res.status(500).json({ error: 'Token missing in Stitch response' });
      }

      console.log('[Stitch] Token received.');
    } catch (tokenErr) {
      console.error('[Stitch] Error during token fetch:', tokenErr);
      return res.status(500).json({ error: 'Error fetching token' });
    }

    // Step 2: Generate expiry timestamp
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    console.log('[Stitch] Expires at:', expiresAt);

    // Step 3: Create payment link
    const paymentPayload = {
      amount: amount,
      merchantReference: orderId,
      expiresAt: expiresAt,
      payerName: payerName,
      skipCheckoutPage: false,
      deliveryFee: deliveryFee,
    };

    console.log('[Stitch] Creating payment link with payload:', paymentPayload);

    try {
      const paymentRes = await fetch('https://express.stitch.money/api/v1/payment-links', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentPayload)
      });

      const paymentData = await paymentRes.json();

      if (!paymentRes.ok) {
        console.error('[Stitch] Payment link creation failed:', paymentData);
        return res.status(500).json({ error: 'Failed to create payment link', details: paymentData });
      }

      const redirectUrl = paymentData?.data?.payment?.link;
      if (!redirectUrl) {
        console.error('[Stitch] No payment link returned in response:', paymentData);
        return res.status(500).json({ error: 'No payment link returned' });
      }

      console.log('[Stitch] Payment link created:', redirectUrl);
      return res.status(200).json({ success: true, redirectUrl });

    } catch (paymentErr) {
      console.error('[Stitch] Error during payment link creation:', paymentErr);
      return res.status(500).json({ error: 'Error creating payment link' });
    }

  } catch (err) {
    console.error('[Stitch] Unexpected server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// LAST STEP: Start the server
if (require.main === module) {
  storesRoute(app, process.env.DATABASE_URL)
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

// Export app for testing purposes
module.exports = {app, storesRoute, productsRoute}
