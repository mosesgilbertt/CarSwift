const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async createUser(req, res) {
    try {
      const user = await User.create(req.body);

      res.status(201).json({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        res.status(400).json({ message: error.errors[0].message });
      } else {
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email and Password are required" });
      return;
    }
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        res.status(401).json({ message: "Email or Password is incorrect" });
        return;
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        res.status(401).json({ message: "Email or Password is incorrect" });
        return;
      }

      const access_token = signToken({ id: user.id });

      res.json({ access_token });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = UserController;
