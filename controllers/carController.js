const { Car } = require("../models");

class CarController {
  static async getCars(req, res, next) {
    try {
      const cars = await Car.findAll();

      res.status(200).json(cars);
    } catch (error) {
      next(error);
    }
  }

  static async createCar(req, res, next) {
    try {
      const car = await Car.create(req.body);

      res.status(201).json(car);
    } catch (error) {
      next(error);
    }
  }

  static async updateCarById(req, res, next) {
    try {
      const { name, brand, year, type, image, price_per_day, status } =
        req.body;

      if (!name) {
        throw { status: 400, message: "Name of Car is required" };
      }

      if (!brand) {
        throw { status: 400, message: "Brand of Car is required" };
      }

      if (!year) {
        throw { status: 400, message: "Year of Car is required" };
      }

      if (!type) {
        throw { status: 400, message: "Type of Car is required" };
      }

      if (!image) {
        throw { status: 400, message: "Image of Car is required" };
      }

      if (!price_per_day) {
        throw { status: 400, message: "Price of Car is required" };
      }

      if (!status) {
        throw { status: 400, message: "Status of Car is required" };
      }

      const { id } = req.params;

      const car = await Car.findByPk(id);
      if (!car) {
        throw { status: 404, message: "Car not found" };
      }

      await Car.update(req.body, { where: { id } });

      res.json({ message: `${car.name} updated successfully` });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCar(req, res, next) {
    try {
      const { id } = req.params;

      const car = await Car.findByPk(id);
      if (!car) {
        throw { status: 404, message: "Car not found" };
      }

      await Car.destroy({ where: { id } });

      res.json({ message: `${car.name} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CarController;
