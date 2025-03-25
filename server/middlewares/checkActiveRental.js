const { Rental } = require("../models");

const checkActiveRental = async (req, res, next) => {
  try {
    const { id } = req.user;

    const activeRental = await Rental.findOne({
      where: {
        UserId: id,
        status: "ongoing",
      },
    });

    if (activeRental) {
      throw {
        name: "Forbidden",
        message: "You cannot delete your account while renting a car",
      };
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkActiveRental;
