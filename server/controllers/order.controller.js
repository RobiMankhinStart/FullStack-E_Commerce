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

// Controller to Fetch All Orders for Admin
const getAllOrdersForAdmin = async (req, res) => {
  try {
    // 1. Extract and sanitize query parameters
    const { page = 1, limit = 10, status, paymentStatus, search } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    // 2. Build dynamic filter query
    const query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query["payment.status"] = paymentStatus;
    }

    if (search && search.trim() !== "") {
      query.orderNumber = { $regex: search.trim(), $options: "i" };
    }

    // 3. Execute main orders query with pagination & population
    const [orders, totalOrders] = await Promise.all([
      orderSchema
        .find(query)
        .populate("user", "name email phone role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      orderSchema.countDocuments(query),
    ]);

    // 4. Calculate Global Summary Statistics using MongoDB Aggregation
    const summaryData = await orderSchema.aggregate([
      {
        $facet: {
          totalRevenue: [
            { $match: { "payment.status": "paid" } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } },
          ],
          statusCounts: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Format aggregation results
    const rawRevenue = summaryData[0]?.totalRevenue[0]?.total || 0;
    const statusMap = (summaryData[0]?.statusCounts || []).reduce(
      (acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      },
      {},
    );

    const summary = {
      totalRevenue: rawRevenue,
      pendingCount: statusMap["pending"] || 0,
      confirmedCount: statusMap["confirmed"] || 0,
      shippedCount: statusMap["shipped"] || 0,
      deliveredCount: statusMap["delivered"] || 0,
      cancelledCount: statusMap["cancelled"] || 0,
    };

    // 5. Build pagination response object
    const totalPages = Math.ceil(totalOrders / limitNum) || 1;
    const pagination = {
      totalOrders,
      currentPage: pageNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    };

    // 6. Return response
    return sendResponse(res, 200, "All orders fetched successfully", {
      orders,
      summary,
      pagination,
    });
  } catch (error) {
    console.error("getAllOrdersForAdmin Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

// Update Order Status (Admin / Editor)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 1. Validate status against schema enum
    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Must be one of: ${allowedStatuses.join(", ")}`,
      });
    }

    // 2. Prepare payload
    const updateData = { status };
    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    // 3. Update order in database
    const updatedOrder = await orderSchema.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to '${status}' successfully`,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating order status",
      error: error.message,
    });
  }
};
module.exports = {
  checkOut,
  getMyOrders,
  getOrderById,
  getAllOrdersForAdmin,
  updateOrderStatus,
};
