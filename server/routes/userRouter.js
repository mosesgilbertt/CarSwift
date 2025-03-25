const express = require("express");

const UserController = require("../controllers/userController");
const checkActiveRental = require("../middlewares/checkActiveRental");

const userRouter = express.Router();

userRouter.get("/", UserController.detailProfile);

userRouter.put("/update", UserController.updateProfile);

userRouter.delete("/delete", checkActiveRental, UserController.deleteAccount);

module.exports = userRouter;
