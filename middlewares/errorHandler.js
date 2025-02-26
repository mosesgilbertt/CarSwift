function errorHandler(error, req, res, next) {
  console.log(error);

  let statusCode = err.status || 500;
  let message = error.message || "Internal Server Error";

  // Handling Sequelize Errors (Validation & Unique Constraint)
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    message = error.errors.map((e) => e.message).join(", ");
  }

  // Handling JWT Errors (Token Invalid or Expired)
  if (
    error.name === "JsonWebTokenError" ||
    error.name === "TokenExpiredError"
  ) {
    statusCode = 401;
    message = "Invalid or expired token";
  }

  // Handling Not Found (404)
  if (statusCode === 404) {
    message = message || "Resource not found";
  }

  res.status(statusCode).json({ message });
}

module.exports = errorHandler;
