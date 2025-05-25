const { neon } = require("@neondatabase/serverless");
const { isValidUUID } = require("./utils");
const Clerk = require("@clerk/express");
/*
/            _                      
/        ___| |_ ___  _ __ ___  ___ 
/       / __| __/ _ \| '__/ _ \/ __|
/       \__ \ || (_) | | |  __/\__ \
/       |___/\__\___/|_|  \___||___/
/       
*/

const storesRoute = (app, dbUrl, clerkClient) => {
  const sql = neon(dbUrl);

  /*
   * GET all stores
   */
  app.get("/stores", async (req, res) => {
    try {
      const stores = await sql`SELECT * FROM stores;`;
      res.json(stores);
    } catch (error) {
      console.error("Error fetching stores:", error);
      res.status(500).send("Error fetching stores");
    }
  });

  /*
   * GET a specific store by ID
   */
  app.get("/stores/:store_id", async (req, res) => {
    const storeId = req.params.store_id;
    try {
      const stores = await sql`SELECT * FROM stores WHERE id = ${storeId};`;

      if (stores.length === 0) {
        return res.status(404).send("Store not found");
      }
      res.json(stores[0]);
    } catch (error) {
      console.error("Error fetching store:", error);
      res.status(500).send("Error fetching store");
    }
  });

  /*
   * POST create a new store
   */
  app.post("/stores", async (req, res) => {
    const {
      clerkId,
      storeName,
      storeDescription,
      stitchClientKey,
      stitchClientSecret,
      town,
      postalCode,
      streetName,
      streetNumber,
    } = req.body;
    if (
      !clerkId ||
      !storeName ||
      !storeDescription ||
      !stitchClientKey ||
      !town ||
      !postalCode ||
      !streetName ||
      !streetNumber
    ) {
      return res.status(400).send("There are some missing fields!");
    }
    if (typeof clerkId !== "string" || typeof storeName !== "string") {
      return res.status(400).send("clerkId and name must be strings");
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
      `;
      const clerkClient = Clerk.createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: {
          role: "seller",
          storeId: newStores[0].id,
        },
      });

      res.status(201).json(newStores[0]);
    } catch (error) {
      console.error("Error creating store:", error);
      res.status(500).send("Error creating store");
    }
  });

  /*
   * PUT update a store
   */
  app.put("/stores/:store_id", async (req, res) => {
    const storeId = req.params.store_id;

    if (!isValidUUID(storeId)) {
      return res
        .status(400)
        .json({ error: "Invalid store ID format (must be a UUID)." });
    }

    const updates = req.body;

    if (
      typeof updates !== "object" ||
      updates === null ||
      Array.isArray(updates)
    ) {
      return res.status(400).json({ error: "Request body must be an object." });
    }

    const updateFields = Object.keys(updates);
    if (updateFields.length === 0) {
      return res.status(400).json({
        error: "No fields provided for update.",
      });
    }

    const setClauses = [];
    const values = [];

    updateFields.forEach((field, index) => {
      setClauses.push(`${field} = $${index + 1}`);
      values.push(updates[field]);
    });

    values.push(storeId); // For WHERE clause
    const query = `
    UPDATE stores
    SET ${setClauses.join(", ")}
    WHERE id = $${updateFields.length + 1}
    RETURNING *;
  `;

    try {
      const result = await sql(query, values);
      if (result.length === 0) {
        return res.status(404).json({ error: "Store not found." });
      }
      res.json(result[0]);
    } catch (error) {
      console.error("Error updating store:", error);
      res.status(500).json({ error: "Error updating store" });
    }
  });

  /*
   * DELETE a store
   */
  app.delete("/stores/:store_id", async (req, res) => {
    const storeId = req.params.store_id;
    try {
      const deleted = await sql`
        DELETE FROM stores
        WHERE id = ${storeId}
        RETURNING id;
      `;

      if (deleted.length === 0) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ error: "Error deleting store" });
    }
  });

  app.delete("/stores/clerk/:clerk_id", async (req, res) => {
    const clerk_id = req.params.clerk_id;
    try {
      const deleted = await sql`
        DELETE FROM stores
        WHERE "clerkId" = ${clerk_id}
        RETURNING id;
      `;

      if (deleted.length === 0) {
        return res.status(404).json({ error: "Store not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting store:", error);
      res.status(500).json({ error: "Error deleting store" });
    }
  });
};
module.exports = { storesRoute };
