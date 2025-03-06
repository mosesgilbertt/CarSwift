"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Car extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Car.hasMany(models.Rental, { foreignKey: "CarId" });
    }
  }
  Car.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name of The Car is required",
          },
          notEmpty: {
            msg: "Name of The Car is required",
          },
        },
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Brand of The Car is required",
          },
          notEmpty: {
            msg: "Brand of The Car is required",
          },
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Year of The Car is required",
          },
          notEmpty: {
            msg: "Year of The Car is required",
          },
        },
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Type of The Car is required",
          },
          notEmpty: {
            msg: "Type of The Car is required",
          },
        },
      },
      image: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image of The Car is required",
          },
          notEmpty: {
            msg: "Image of The Car is required",
          },
        },
      },
      price_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price of The Car is required",
          },
          notEmpty: {
            msg: "Price of The Car is required",
          },
        },
      },
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Car",
    }
  );
  Car.beforeCreate((car) => {
    car.status = "available";
  });
  return Car;
};
