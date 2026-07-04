const { verifyToken } = require("../services/helper");
const sendResponse = require("../services/sendResponse");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token) {
      return sendResponse(res, 401, "unauthorized user");
    }
    // console.log("CookieAs-token :", token["X-AS-Token"]);
    const decoded = verifyToken(token["X-AS-Token"]);
    console.log("decoded-token :", decoded);
    if (!decoded) {
      return sendResponse(res, 401, "unauthorized user");
    }
    req.user = decoded;
    next();
  } catch (error) {
    return sendResponse(res, 401, "unauthorized user");
  }
};
module.exports = { authMiddleware };
