const express = require("express");
const CarController = require("../controllers/carController");
const car = express.Router();

car.get("/", CarController.getCars);

car.post("/", CarController.createCar);

car.put("/:id", CarController.updateCarById);

car.delete("/:id", CarController.deleteCar);

module.exports = car;
