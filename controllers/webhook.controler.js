const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cartSchema = require("../models/cartSchema");
const orderSchema = require("../models/orderSchema");

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

  if (event.type === "checkout.session.completed") {
    // console.log("Stripe Session Data:", session);
    console.log("Metadata:", session.metadata);
    console.log("Stripe Session Data Completed:", session.id);
    const orderId = session.metadata.orderId;

    //     // 1. Updating Order Status
    const order = await orderSchema.findByIdAndUpdate(
      orderId,
      {
        "payment.status": "paid",
        "payment.sessionId": session.id,
        status: "confirmed",
      },
      { new: true },
    );

    // 2. Clearing Cart
    if (order) {
      await cartSchema.findOneAndUpdate({ user: order.user }, { items: [] });
    }
  }

  // 2. FAILURE
  // else if (event.type === "payment_intent.payment_failed") {
  else if (event.type === "checkout.session.expired") {
    console.log("Payment failed for PaymentIntent:", session.id);

    await orderSchema.findOneAndUpdate(
      { "payment.sessionId": session.id },
      {
        "payment.status": "failed",
        status: "cancelled",
      },
    );
  }
  res.json({ received: true });
};
module.exports = { stripeWebhook };
