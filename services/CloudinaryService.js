const cloudinary = require("cloudinary").v2;

const cloudinaryUpload = async (file, folder) => {
  const baseString = file.buffer.toString("base64");
  const stringUrl = `data:${file.mimetype};base64,${baseString}`;
  const cloudRes = await cloudinary.uploader.upload(stringUrl, { folder });
  return cloudRes;
};
const cloudinaryDelete = async (fileID) => {
  try {
    const result = await cloudinary.uploader.destroy(fileID);
    return result;
  } catch (error) {
    console.log(error);
  }
};

module.exports = { cloudinaryUpload, cloudinaryDelete };
