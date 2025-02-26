const express = require("express");
const RentalController = require("../controllers/rentalController");
const isAdmin = require("../middlewares/authorization");

const rentalRouter = express.Router();

rentalRouter.post("/", RentalController.bookCar);

// Admin melihat semua penyewaan
rentalRouter.get("/", isAdmin, RentalController.getAllRentals);

// Mengembalikan mobil
rentalRouter.patch("/:id/return", RentalController.returnCar);

// Customer melihat daftar penyewaan
rentalRouter.get("/my-rentals", RentalController.getUserRentals);

module.exports = rentalRouter;
