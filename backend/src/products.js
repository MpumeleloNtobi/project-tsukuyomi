const { neon } = require('@neondatabase/serverless')
const { v4: uuidv4 } = require('uuid');
const { isValidUUID } = require('./utils')
/*                  _            _       
 _ __  _ __ ___   __| |_   _  ___| |_ ___ 
| '_ \| '__/ _ \ / _` | | | |/ __| __/ __|
| |_) | | | (_) | (_| | |_| | (__| |_\__ \
| .__/|_|  \___/ \__,_|\__,_|\___|\__|___/
|_|                                       

*/

const productsRoute = (app, dbUrl) => {
  const sql = neon(dbUrl)

/*
 * POST /products - Create a new product
 */
//app.post('/products', uploadMultiple, async (req, res) => {
app.post('/products', async (req, res) => {
  try {
    // Destructure form data
    const { 
      storeId,
      name,
      description,
      price,
      stockQuantity,
      category,
      image1url,
      image2url,
      image3url
    } = req.body;

    const files = req.files;

    // Validate required fields
    const requiredFields = ['storeId', 'name', 'description', 'price', 'stockQuantity', 'category'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate numeric fields
    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stockQuantity);
    
    if (isNaN(numericPrice) || isNaN(numericStock)) {
      return res.status(400).json({ error: 'Invalid numeric values' });
    }

    // Insert complete product data
    const newProduct = await sql`
      INSERT INTO products (
        "storeId", name, description, price, "stockQuantity", category,
        "image1url", "image2url", "image3url"
      ) VALUES (
        ${storeId},
        ${name},
        ${description},
        ${numericPrice},
        ${numericStock},
        ${category},
        ${image1url},
        ${image2url},
        ${image3url}
      ) RETURNING *;
    `;

    res.status(201).json(newProduct[0]);

  } catch (err) {
    console.error('Product creation error:', err);
    res.status(500).json({ 
      error: err.message || 'Internal server error' 
    });
  }
}); 


/*
 * GET /products - Get all products (optionally filtered by storeId)
 */
app.get('/products', async (req, res) => {
  const { storeId } = req.query // Check for storeId in query parameters

  try {
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
  const productId = req.params.product_id;
  console.log(`updating image`);
  if (isNaN(parseInt(productId)) || !Number.isInteger(Number(productId))) {
    return res
      .status(400)
      .json({ error: 'Invalid product ID format (must be an integer).' });
  }

  const {
    name,
    description,
    price,
    stockQuantity,
    category,
    image1url,
    image2url,
    image3url
  } = req.body;
  console.log(req.body);
  const updates = {};
  const columnMappings = {
    name: 'name',
    description: 'description',
    price: 'price',
    stockQuantity: '"stockQuantity"',
    category: 'category',
    image1url: '"image1url"',
    image2url: '"image2url"',
    image3url: '"image3url"'
  };

  // Validations and collecting update fields
  if (name !== undefined) {
    if (typeof name !== 'string') return res.status(400).json({ error: 'name must be a string.' });
    updates.name = name;
  }

  if (description !== undefined) {
    if (typeof description !== 'string') return res.status(400).json({ error: 'description must be a string.' });
    updates.description = description;
  }

  if (price !== undefined) {
    if (typeof price !== 'number') return res.status(400).json({ error: 'price must be a number.' });
    updates.price = price;
  }

  if (stockQuantity !== undefined) {
    if (typeof stockQuantity !== 'number' || !Number.isInteger(stockQuantity) || stockQuantity < 0) {
      return res.status(400).json({ error: 'stockQuantity must be a non-negative integer.' });
    }
    updates.stockQuantity = stockQuantity;
  }

  if (category !== undefined) {
    if (typeof category !== 'string') return res.status(400).json({ error: 'category must be a string.' });
    updates.category = category;
  }

  if (image1url !== undefined) {
    if (typeof image1url !== 'string') return res.status(400).json({ error: 'image1url must be a string.' });
    updates.image1url = image1url;
  }

  if (image2url !== undefined) {
    if (typeof image2url !== 'string') return res.status(400).json({ error: 'image2url must be a string.' });
    updates.image2url = image2url;
  }

  if (image3url !== undefined) {
    if (typeof image3url !== 'string') return res.status(400).json({ error: 'image3url must be a string.' });
    updates.image3url = image3url;
  }

  const updateFields = Object.keys(updates);
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No valid fields provided for update.' });
  }

  // Construct dynamic query
  const setClauses = [];
  const values = [];
  let placeholderIndex = 1;

  updateFields.forEach((fieldKey) => {
    const columnName = columnMappings[fieldKey];
    setClauses.push(`${columnName} = $${placeholderIndex}`);
    values.push(updates[fieldKey]);
    placeholderIndex++;
  });

  values.push(productId); // for WHERE clause
  const queryString = `
    UPDATE products
    SET ${setClauses.join(', ')}
    WHERE id = $${placeholderIndex}
    RETURNING *;
  `;

  try {
    const result = await sql(queryString, values);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.log('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

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
module.exports = {productsRoute};