const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");
const PublicController = require("../controllers/publicController");
// const user = require("./user");
const public = require("./public");
const car = require("./car");
const rental = require("./rental");

const UserController = require("../controllers/userController");
const pub = require("./public");

router.get("/", Controller.test);

router.post("/register", UserController.createUser);

router.post("/login", UserController.login);

router.use("/pub", public);

router.use("/cars", car);

router.use("/rentals", rental);

module.exports = router;
