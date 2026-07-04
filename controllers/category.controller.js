const categorySchema = require("../models/categorySchema");
const { cloudinaryUpload } = require("../services/CloudinaryService");
const sendResponse = require("../services/sendResponse");

const cloudinary = require("cloudinary").v2;

const createCategory = async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    const thumbnail = req.file;
    if (!name) return sendResponse(res, 404, "Category name is required");
    if (!slug) return sendResponse(res, 404, "Slug is required");
    if (!thumbnail)
      return sendResponse(res, 404, "Category Thumbnail is required");

    const exsitingSlug = await categorySchema.findOne({ slug });
    if (exsitingSlug)
      return sendResponse(res, 404, " Category with this slug already exists");

    const cloudRes = await cloudinaryUpload(thumbnail, "categories");
    console.log("Category-cloudRes :", cloudRes);

    const category = categorySchema({
      name: name,
      slug: slug,
      description,
      thumbnail: cloudRes.secure_url,
    });
    await category.save();
    return sendResponse(res, 200, "Category created successfully", category);
  } catch (error) {
    console.error("createCategory Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const getALlCategories = async (req, res) => {
  try {
    const categories = await categorySchema.find({});
    return sendResponse(
      res,
      200,
      "Category list found successfully",
      categories,
    );
  } catch (error) {
    console.error("getALlCategories Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};
module.exports = { createCategory, getALlCategories };
