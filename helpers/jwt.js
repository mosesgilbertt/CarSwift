require("dotenv").config();
const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET_KEY;

module.exports = {
  signToken: (data) => jwt.sign(data, secret),

  verifyToken: (token) => jwt.verify(token, secret),
};
