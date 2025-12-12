import { asyncHandler } from "../utils/asyncHandler.js";

// -----------------------------------------------------------------------------
// PAYPAL
// -----------------------------------------------------------------------------
/**
 * @openapi
 * /api/payment/config/paypal:
 *   get:
 *     summary: Get PayPal Client ID
 *     tags: [Payment]
 *     responses:
 *       200:
 *         description: OK
 */
export const getPaypalConfig = asyncHandler(async (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID || "sb" });
});
