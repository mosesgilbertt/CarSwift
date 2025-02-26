const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

class UserController {
  static async createUser(req, res, next) {
    try {
      const user = await User.create(req.body);

      res.status(201).json({
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw { status: 400, message: "Email and Password are required" };
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw { status: 401, message: "Email or Password is incorrect" };
      }

      const isValidPassword = comparePassword(password, user.password);
      if (!isValidPassword) {
        throw { status: 401, message: "Email or Password is incorrect" };
      }

      const access_token = signToken({ id: user.id });

      res.json({ access_token });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
