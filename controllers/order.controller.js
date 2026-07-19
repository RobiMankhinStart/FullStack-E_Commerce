const cartSchema = require("../models/cartSchema");
const orderSchema = require("../models/orderSchema");
const sendResponse = require("../services/sendResponse");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const checkOut = async (req, res) => {
  try {
    const { paymentType, cartId, shippingAddress, insideDhaka } = req.body;

    const orderNumber = Date.now();

    if (!paymentType) return sendResponse(res, 400, "Payment type required");
    // if (!cartId) return sendResponse(res, 400, "cartId required");
    if (!shippingAddress)
      return sendResponse(res, 400, "shipping Address  required");
    if (!insideDhaka) return sendResponse(res, 400, "this field is  required");

    const cartData = await cartSchema.findOne({ _id: cartId });
    if (!cartData || cartData.items.length === 0)
      return sendResponse(res, 400, "Cart is empty or invalid");

    const deliveryCharge = insideDhaka == "true" ? 70 : 110;

    const totalPrice = cartData.items.reduce((total, current) => {
      return total + current.subTotal;
    }, deliveryCharge);

    // const finalTotal = cartData.totalPrice + deliveryCharge;

    // creating pending order
    const orderData = new orderSchema({
      user: req.user._id,
      items: cartData.items,
      shippingAddress,
      insideDhaka,
      deliveryCharge,
      totalPrice,
      payment: {
        method: paymentType,
      },
      orderNumber,
    });

    // handling order payment based on payment type
    if (paymentType === "cash") {
      cartData.items = [];
      await orderData.save();
      return sendResponse(res, 200, "Order placed successfully", orderData);
    }
    if (paymentType === "Stripe") {
      // creating stripesession
      const session = await stripe.checkout.sessions.create({
        // payment_method_types: ["card"],
        // line_items: cartData.items.map((item) => ({
        //   price_data: {
        //     currency: "bdt",
        //     product_data: { name: "Order Items" },
        //     unit_amount: Math.round(totalPrice * 100),
        //   },
        //   quantity: 1,
        // })),
        line_items: [
          {
            price_data: {
              currency: "bdt",
              product_data: {
                name: "Your Order Total",
                description: `Includes delivery charge of ৳${deliveryCharge}`,
              },
              unit_amount: Math.round(totalPrice * 100), // Correct calculation in cents/poisha
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
        metadata: { orderId: orderData._id.toString() }, //IMPORTANT: Linking payment to my DB order
      });

      // updation order with sesion Id
      orderData.payment.sessionId = session.id;
      await orderData.save();

      return sendResponse(res, 200, "Redirecting to Stripe", {
        url: session.url,
      });
    }
    return sendResponse(res, 400, "Invalid payment method");
    // cartData.items = [];
    // await cartData.save();
  } catch (error) {
    console.error("checkOut-order Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};
module.exports = { checkOut };
