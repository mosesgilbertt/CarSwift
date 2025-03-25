const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const FormData = require("form-data");
const { comparePassword, hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { User } = require("../models");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const imggbb_api_key = process.env.IMGBB_API_KEY;

class UserController {
  static async register(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const profilePicture = req.file;

      const tempUser = User.build({ name, email, password });
      await tempUser.validate(); // Memicu SequelizeValidationError jika ada yang salah

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
      Detect if this user information is fake or real:
      Name: ${name}
      Email: ${email}
      Respond with "FAKE" if the data is likely fake, otherwise respond with "REAL".
      `;

      const result = await model.generateContent(prompt);
      const geminiResponse = result.response.text().trim();

      if (geminiResponse.includes("FAKE")) {
        throw { name: "BadRequest", message: "Invalid user data" };
      }

      let profilePictureURL;
      if (profilePicture) {
        const form = new FormData();
        form.append("image", profilePicture.buffer.toString("base64"));

        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imggbb_api_key}`,
          form,
          {
            headers: form.getHeaders(),
          }
        );

        let responseData = response.data.data.url;
        profilePictureURL = responseData.replace("ibb.co/", "ibb.co.com/");
      }

      const user = await User.create({
        name,
        email,
        password,
        profilePicture: profilePictureURL,
      });

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

  static async detailProfile(req, res, next) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "NotFound", message: "User not found" };
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { name, email, password } = req.body;

      const user = await User.findByPk(userId);
      if (!user) {
        throw { name: "NotFound", message: "User not found" };
      }

      let updatedData = {};
      if (name !== undefined) updatedData.name = name;
      if (email !== undefined) updatedData.email = email;
      if (password !== undefined) {
        updatedData.password = hashPassword(password);
      }

      await user.update(updatedData);

      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAccount(req, res, next) {
    try {
      const { id } = req.user;

      const user = await User.findByPk(id);
      if (!user) {
        throw { name: "NotFound", message: "User not found" };
      }

      await user.destroy();

      res
        .status(200)
        .json({ message: `You have successfully deleted your account` });
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

      res
        .status(200)
        .json({ message: `User role with ID:${id} updated to ${role}` });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
