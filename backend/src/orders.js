const { neon } = require("@neondatabase/serverless");
const { isValidUUID } = require("./utils");
const { Parser } = require("json2csv");

/*            
  ___  _ __ __| | ___ _ __ ___ 
 / _ \| '__/ _` |/ _ \ '__/ __|
| (_) | | | (_| |  __/ |  \__ \
 \___/|_|  \__,_|\___|_|  |___/

*/
const ordersRoute = (app, dbUrl) => {
  const sql = neon(dbUrl);

  app.get("/orders/:storeId/csv", async (req, res) => {
    const storeId = req.params.storeId;
    const { daily } = req.query;

    if (!isValidUUID(storeId)) {
      return res
        .status(400)
        .json({ error: "Invalid store ID format (must be a UUID)." });
    }

    try {
      let orders;

      if (daily === "true") {
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
        "paymentId",
      ];

      const parser = new Parser({ fields });

      if (!orders || orders.length === 0) {
        const emptyCsv = parser.parse([]); // empty array = empty CSV with headers only if you provide fields option
        res.header("Content-Type", "text/csv");
        res.attachment(`daily_tasks_${storeId}.csv`);
        return res.send(emptyCsv);
      }

      const csv = parser.parse(orders);

      res.header("Content-Type", "text/csv");
      res.attachment(`daily_tasks_${storeId}.csv`);
      return res.send(csv);
    } catch (error) {
      console.error("Error fetching orders or generating CSV:", error);
      res
        .status(500)
        .json({ error: "Error fetching orders or generating CSV" });
    }
  });

  /*
  GET   orders/:storeid ->Get all the orders belonging to a particular store

   */
  app.get("/orders/id/:orderId", async (req, res) => {
    const orderId = req.params.orderId;

    if (!orderId) {
      return res.status(400).json({ Error: "The store ID is not valid" });
    }

    try {
      const orders =
        await sql`SELECT * FROM orders WHERE order_id = ${orderId}`;
      if (orders.length === 0) {
        return res.json({ Error: "You Currently have No orders." });
      }

      return res.json(orders);
    } catch (error) {
      return res
        .status(500)
        .json({ Error: "Database query failed", Details: error.message });
    }
  });
  app.get("/orders/buyer/:buyerId", async (req, res) => {
    const buyerId = req.params.buyerId;

    if (!buyerId) {
      return res.status(400).json({ Error: "The buyer ID is not valid" });
    }

    try {
      const orders =
        await sql`SELECT * FROM orders WHERE buyer_id = ${buyerId}`;
      if (orders.length === 0) {
        return res.json({ Error: "You Currently have No orders." });
      }

      return res.json(orders);
    } catch (error) {
      return res
        .status(500)
        .json({ Error: "Database query failed", Details: error.message });
    }
  });
  /*
  GET   orders/:storeid ->Get all the orders belonging to a particular store

   */
  app.get("/orders/store/:storeid", async (req, res) => {
    const storeid = req.params.storeid;

    if (!storeid) {
      return res.status(400).json({ Error: "The store ID is not valid" });
    }

    try {
      const orders =
        await sql`SELECT * FROM orders WHERE "storeId" = ${storeid}`;
      if (orders.length === 0) {
        return res.json({ Error: "You Currently have No orders." });
      }

      return res.json(orders);
    } catch (error) {
      return res
        .status(500)
        .json({ Error: "Database query failed", Details: error.message });
    }
  });

  /*
  This is a function to add an order 
  Post function
  */
  app.post("/orders", async (req, res) => {
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
      buyer_id,
      order_items,
      total_price,
    } = req.body;
    console.log(order_items)
    // --- Required Field Validation ---
    if (!storeId || !buyerName || !deliveryMethod) {
      return res.status(400).json({
        error:
          "Missing required fields: storeId, buyerName, and delivery_option are required.",
      });
    }

    // --- Format Validation ---
    if (typeof buyerName !== "string" || typeof deliveryMethod !== "string") {
      return res.status(400).json({
        error: "buyerName and delivery_option must be strings.",
      });
    }

    if (!isValidUUID(storeId)) {
      return res
        .status(400)
        .json({ error: "Invalid storeId format (must be a UUID)." });
    }

    // --- Delivery Address Validation ---
    if (deliveryMethod !== "pickup" && (!city || !town || !streetName)) {
      return res.status(400).json({
        error:
          "Incomplete delivery address: city, town, and streetname are required for delivery.",
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
        "buyer_id",
        "order_items",
        "total_price",
        "paymentStatus",
        status
      )
      VALUES (
        ${storeId},
        ${buyerName},
        ${phoneNumber || ""},
        ${deliveryMethod},
        ${city || ""},
        ${town || ""},
        ${streetName || ""},
        ${streetNumber || ""},
        ${postalCode || ""},
        ${buyer_id},
        ${JSON.stringify(order_items)},
        ${total_price},
        'paid',
        'pending'
      )
      RETURNING *;
    `;

      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);

      if (error.code === "23503") {
        return res
          .status(400)
          .json({ error: `Store with ID ${storeId} does not exist.` });
      }

      res.status(500).json({ error: "Internal server error." });
    }
  });

  /*
   * GET /orders/:order_id - Get a specific order by its ID (UUID)
   */
  app.get("/orders/:order_id", async (req, res) => {
    const orderId = req.params.order_id;

    // Basic UUID format validation (not exhaustive, but enough)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(orderId)) {
      return res
        .status(400)
        .send({ error: "Invalid order ID format (must be a UUID)." });
    }

    try {
      const orders = await sql`SELECT * FROM orders WHERE id = ${orderId};`;

      if (orders.length === 0) {
        return res.status(404).send({ error: "Order not found." });
      }

      res.json(orders[0]);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).send({ error: "Error fetching order" });
    }
  });
  /*
 * PUT /orders/:order_id - Update a specific order by UUID
 */
app.put("/orders/:order_id", async (req, res) => {
  const orderId = req.params.order_id;
  const body = req.body;

  const fields = Object.keys(body);
  const values = fields.map((field) => {
    const value = body[field];
    // If it's an object or array, stringify it for JSONB column
    if (field === "order_items") {
      return JSON.stringify(value);
    }
    return value;
  });

  const setClauses = fields.map((field, i) => {
    if (field === "order_items") {
      return `"${field}" = $${i + 1}::jsonb`;
    }
    return `"${field}" = $${i + 1}`;
  });

  const query = `
    UPDATE orders
    SET ${setClauses.join(", ")}
    WHERE order_id = $${fields.length + 1}
    RETURNING *;
  `;

  try {
    const result = await sql(query, [...values, orderId]);
    if (result.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(result[0]);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


};

module.exports = { ordersRoute };
