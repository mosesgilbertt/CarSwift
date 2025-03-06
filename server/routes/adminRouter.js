const express = require("express");
const isAdmin = require("../middlewares/authorization");

const UserController = require("../controllers/userController");

const adminRouter = express.Router();

adminRouter.get("/", isAdmin, UserController.getAllUsers);

adminRouter.delete("/:id", isAdmin, UserController.deleteUserById);

adminRouter.patch("/:id/role", isAdmin, UserController.updateUserRole);

module.exports = adminRouter;
