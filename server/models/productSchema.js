const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    variants: [
      {
        sku: {
          type: String,
          required: true,
          unique: true,
        },

        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
          enum: ["s", "m", "l", "xl", "xxl"],
        },
        stock: {
          type: Number,
          required: true,
        },
      },
    ],
    tags: [{ type: String }],
    thumbnail: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    isActive: {
      type: Boolean,
      default: false,
    },
    review: {
      type: mongoose.Types.ObjectId,
      ref: "review",
    },
  },
  { timestamps: true },
);

// productSchema.index({ slug: 1 });
module.exports = mongoose.model("product", productSchema);
