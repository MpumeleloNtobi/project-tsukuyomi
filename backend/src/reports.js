const { neon } = require('@neondatabase/serverless')
const { Parser } = require ('json2csv');

//reporting
const reportsRoute = (app, dbUrl) => {
const sql = neon(dbUrl)

app.get('/reporting/inventory/:storeId', async (req, res) => {
  const storeId = req.params.storeId;

  try {
    const result = await sql`
      SELECT id, name, description, price, "stockQuantity"
      FROM products
      WHERE "storeId" = ${storeId}
    `;

    const parser = new Parser();
    const csv = parser.parse(result);
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error generating inventory report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get("/reporting/:storeId/daily-sales.csv", async (req, res) => {
  const { storeId } = req.params;

  if (!storeId) {
    return res.status(400).json({ error: "storeId is required" });
  }

  try {
    const result = await sql`
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '29 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::DATE AS order_date
      ),
      order_data AS (
        SELECT
          DATE("created_at") AS order_date,
          COUNT(*) AS total_orders,
          SUM("total_price") AS total_sales
        FROM orders
        WHERE "storeId" = ${storeId}
          AND "paymentStatus" = 'paid'
          AND "created_at" >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE("created_at")
      )
      SELECT
        ds.order_date,
        COALESCE(od.total_orders, 0) AS total_orders,
        COALESCE(od.total_sales, 0) AS total_sales
      FROM date_series ds
      LEFT JOIN order_data od ON ds.order_date = od.order_date
      ORDER BY ds.order_date DESC;
    `;

    const fields = ["order_date", "total_orders", "total_sales"];
    const parser = new Parser({ fields });
    const csv = parser.parse(result);

    res.header("Content-Type", "text/csv");
    res.attachment(`daily-sales-${storeId}.csv`);
    res.send(csv);
  } catch (err) {
    console.error("Failed to generate CSV", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/reporting/:storeId/daily-sales", async (req, res) => {
  const { storeId } = req.params;
  console.log("Store ID:", storeId);
  if (!storeId) {
    return res.status(400).json({ error: "storeId is required" });
  }

  try {
    const result = await sql
      `
      WITH date_series AS (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '29 days',
          CURRENT_DATE,
          INTERVAL '1 day'
        )::DATE AS order_date
      ),
      order_data AS (
        SELECT
          DATE("created_at") AS order_date,
          COUNT(*) AS total_orders,
          SUM("total_price") AS total_sales
        FROM orders
        WHERE "storeId" = ${storeId}
          AND "paymentStatus" = 'paid'
          AND "created_at" >= CURRENT_DATE - INTERVAL '30 days'
        GROUP BY DATE("created_at")
      )
      SELECT
        ds.order_date,
        COALESCE(od.total_orders, 0) AS total_orders,
        COALESCE(od.total_sales, 0) AS total_sales
      FROM date_series ds
      LEFT JOIN order_data od ON ds.order_date = od.order_date
      ORDER BY ds.order_date DESC;
      `
    //console.log("Query Result:", result);
    res.json(result);
    //console.log(result.rows)
  } catch (err) {
    console.error("Failed to fetch daily sales report", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/reporting/:storeId/metrics", async (req, res) => {
  const { storeId } = req.params;
  console.log("Store ID:", storeId);

  if (!storeId) {
    return res.status(400).json({ error: "storeId is required" });
  }

  try {
    const [
      revenueGrowthResult,
      totalProductsResult,
      salesThisMonthResult,
      revenueThisMonthResult,
    ] = await Promise.all([
      sql`
        WITH current_month AS (
          SELECT COALESCE(SUM("total_price"), 0) AS revenue
          FROM orders
          WHERE "storeId" = ${storeId}
            AND "paymentStatus" = 'paid'
            AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE)
        ),
        previous_month AS (
          SELECT COALESCE(SUM("total_price"), 0) AS revenue
          FROM orders
          WHERE "storeId" = ${storeId}
            AND "paymentStatus" = 'paid'
            AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        )
        SELECT 
          current_month.revenue AS current_revenue,
          previous_month.revenue AS previous_revenue,
          CASE 
            WHEN previous_month.revenue = 0 THEN NULL
            ELSE ROUND(
              (100.0 * (current_month.revenue - previous_month.revenue) / previous_month.revenue)::numeric,
              2
            )
          END AS revenue_growth_percent
        FROM current_month, previous_month;
      `,
      sql`
        SELECT COUNT(*) AS total_products
        FROM products
        WHERE "storeId" = ${storeId};
      `,
      sql`
        SELECT COUNT(*) AS sales_this_month
        FROM orders
        WHERE "storeId" = ${storeId}
          AND "paymentStatus" = 'paid'
          AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
      `,
      sql`
        SELECT COALESCE(SUM("total_price"), 0) AS revenue_this_month
        FROM orders
        WHERE "storeId" = ${storeId}
          AND "paymentStatus" = 'paid'
          AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', CURRENT_DATE);
      `
    ]);

    const metrics = {
      revenueGrowthPercent: Number(revenueGrowthResult[0].revenue_growth_percent) || 0,
      totalProducts: Number(totalProductsResult[0].total_products),
      salesThisMonth: Number(salesThisMonthResult[0].sales_this_month),
      revenueThisMonth: Number(revenueThisMonthResult[0].revenue_this_month),
    };

    return res.json(metrics); // ✅ Always return after sending a response
  } catch (err) {
    console.error("Failed to fetch metrics", err);
    return res.status(500).json({ error: "Internal server error" }); // ✅ Return here too
  }
});
}
module.exports = { reportsRoute };