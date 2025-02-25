const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.JWT_SECRET_KEY;

module.exports = {
  signToken: (data) => jwt.sign(data, secret),

  verifyToken: (token) => jwt.verify(token, secret),
};
