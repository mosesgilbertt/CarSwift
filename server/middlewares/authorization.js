function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    throw { name: "Forbidden", message: "You are not authorized" };
  }
  next();
}

module.exports = isAdmin;
