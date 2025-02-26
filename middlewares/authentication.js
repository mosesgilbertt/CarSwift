const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models");

async function authentication(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw { status: 401, message: "Unauthorized" };

    const token = authorization.split(" ")[1]; // Format: Bearer <token>
    const decoded = verifyToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) throw { status: 401, message: "Unauthorized" };

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

module.exports = authentication;
