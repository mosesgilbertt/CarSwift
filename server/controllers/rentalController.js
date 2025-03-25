const { formatDateTime } = require("../helpers/dateFormatter");
const { Rental, Car, User } = require("../models");

class RentalController {
  static async bookCar(req, res, next) {
    try {
      const { CarId, rentalDate, returnDate } = req.body;
      const UserId = req.user.id;

      if (!CarId) {
        throw { name: "BadRequest", message: "Car is required" };
      }

      if (!rentalDate) {
        throw { name: "BadRequest", message: "Rental date is required" };
      }

      if (!returnDate) {
        throw { name: "BadRequest", message: "Return date is required" };
      }

      if (new Date(returnDate) <= new Date(rentalDate)) {
        throw {
          name: "BadRequest",
          message: "Return date must be after rental date",
        };
      }

      const car = await Car.findByPk(CarId);
      if (!car) {
        throw { name: "NotFound", message: "Car not found" };
      }
      if (car.status !== "available") {
        throw { name: "BadRequest", message: "Car is not available" };
      }

      const existingRental = await Rental.findOne({
        where: {
          CarId,
          status: "ongoing",
        },
      });

      if (existingRental) {
        throw { name: "BadRequest", message: "Car is already rented" };
      }

      const rental = await Rental.create({
        UserId,
        CarId,
        rentalDate,
        returnDate,
        status: "ongoing",
      });

      await car.update({ status: "rented" });

      res
        .status(201)
        .json({ message: `Car with ID:${rental.CarId} booked successfully` });
    } catch (error) {
      // Tambahin log error buat debug
      next(error);
    }
  }

  // Customer melihat daftar penyewaan mereka
  static async getUserRentals(req, res, next) {
    try {
      const rentals = await Rental.findAll({
        where: { UserId: req.user.id },
        include: [{ model: Car }],
      });

      if (!rentals) {
        throw { name: "NotFound", message: "Rentals not found" };
      }

      res.status(200).json({ rentals });
    } catch (error) {
      next(error);
    }
  }

  // Admin melihat semua penyewaan
  static async getAllRentals(req, res, next) {
    try {
      const rentals = await Rental.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name"], // Hanya ambil id & name
          },
          {
            model: Car,
            attributes: ["id", "name", "image"], // Hanya ambil id, name & image
          },
        ],
      });

      res.status(200).json({ rentals });
    } catch (error) {
      next(error);
    }
  }

  static async returnCar(req, res, next) {
    try {
      const { id } = req.params;
      const rental = await Rental.findByPk(id, { include: [{ model: Car }] });

      if (!rental) {
        throw { name: "NotFound", message: "Rental not found" };
      }
      if (rental.UserId !== req.user.id && req.user.role !== "admin") {
        throw {
          name: "Forbidden",
          message: "You are not authorized to return this car",
        };
      }

      // Update status penyewaan
      await rental.update({ status: "returned" });

      // Update status mobil jadi available lagi
      await rental.Car.update({ status: "available" });

      const returnDateFormatted = formatDateTime(rental.returnDate);
      res.status(200).json({
        message: `${rental.Car.name} have been returned at ${returnDateFormatted}`,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RentalController;
