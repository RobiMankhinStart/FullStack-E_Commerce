const mongoose = require("mongoose");
const cartSchema = require("../models/cartSchema");
const orderSchema = require("../models/orderSchema");
const productSchema = require("../models/productSchema");
const sendResponse = require("../services/sendResponse");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/150?text=No+Image";

// Helper function to extract a valid image string from the populated product
const resolveProductImage = (product) => {
  if (!product) return PLACEHOLDER_IMAGE;

  const rawImage =
    (Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null) ||
    product.image ||
    product.thumbnail;

  if (!rawImage) return PLACEHOLDER_IMAGE;

  // If image is stored as an object (e.g. Cloudinary object { url: '...' })
  if (typeof rawImage === "object") {
    return rawImage.url || rawImage.secure_url || PLACEHOLDER_IMAGE;
  }

  return typeof rawImage === "string" && rawImage.trim() !== ""
    ? rawImage
    : PLACEHOLDER_IMAGE;
};

const checkOut = async (req, res) => {
  try {
    const { paymentType, cartId, shippingAddress, insideDhaka } = req.body;

    const orderNumber = `ORD-${Date.now()}`;
    const normalizedPayment = String(paymentType ?? "")
      .trim()
      .toLowerCase();

    if (!paymentType) return sendResponse(res, 400, "Payment type is required");
    if (!["stripe", "cash"].includes(normalizedPayment)) {
      return sendResponse(res, 400, "Invalid payment type");
    }
    // if (!cartId) return sendResponse(res, 400, "cartId required");
    if (!cartId || !mongoose.Types.ObjectId.isValid(cartId))
      return sendResponse(res, 400, "Valid cartId is required");
    if (!shippingAddress)
      return sendResponse(res, 400, "shipping Address  required");
    // if (!insideDhaka) return sendResponse(res, 400, "this field is  required");
    if (insideDhaka === undefined || insideDhaka === null) {
      return sendResponse(res, 400, "insideDhaka field is required");
    }

    // Populating cart items to extract title, image, price snapshots
    const cartData = await cartSchema
      .findOne({ _id: cartId })
      .populate("items.product");

    if (!cartData || cartData.items.length === 0)
      return sendResponse(res, 400, "Cart is empty or invalid");
    console.log("cartData :", cartData);

    //  Filtering out items whose referenced products no longer exist
    const validItems = cartData.items.filter((item) => item.product !== null);
    if (validItems.length === 0) {
      return sendResponse(
        res,
        400,
        "Products in this cart are no longer available",
      );
    }
    const paymentMethod = normalizedPayment === "stripe" ? "stripe" : "cash";
    // mapping items with exact snapshot values required by orderSChema
    const formattedOrderItems = validItems.map((item) => {
      const productObj = item.product;
      return {
        product: productObj._id,
        title: productObj.title || "Product Item",
        image: resolveProductImage(productObj),
        price: productObj.price || item.price || 0,
        sku: item.sku || "",
        quantity: item.quantity,
        subTotal: item.subTotal || item.quantity * (productObj.price || 0),
      };
    });

    const isInsideDhaka =
      String(insideDhaka) === "true" || insideDhaka === true;
    const deliveryCharge = isInsideDhaka ? 70 : 110;

    const totalPrice = formattedOrderItems.reduce((total, current) => {
      return total + current.subTotal;
    }, deliveryCharge);

    // const finalTotal = cartData.totalPrice + deliveryCharge;

    // creating pending order
    const orderData = new orderSchema({
      user: req.user._id,
      items: formattedOrderItems,
      shippingAddress,
      insideDhaka: isInsideDhaka,
      deliveryCharge,
      totalPrice,
      payment: {
        method: paymentMethod,
      },
      orderNumber,
    });

    const baseUrl =
      process.env.CLIENT_URL || req.headers.origin || "http://localhost:3000";

    // handling order payment based on payment type
    if (normalizedPayment === "cash") {
      await orderData.save();

      // Deducting stock for each variant purchased
      for (const item of formattedOrderItems) {
        if (item.sku && item.sku.trim() !== "") {
          await productSchema.updateOne(
            { _id: item.product, "variants.sku": item.sku },
            { $inc: { "variants.$.stock": -item.quantity } },
          );
        } else {
          await productSchema.updateOne(
            { _id: item.product },
            { $inc: { stock: -item.quantity } },
          );
        }
      }

      cartData.items = [];
      cartData.totalItems = 0;
      cartData.totalPrice = 0;

      await cartData.save();
      return sendResponse(res, 200, "Order placed successfully", orderData);
    }

    //payment with stripe
    if (normalizedPayment === "stripe") {
      await orderData.save();
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
                name: "Your total Order",
                description: `Includes delivery charge of ৳${deliveryCharge}`,
              },
              unit_amount: Math.round(totalPrice * 100), // Correct calculation in cents/poisha
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/checkout`,
        metadata: {
          orderId: orderData._id.toString(),
          cartId: cartData._id.toString(),
        }, //IMPORTANT: Linking payment to my DB order
      });

      // updating order with sesion Id
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

// Controller to Fetch User Order History
const getMyOrders = async (req, res) => {
  try {
    const orders = await orderSchema
      .find({ user: req.user._id })
      .sort({ createdAt: -1 }); // Newest first

    return sendResponse(res, 200, "Orders fetched successfully", orders);
  } catch (error) {
    console.error("getMyOrders Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

// Controller to Fetch Single Order Details
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(res, 400, "Invalid Order ID format");
    }
    const order = await orderSchema.findOne({ _id: id, user: req.user._id });

    if (!order) {
      return sendResponse(res, 404, "Order not found");
    }

    return sendResponse(res, 200, "Order details fetched successfully", order);
  } catch (error) {
    console.error("getOrderById Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};
module.exports = { checkOut, getMyOrders, getOrderById };
