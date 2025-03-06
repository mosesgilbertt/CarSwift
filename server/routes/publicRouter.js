const express = require("express");
const PublicController = require("../controllers/publicController");

const publicRouter = express.Router();

publicRouter.get("/cars", PublicController.pubGetCars);

publicRouter.get("/cars/:id", PublicController.pubGetCarById);

module.exports = publicRouter;
