const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");
// const user = require("./user");
const car = require("./car");
const rental = require("./rental");
const UserController = require("../controllers/userController");

router.get("/", Controller.test);

router.post("/register", UserController.createUser);

router.post("/login", UserController.login);

router.use("/cars", car);

router.use("/rentals", rental);

module.exports = router;
