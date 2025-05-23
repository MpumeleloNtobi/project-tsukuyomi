const { neon } = require("@neondatabase/serverless");
/*  _ _       _        __                                      _       
 ___| |_(_) |_ ___| |__    / / __   __ _ _   _ _ __ ___   ___ _ __ | |_ ___ 
/ __| __| | __/ __| '_ \  / / '_ \ / _` | | | | '_ ` _ \ / _ \ '_ \| __/ __|
\__ \ |_| | || (__| | | |/ /| |_) | (_| | |_| | | | | | |  __/ | | | |_\__ \
|___/\__|_|\__\___|_| |_/_/ | .__/ \__,_|\__, |_| |_| |_|\___|_| |_|\__|___/
                            |_|          |___/                              
*/
const paymentsRoute = (app, dbUrl) => {
  const sql = neon(dbUrl);
  app.post("/stitch/payment-link", async (req, res) => {
    const {
      storeId,
      amount,
      orderId,
      payerName = "",
      deliveryFee = 0,
    } = req.body;

    if (!storeId || !amount || !orderId) {
      console.warn("[Stitch] Missing required fields:", {
        storeId,
        amount,
        orderId,
      });
      return res.status(400).json({
        error:
          "Missing required fields: storeId, amount, and orderId are required.",
      });
    }

    try {
      console.log(`[Stitch] Fetching credentials for storeId: ${storeId}`);
      const [store] = await sql`
      SELECT "stitchClientKey", "stitchClientSecret"
      FROM stores
      WHERE id = ${storeId}
    `;

      if (!store) {
        console.warn(`[Stitch] Store not found for storeId: ${storeId}`);
        return res.status(404).json({ error: "Store not found" });
      }

      // Step 1: Get Stitch token
      let token;
      try {
        console.log("[Stitch] Requesting token...");
        const tokenRes = await fetch(
          "https://express.stitch.money/api/v1/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientId: store.stitchClientKey,
              clientSecret: store.stitchClientSecret,
              scope: "client_paymentrequest",
            }),
          },
        );

        const tokenData = await tokenRes.json();

        token = tokenData?.data?.accessToken;
        if (!token) {
          return res
            .status(500)
            .json({ error: "Token missing in Stitch response" });
        }

        console.log("[Stitch] Token received.");
      } catch (tokenErr) {
        console.error("[Stitch] Error during token fetch:", tokenErr);
        return res.status(500).json({ error: "Error fetching token" });
      }

      // Step 2: Generate expiry timestamp
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      console.log("[Stitch] Expires at:", expiresAt);

      // Step 3: Create payment link
      const paymentPayload = {
        amount: amount,
        merchantReference: orderId,
        expiresAt: expiresAt,
        payerName: payerName,
        skipCheckoutPage: false,
        deliveryFee: deliveryFee,
      };

      console.log(
        "[Stitch] Creating payment link with payload:",
        paymentPayload,
      );

      try {
        const paymentRes = await fetch(
          "https://express.stitch.money/api/v1/payment-links",
          {
            method: "POST",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(paymentPayload),
          },
        );

        const paymentData = await paymentRes.json();

        if (!paymentRes.ok) {
          console.error("[Stitch] Payment link creation failed:", paymentData);
          return res.status(500).json({
            error: "Failed to create payment link",
            details: paymentData,
          });
        }

        const redirectUrl = paymentData?.data?.payment?.link;
        if (!redirectUrl) {
          console.error(
            "[Stitch] No payment link returned in response:",
            paymentData,
          );
          return res.status(500).json({ error: "No payment link returned" });
        }

        console.log("[Stitch] Payment link created:", redirectUrl);
        return res.status(200).json({ success: true, redirectUrl });
      } catch (paymentErr) {
        console.error(
          "[Stitch] Error during payment link creation:",
          paymentErr,
        );
        return res.status(500).json({ error: "Error creating payment link" });
      }
    } catch (err) {
      console.error("[Stitch] Unexpected server error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });
};
module.exports = { paymentsRoute };
