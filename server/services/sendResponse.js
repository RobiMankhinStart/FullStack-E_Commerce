/**
 * @param {Object} res - The Express response object
 * @param {Number} statusCode - HTTP status code (200, 400, 500, etc.)
 * @param {String} message - The message to show the user
 * @param {Object} data - Optional data (like user info or a token)
 */
const sendResponse = (res, statusCode, message, data = null) => {
  const response = {
    success: statusCode < 400, // true for 2xx, false for 4xx/5xx
    message: message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;
