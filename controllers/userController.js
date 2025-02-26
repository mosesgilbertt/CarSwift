const { comparePassword, hashPassword } = require("../helpers/bcrypt");
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

  static async updateProfile(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const userId = req.user.id; // ID dari user yang login

      let updatedData = { name, email };

      if (password) {
        hashPassword(password);
      }

      const [updated] = await User.update(updatedData, {
        where: { id: userId },
        returning: true,
      });

      if (!updated) {
        throw { name: "NotFound", message: "User not found" };
      }

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUserById(req, res, next) {
    try {
      const { id } = req.params; // ID user yang akan dihapus

      const deleted = await User.destroy({ where: { id } });

      if (!deleted) {
        throw { name: "NotFound", message: "User not found" };
      }

      res
        .status(200)
        .json({ message: `User with ID:${id} deleted successfully` });
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req, res, next) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
      });

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body; // Role baru

      const allowedRoles = ["admin", "customer"];
      if (!allowedRoles.includes(role)) {
        throw { name: "BadRequest", message: "Invalid role" };
      }

      const [updated] = await User.update({ role }, { where: { id } });

      if (!updated) {
        throw { name: "NotFound", message: "User not found" };
      }

      res.status(200).json({ message: `User role updated to ${role}` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
