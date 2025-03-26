const express = require("express");

const UserController = require("../controllers/userController");
const checkActiveRental = require("../middlewares/checkActiveRental");
const upload = require("../middlewares/uploadPhoto");

const userRouter = express.Router();

userRouter.get("/", UserController.detailProfile);

userRouter.put("/update", UserController.updateProfile);

userRouter.patch(
  "/update/image",
  upload.single("profilePicture"),
  UserController.updateProfilePicture
);

userRouter.delete("/delete", checkActiveRental, UserController.deleteAccount);

module.exports = userRouter;
