const express = require("express");
const PublicController = require("../controllers/publicController");
const pub = express.Router();

pub.get("/cars", PublicController.pubGetCars);

pub.get("/cars/:id", PublicController.pubGetCarById);

module.exports = pub;
