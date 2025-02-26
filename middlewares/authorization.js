function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    next({ name: "Forbidden", message: "You are not authorized" });
    return;
  }
  next();
}

module.exports = isAdmin;
