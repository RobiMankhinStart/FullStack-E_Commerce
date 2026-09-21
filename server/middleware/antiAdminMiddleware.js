const { verifyToken } = require("../services/helper");
const sendResponse = require("../services/sendResponse");

const antiAdminMiddleware = (req, res, next) => {
  try {
    const cookieToken = req.cookies?.["X-AS-Token"];
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;
    const token = cookieToken || bearerToken;

    if (!token) {
      return sendResponse(res, 401, "unauthorized user");
    }

    let decoded = null;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      decoded = null;
    }

    if (!decoded?._id) {
      return sendResponse(res, 401, "unauthorized user");
    }

    req.user = decoded;

    const restrictedRoles = ["admin", "editor"];
    const userRole = String(decoded.role || "").toLowerCase();

    if (restrictedRoles.includes(userRole)) {
      return sendResponse(
        res,
        403,
        "Admin or Editor users are not allowed to take this action",
      );
    }

    next();
  } catch (error) {
    console.error("antiAdminMiddleware Error:", error);
    return sendResponse(
      res,
      500,
      "Internal server error in antiAdminMiddleware",
    );
  }
};

module.exports = { antiAdminMiddleware };
