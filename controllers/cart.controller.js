const mongoose = require("mongoose");
const cartSchema = require("../models/cartSchema");
const productSchema = require("../models/productSchema");
const sendResponse = require("../services/sendResponse");
const { isValidId } = require("../services/validation");

const addToCart = async (req, res) => {
  try {
    const { productId, sku, quantity } = req.body;
    if (!productId || !sku || !quantity)
      return sendResponse(res, 400, "Invalid request");

    // 2. Preventing CastError: Validating if the ID is a valid MongoDB format
    if (!isValidId([productId])) {
      return sendResponse(res, 400, "Invalid Product ID format");
    }

    const productData = await productSchema.findOne({ _id: productId });
    console.log("productData :", productData);
    if (!productData)
      return sendResponse(res, 400, "This product doesen't exist");

    const isValidSku = productData.variants.some((v) => v.sku == sku);
    if (!isValidSku) {
      return sendResponse(res, 400, "Invalid SKU for this product");
    }

    const discountedAmount =
      (productData.price * productData.discountPercentage) / 100;
    const discountedPrice = productData.price - discountedAmount;
    const subTotal = discountedPrice * quantity;

    // ..................old way..........

    // finding if cart already exists
    // const existingCart = await cartSchema.findOne({ user: req.user._id });

    // if (existingCart) {
    //   // if the product with the same sku already in the cart
    //   const existing_Sku = existingCart.items.some((Pitem) => Pitem.sku == sku);
    //   if (existing_Sku) return sendResponse(res, 400, " Already added to cart");

    //   existingCart.items.push({
    //     product: productId,
    //     sku,
    //     quantity,
    //     subTotal,
    //   });
    //   await existingCart.save();
    //   return sendResponse(res, 201, "Product added to cart");
    // } else {
    //   // if the product is new
    //   await cartSchema.create({
    //     user: req.user._id,
    //     items: [
    //       {
    //         product: productId,
    //         sku,
    //         quantity,
    //         subTotal,
    //       },
    //     ],
    //   });
    //   return sendResponse(res, 201, "product added to cart");
    // }
    // ....................problem...................
    // note: The "Race Condition" Risk: If a user double - clicks the
    // "Add to Cart" button, the code might process two requests
    // simultaneously.Both might see "no cart exists" and both will try
    // to create one, causing the E11000 duplicate key error you saw
    // earlier.

    //................. updated way ...................
    // 4. Atomic Update
    // If the cart exists and the SKU is already in it,
    // findOneAndUpdate will
    // return null because the 'items.sku: { $ne: sku }' filter fails.

    const cart = await cartSchema.findOneAndUpdate(
      {
        user: req.user._id,
        "items.sku": { $ne: sku }, // Ensure SKU doesn't exist before pushing
      },
      {
        $push: {
          items: { product: productId, sku, quantity, subTotal },
        },
      },
      { new: true, upsert: true, runValidators: true },
    );

    if (!cart) {
      return sendResponse(res, 400, "Product already exists in cart");
    }
    // If the query didn't update anything (because the SKU already existed),
    // it returns null or the existing document without changes.
    // so verifying if the item was actually added.
    // const isItemAdded = cart.items.find((item) => item.sku === sku);

    // Simple check: If the cart existed before and we didn't add the item (because of the $ne check),
    // or if the logic flow above needs refinement:
    return sendResponse(res, 201, "Product added to cart");
  } catch (error) {
    // If the duplicate key error happens (e.g. unique index on user), handlling it
    if (error.code === 11000) {
      return sendResponse(res, 400, "Product already exists in cart");
    }
    console.error("addToCart Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const getUserCart = async (req, res) => {
  try {
    const cart = await cartSchema
      .findOne({ user: req.user._id })
      .select("-user");

    return sendResponse(res, 200, "", cart);
  } catch (error) {
    console.error("getUserCart Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, itemId, quantity } = req.body;

    if (!isValidId([productId, itemId]))
      return sendResponse(res, 400, "Invalid ID format");

    if (!productId || !quantity || !itemId)
      return sendResponse(res, 400, "invalid request");

    const numQuan = parseInt(quantity, 10);
    if (numQuan < 1) return sendResponse(res, 400, "keep minimum 1 product ");

    const productData = await productSchema.findById(productId);

    const discountedAmount =
      (productData.price * productData.discountPercentage) / 100;

    const discountedPrice = productData.price - discountedAmount;

    const subTotal = discountedPrice * quantity;

    const cart = await cartSchema
      .findOneAndUpdate(
        {
          user: req.user._id,
          "items._id": itemId,
        },
        {
          $set: { "items.$.quantity": quantity, "items.$.subTotal": subTotal },
        },
        { new: true },
      )
      .select("items totalItems ");

    return sendResponse(res, 200, "Cart updated", cart);
  } catch (error) {
    console.error("getUserCart Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!isValidId([itemId]))
      return sendResponse(res, 400, "Invalid ID format");

    if (!itemId) return sendResponse(res, 400, "invalid request");

    const cart = await cartSchema
      .findOneAndUpdate(
        {
          user: req.user._id,
          "items._id": itemId,
        },
        {
          $pull: { items: { _id: itemId } },
        },
        { new: true },
      )
      .select("items totalItems ");

    return sendResponse(res, 200, "Item removed", cart);
  } catch (error) {
    console.error("getUserCart Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};
module.exports = { addToCart, getUserCart, updateCart, removeFromCart };
