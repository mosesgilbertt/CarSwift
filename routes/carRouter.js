const express = require("express");
const isAdmin = require("../middlewares/authorization");

const CarController = require("../controllers/carController");

const carRouter = express.Router();

carRouter.get("/", CarController.getAllCars);

carRouter.get("/:id", CarController.getCarById);

carRouter.post("/", isAdmin, CarController.createCar);

carRouter.put("/:id", isAdmin, CarController.updateCarById);

carRouter.delete("/:id", isAdmin, CarController.deleteCar);

module.exports = carRouter;
