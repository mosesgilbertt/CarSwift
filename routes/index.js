const express = require("express");
const router = express.Router();
const Controller = require("../controllers/index");
const user = require("./user");
const car = require("./car");
const rental = require("./rental");

router.get("/", Controller.test);

router.use("/users", user);

router.use("/cars", car);

router.use("/rentals", rental);

module.exports = router;
