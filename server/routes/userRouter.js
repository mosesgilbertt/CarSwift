const express = require("express");

const UserController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.put("/", UserController.updateProfile);

module.exports = userRouter;
