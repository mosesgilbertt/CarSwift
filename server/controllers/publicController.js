const { Op } = require("sequelize");
const { Car } = require("../models");

class PublicController {
  static async pubGetCars(req, res, next) {
    const { type, brand, minPrice, maxPrice, page, limit, sortBy, orderBy } =
      req.query;
    try {
      // FILTERING
      let whereClause = { status: "available" };

      if (type) {
        whereClause.type = type;
      }

      if (brand) {
        whereClause.brand = brand;
      }

      if (minPrice || maxPrice) {
        whereClause.price_per_day = {};
        if (minPrice) {
          whereClause.price_per_day[Op.gte] = minPrice;
        }
        if (maxPrice) {
          whereClause.price_per_day[Op.lte] = maxPrice;
        }
      }

      // SORTING
      let order = [];
      if (sortBy) {
        const validColumns = ["name", "brand", "year", "price_per_day"];
        if (validColumns.includes(sortBy)) {
          order.push([sortBy, orderBy === "desc" ? "DESC" : "ASC"]);
        }
      }

      //PAGINATION
      const pageNumber = parseInt(page) || 1;
      const pageSize = parseInt(limit) || 10;
      const offset = (pageNumber - 1) * pageSize;

      const { rows: cars, count: totalCars } = await Car.findAndCountAll({
        where: whereClause,
        order: order,
        limit: pageSize,
        offset: offset,
      });

      res.json({
        currentPage: pageNumber,
        totalPages: Math.ceil(totalCars / pageSize),
        totalCars,
        cars,
      });
    } catch (error) {
      next(error);
    }
  }

  static async pubGetCarById(req, res, next) {
    try {
      const { id } = req.params;

      const car = await Car.findByPk(id);

      if (!car) {
        throw { status: 404, message: "Car not found" };
      }

      res.json(car);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PublicController;
