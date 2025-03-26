const express = require("express");
const RentalController = require("../controllers/rentalController");
const isAdmin = require("../middlewares/authorization");

const rentalRouter = express.Router();

// Admin melihat semua penyewaan
rentalRouter.get("/", isAdmin, RentalController.getAllRentals);

rentalRouter.post("/:id", RentalController.bookCar);

// Mengembalikan mobil
rentalRouter.patch("/:id/return", RentalController.returnCar);

// Customer melihat daftar penyewaan
rentalRouter.get("/my-rentals", RentalController.getUserRentals);

module.exports = rentalRouter;
