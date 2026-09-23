const { verifyToken } = require("../services/helper");
const sendResponse = require("../services/sendResponse");

const authMiddleware = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.["X-AS-Token"];
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return sendResponse(res, 401, "unauthorized user");
    }

    const decoded = verifyToken(token);
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
