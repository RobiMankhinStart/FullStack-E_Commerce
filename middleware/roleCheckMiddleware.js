const sendResponse = require("../services/sendResponse");

const roleCheckMiddleware = (...role) => {
  return (req, res, next) => {
    try {
      console.log("RoleCheckMid-role :", role);
      console.log("RoleCheckMid-req.user : ", req.user);

      if (!req.user) {
        return sendResponse(res, 401, "Unauthorized: No user data found");
      }

      if (!role.includes(req.user.role)) {
        return sendResponse(
          res,
          403,
          "Access denied: You do not have permission",
        );
      }
      next();
    } catch (error) {
      console.log("roleChkMidError:", error);

      return sendResponse(res, 500, "invalid request");
    }
  };
};

module.exports = roleCheckMiddleware;
