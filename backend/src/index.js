// File: backend/src/index.js
// Description: This is the main entry point for the Express application.
// It sets up the server, connects to the database, and defines the API routes everything.
const express = require('express')
const cors = require('cors');
const { config } = require('dotenv')
const { neon, sql: neonSqlHelper } = require('@neondatabase/serverless')
config()

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

/*
/ GET all stores
*/
app.get('/stores', async (req, res) => {
  try {
    const sql = getDb()
    // SQL: Select all columns from the stores table
    const stores = await sql`SELECT * FROM stores;`
    // neon driver returns the array of rows directly
    res.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    res.status(500).send('Error fetching stores')
  }
})

/*
  / GET a specific store by ID
  */
app.get('/stores/:store_id', async (req, res) => {
  const storeId = req.params.store_id
  try {
    const sql = getDb()
    // SQL: Select using template literal for parameterization
    const stores = await sql`SELECT * FROM stores WHERE id = ${storeId};`

    if (stores.length === 0) {
      return res.status(404).send('Store not found')
    }
    res.json(stores[0]) // Send the first (and only) row found
  } catch (error) {
    console.error('Error fetching store:', error)
    res.status(500).send('Error fetching store')
  }
})

/*
  / POST create a new store
  */
app.post('/stores', async (req, res) => {
  const { clerkId, name } = req.body

  // Validation
  if (!clerkId || !name) {
    return res.status(400).send('clerkId and name are required')
  }
  if (typeof clerkId !== 'string' || typeof name !== 'string') {
    return res.status(400).send('clerkId and name must be strings')
  }

  try {
    const sql = getDb()
    // SQL: Insert using template literals for parameters.
    // Note: "clerkId" is quoted assuming the column name case sensitivity matters. Adjust if needed.
    const newStores = await sql`
        INSERT INTO stores ("clerkId", name)
        VALUES (${clerkId}, ${name})
        RETURNING *;
      `
    res.status(201).json(newStores[0]) // Send the newly created store object
  } catch (error) {
    console.error('Error creating store:', error)
    res.status(500).send('Error creating store')
  }
})

/*
 * PUT /stores/:store_id - Update a specific store (Dynamically)
 */
app.put('/stores/:store_id', async (req, res) => {
  const storeId = req.params.store_id;

  // --- Validate Store ID (assuming UUID) ---
  if (!isValidUUID(storeId)) {
      return res.status(400).json({ error: 'Invalid store ID format (must be a UUID).' });
  }

  // --- Build updates object and validate provided fields ---
  const { name, status } = req.body; // Extract potential fields
  const updates = {}; // Store validated fields to update
  const columnMappings = { // Map request fields to DB columns (adjust if needed)
      name: 'name',
      status: 'status'
  };
  const allowedStatuses = ["awaiting approval", "approved", "watchlist", "banned"]; // Define valid statuses

  // Validate 'name' if provided
  if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') { // Also check if empty/whitespace only
          return res.status(400).json({ error: 'Name must be a non-empty string.' });
      }
      updates.name = name;
  }

  // Validate 'status' if provided
  if (status !== undefined) {
      if (typeof status !== 'string') {
          return res.status(400).json({ error: 'Status must be a string.' });
      }
      if (!allowedStatuses.includes(status)) {
           return res.status(400).json({ error: `Invalid status value. Allowed statuses are: ${allowedStatuses.join(', ')}.` });
      }
      updates.status = status;
  }

  const updateFields = Object.keys(updates);

  // Check if there's anything valid to update
  if (updateFields.length === 0) {
    return res
      .status(400)
      .json({ error: 'No valid fields provided for update (provide name or status).' });
  }

  // --- Manually Construct the Query ---
  const setClauses = [];
  const values = [];
  let placeholderIndex = 1;

  updateFields.forEach((fieldKey) => {
    // Get the correct DB column name
    const columnName = columnMappings[fieldKey]; // Assumes simple lowercase names for stores
    setClauses.push(`${columnName} = $${placeholderIndex}`);
    values.push(updates[fieldKey]); // Add the value to the parameters array
    placeholderIndex++;
  });

  // Add the store ID for the WHERE clause as the last parameter
  values.push(storeId);

  const queryString = `
      UPDATE stores
      SET ${setClauses.join(', ')}
      WHERE id = $${placeholderIndex} -- Use the next placeholder index for the id
      RETURNING *;
    `;
   // Example queryString (if both name and status provided):
   // "UPDATE stores SET name = $1, status = $2 WHERE id = $3 RETURNING *;"
   // Example values: ["New Store Name", "approved", "uuid-string-here"]

  try {
    const sql = getDb();
    // Use sql.query() for conventional query string + parameters array
    const updatedStores = await sql.query(queryString, values);

    if (updatedStores.length === 0) {
      // WHERE clause didn't match any rows
      return res.status(404).json({ error: 'Store not found.' });
    }
    res.json(updatedStores[0]); // Send back the updated store object
  } catch (error) {
    console.error('Error updating store:', error);
    // Consider adding specific error handling if needed (e.g., constraint violations)
    res.status(500).json({ error: 'Error updating store' });
  }
});

/*
  / DELETE a specific store
  */
app.delete('/stores/:store_id', async (req, res) => {
  const storeId = req.params.store_id

  try {
    const sql = getDb()
    // SQL: Delete using template literal. Use RETURNING id (or *) to check if a row was affected.
    const deletedStores = await sql`
        DELETE FROM stores
        WHERE id = ${storeId}
        RETURNING id; -- Return the id of the deleted row
      `

    if (deletedStores.length === 0) {
      // If the returned array is empty, no row matched the WHERE clause.
      return res.status(404).json({ error: 'Store not found' })
    }
    // Successfully deleted
    res.status(204).send()
  } catch (error) {
    console.error('Error deleting store:', error)
    res.status(500).json({ error: 'Error deleting store' })
  }
})

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

// LAST STEP: Start the server
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}

// Export app for testing purposes
module.exports = app
