const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cartSchema = require("../models/cartSchema");
const orderSchema = require("../models/orderSchema");
const productSchema = require("../models/productSchema");

const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    //  verifing the request came from Stripe
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error(`Webhook Signature Verification Failed: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  //   // Handlling the event
  const session = event.data.object;

  try {
    if (event.type === "checkout.session.completed") {
      const cartId = session.metadata?.cartId;
      // console.log("Stripe Session Data:", session);
      console.log("Metadata:", session.metadata);
      console.log("Stripe Session Data Completed:", session.id);

      const orderId = session.metadata?.orderId;
      if (!orderId) {
        console.error("Webhook Error: orderId missing from session metadata");
        return res.status(400).json({ error: "Missing orderId metadata" });
      }

      const existingOrder = await orderSchema.findById(orderId);
      if (existingOrder && existingOrder.payment?.status === "paid") {
        return res.status(200).json({ received: true });
      }

      // 1. Updating Order Status
      const order = await orderSchema.findByIdAndUpdate(
        orderId,
        {
          "payment.status": "paid",
          "payment.sessionId": session.id,
          "payment.paymentId": session.payment_intent,
          "payment.paidAt": new Date(),
          status: "confirmed",
        },
        { new: true },
      );

      if (order) {
        // Deducting stock for each purchased item variant
        for (const item of order.items) {
          if (item.sku && item.sku.trim() !== "") {
            await productSchema.updateOne(
              { _id: item.product, "variants.sku": item.sku },
              { $inc: { "variants.$.stock": -item.quantity } },
            );
          } else {
            // Deduct main stock if no variant SKU exists
            await productSchema.updateOne(
              { _id: item.product },
              { $inc: { stock: -item.quantity } },
            );
          }
        }

        // 2. Clearing Cart
        const cartFilter = cartId ? { _id: cartId } : { user: order.user };
        const cartUpdateResult = await cartSchema.updateOne(cartFilter, {
          $set: {
            items: [],
            totalItems: 0,
            totalPrice: 0,
          },
        });
      }
    }

    // 2. FAILURE
    // else if (event.type === "payment_intent.payment_failed") {
    else if (event.type === "checkout.session.expired") {
      console.log("Payment failed for PaymentIntent:", session.id);
      const orderId = session.metadata?.orderId;
      const queryConditions = [{ "payment.sessionId": session.id }];

      if (orderId) {
        queryConditions.push({ _id: orderId });
      }

      await orderSchema.findOneAndUpdate(
        { $or: queryConditions },
        {
          "payment.status": "failed",
          status: "cancelled",
        },
      );
    }
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook Processing Error:", error);
    return res.status(500).send("Webhook handler failed");
  }
};
module.exports = { stripeWebhook };
