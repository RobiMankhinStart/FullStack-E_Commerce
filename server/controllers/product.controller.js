const categorySchema = require("../models/categorySchema");
const productSchema = require("../models/productSchema");
const {
  cloudinaryUpload,
  cloudinaryDelete,
} = require("../services/CloudinaryService");
const sendResponse = require("../services/sendResponse");

const cloudinary = require("cloudinary").v2;
const SizeEnum = ["s", "m", "l", "xl", "xxl"];
const createProduct = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
    } = req.body;

    if (!title) return sendResponse(res, 400, "Product title is required");
    if (!slug) return sendResponse(res, 400, "Slug is required");
    const existingSlug = await productSchema.findOne({
      slug: slug.toLowerCase(),
    });
    if (existingSlug) return sendResponse(res, 400, "This Slug already exists");
    if (!description)
      return sendResponse(res, 400, "Product description is required");
    if (!category) return sendResponse(res, 400, "Category is required");
    const existingCategory = await categorySchema.findById(category);
    if (!existingCategory) return sendResponse(res, 400, "Invalid Category");

    if (!price || price <= 100)
      return sendResponse(
        res,
        400,
        "Price is required and minimum price is 100",
      );

    console.log("variants :", variants);
    const variantData = JSON.parse(variants);
    console.log("variants-After_Json :", variantData);

    if (!Array.isArray(variantData) || variantData.length === 0)
      return sendResponse(res, 400, "minimum 1 variant is required");

    for (const variant of variantData) {
      console.log("variant", variant);

      if (!variant.sku) return sendResponse(res, 400, "SKU is required");

      if (!variant.color) return sendResponse(res, 400, "color is required");
      if (!variant.size) return sendResponse(res, 400, "size is required");
      if (!SizeEnum.includes(variant.size))
        return sendResponse(res, 400, "Invalid size");
      if (!variant.stock || variant.stock < 1)
        return sendResponse(res, 400, "Minimum 1 stock is required");
    }

    const skus = variantData.map((v) => v.sku);
    if (new Set(skus).size !== skus.length)
      return sendResponse(res, 400, "SKUs must be unique");
    // const exsitingProduct = await productSchema.findOne({ name });
    // if (exsitingName)
    //   return sendResponse(res, 400, "This Category name already exists");

    const thumbnail = req.files.thumbnail;
    const images = req.files.images;
    // console.log("req.files:", req.files);

    console.log("images:", req.files.images);
    console.log("thumbnail:", req.files.thumbnail);

    if (!thumbnail || thumbnail?.length === 0)
      return sendResponse(res, 400, "Product thumbnail is required");

    const thumbRes = await cloudinaryUpload(thumbnail[0], "Product_Thumbnail");

    if (images && images?.length > 4)
      return sendResponse(res, 400, "you can upload maximum 4 images");

    let imgSecureUrl = [];
    if (images) {
      const res = images.map(async (item) =>
        cloudinaryUpload(item, "products"),
      );
      const result = await Promise.all(res);
      console.log("imagesCloud-upload-result", result);

      imgSecureUrl = result.map((su) => su.secure_url);
      // result.map((su) =>imgSecureUrl.push(su.secure_url) ); bad practice
    }
    // console.log("imgSecureUrl", imgSecureUrl);

    const newProduct = new productSchema({
      title,
      slug: slug.toLowerCase(),
      description,
      category,
      price,
      discountPercentage,
      variants: variantData,
      thumbnail: thumbRes.secure_url,
      images: imgSecureUrl,
      tags,
      isActive,
    });
    await newProduct.save();
    return sendResponse(res, 201, "Product created successfully", newProduct);
  } catch (error) {
    console.error("createCategory Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    console.log("page :", page);

    const limit = parseInt(req.query.limit) || 10;
    console.log("limit :", limit);

    const category = req.query.category;
    console.log("category :", category);

    const skip = (page - 1) * limit;
    const totalProducts = await productSchema.countDocuments();

    // for advance filtering
    const pipeline = [
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      ...(category ? [{ $match: { "category.slug": category } }] : []),

      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ];
    // if (category) {
    //   pipeline.push({
    //     $match: {
    //       "category.slug": category,
    //     },
    //   });
    // }

    const productList = await productSchema.aggregate(pipeline);
    console.log("productList :", productList);

    // for simple filtering
    // const productList = await productSchema
    //   .find()
    //   .populate("category")
    //   // .populate("category", "name")
    //   .skip(skip)
    //   .limit(limit)
    //   .sort({ createdAt: -1 });
    // for simple filtering

    const totalPages = Math.ceil(totalProducts / limit);

    return sendResponse(res, 201, "Product List", {
      productList: productList,
      pagination: {
        total: totalProducts,
        currentPage: page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("createCategory Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const productDetails = await productSchema
      .findOne({ slug })
      .populate("category", "name")
      .select(" -updatedAt");
    if (!productDetails) return sendResponse(res, 404, "Product not found");
    return sendResponse(res, 200, "Product Details", productDetails);
  } catch (error) {
    console.error("createCategory Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      price,
      discountPercentage,
      variants,
      tags,
      isActive,
      // deleteImgUrls = [],
    } = req.body;
    const { slug } = req.params;
    let deleteImgUrls = req.body.deleteImgUrls || [];
    console.log("Searching for slug:", slug); // Debugging line
    const thumbnail = req.files.thumbnail;
    const images = req.files.images;

    const productData = await productSchema.findOne({ slug });
    console.log("Found product:", productData); // Debugging line
    if (!productData) return sendResponse(res, 404, "Product not found");

    if (title) productData.title = title;
    if (description) productData.description = description;
    if (category) productData.category = category;
    if (price) productData.price = price;
    if (tags && tags?.length > 0 && Array.isArray(tags))
      productData.tags = tags;
    if (discountPercentage) productData.discountPercentage = discountPercentage;
    if (isActive !== undefined)
      productData.isActive = isActive === "true" || isActive === true;

    if (variants) {
      let variantData;
      try {
        variantData = JSON.parse(variants);
        console.log("variants-After_Json :", variantData);
      } catch (error) {
        console.log("variants error : ", error);
        return sendResponse(res, 400, "Invalid JSON format for variants");
      }

      if (!Array.isArray(variantData) || variantData.length === 0) {
        return sendResponse(res, 400, "Variants must be a non-empty array");
      }

      for (const variant of variantData) {
        console.log("variant", variant);

        if (!variant.sku) return sendResponse(res, 400, "SKU is required");

        if (!variant.color) return sendResponse(res, 400, "color is required");
        if (!variant.size) return sendResponse(res, 400, "size is required");
        if (!SizeEnum.includes(variant.size))
          return sendResponse(res, 400, "Invalid size");
        if (!variant.stock || variant.stock < 1)
          return sendResponse(res, 400, "Minimum 1 stock is required");
      }

      const skus = variantData.map((v) => v.sku);
      if (new Set(skus).size !== skus.length)
        return sendResponse(res, 400, "SKUs must be unique");

      productData.variants = variantData;
    }

    // thumbnail management
    if (thumbnail && thumbnail[0]) {
      // deleting img from cloud
      try {
        if (productData.thumbnail) {
          const cloudImgPub_id = productData.thumbnail
            .split("/")
            .pop()
            .split(".")[0];

          await cloudinaryDelete(`Product_Thumbnail/${cloudImgPub_id}`);
        }
      } catch (deleteError) {
        console.warn(
          "Image was likely already deleted from Cloudinary:",
          deleteError.message,
        );
      }

      // uploading img to cloud
      const cloudRes = await cloudinaryUpload(
        thumbnail[0],
        "Product_Thumbnail",
      );
      productData.thumbnail = cloudRes.secure_url;
      console.log("thumbnail :", cloudRes);
    }

    // safety parsing of deleteImgUrls
    if (typeof deleteImgUrls === "string") {
      try {
        deleteImgUrls = JSON.parse(deleteImgUrls);
      } catch (error) {
        deleteImgUrls = [];
      }
    }
    if (!Array.isArray(deleteImgUrls)) {
      deleteImgUrls = [];
    }

    // managing product images
    let imgSecureUrl = [];
    let totalImgs = productData.images.length;
    if (deleteImgUrls.length > 0) totalImgs -= deleteImgUrls.length;
    if (Array.isArray(images) && images.length > 0) totalImgs += images.length;

    if (totalImgs > 4)
      return sendResponse(res, 400, "Maximum 4 images can be uploaded");

    if (totalImgs < 1)
      return sendResponse(res, 400, "Minimum 1 image needs to be uploaded");

    if (images) {
      const res = images.map(async (item) =>
        cloudinaryUpload(item, "products"),
      );
      const result = await Promise.all(res);
      // console.log("imagesCloud-upload-result", result);

      imgSecureUrl = result.map((su) => su.secure_url);
    }

    if (Array.isArray(deleteImgUrls) && deleteImgUrls.length > 0) {
      for (const url of deleteImgUrls) {
        const cloudImgPub_id = url.split("/").pop().split(".")[0];
        await cloudinaryDelete(`products/${cloudImgPub_id}`);
      }
    }

    let filtered_Imgs = productData.images.filter(
      (item) => !deleteImgUrls.includes(item),
    );
    imgSecureUrl = imgSecureUrl.concat(filtered_Imgs);
    if (imgSecureUrl.length > 0) productData.images = imgSecureUrl;

    await productData.save();
    return sendResponse(res, 200, "Product updated successfully", productData);
  } catch (error) {
    console.error("Update Error:", error);
    return sendResponse(res, 500, "Internal server error");
  }
};
module.exports = {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProduct,
};
