"use strict";

const { hashPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("Users", [
      {
        name: "SuperZeco",
        email: "admin@mail.com",
        password: hashPassword("123456"),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "John Doe",
        email: "user@mail.com",
        password: hashPassword("123456"),
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await queryInterface.bulkInsert(
      "Cars",
      require("../data/cars.json").map((el) => {
        delete el.id;
        return {
          ...el,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      })
    );

    // await queryInterface.bulkInsert("Rentals", [
    //   {
    //     UserId: 1,
    //     CarId: 1,
    //     rentalDate: new Date(),
    //     returnDate: new Date(),
    //     status: "ongoing",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Rentals", null, {});

    await queryInterface.bulkDelete("Cars", null, {});

    await queryInterface.bulkDelete("Users", null, {});
  },
};
