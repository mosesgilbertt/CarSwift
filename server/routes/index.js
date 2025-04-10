const express = require("express");
const authentication = require("../middlewares/authentication");
const upload = require("../middlewares/uploadPhoto");

const Controller = require("../controllers/index");
const UserController = require("../controllers/userController");

const publicRouter = require("./publicRouter");
const adminRouter = require("./adminRouter");
const userRouter = require("./userRouter");
const carRouter = require("./carRouter");
const rentalRouter = require("./rentalRouter");

const router = express.Router();

router.get("/", Controller.test);

router.post(
  "/register",
  upload.single("profilePicture"),
  UserController.register
);

router.post("/login", UserController.login);

router.post("/google-login", UserController.googleLogin);

router.use("/pub", publicRouter);

router.use(authentication);

router.use("/profile", userRouter);

router.use("/admin", adminRouter);

router.use("/cars", carRouter);

router.use("/rentals", rentalRouter);

module.exports = router;
