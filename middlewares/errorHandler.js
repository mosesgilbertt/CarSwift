function errorHandler(error, req, res, next) {
  console.error(error); // Debugging log di server

  let statusCode = error.status || 500;
  let message = error.message || "Internal Server Error";

  // ✅ Handle Sequelize Validation Errors
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    message = error.errors.map((e) => e.message);
  }

  if (error.name === "BadRequest") {
    statusCode = 400;
    message = error.message || "Data not found";
  }

  // ✅ Handle JWT Errors (Token Invalid / Expired)
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  // ✅ Handle Forbidden (403)
  if (error.name === "Forbidden") {
    statusCode = 403;
    message = error.message || "You are not authorized";
  }

  if (error.name === "NotFound") {
    statusCode = 404;
    message = error.message || "Resource not found";
  }

  // ✅ Handle Unauthorized (401) - Dari middleware authentication
  if (error.status === 401) {
    statusCode = 401;
    message = error.message || "Unauthorized";
  }

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
