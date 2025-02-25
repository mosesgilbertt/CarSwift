class Controller {
  static async test(req, res) {
    res.json({ message: "Hello World!" });
  }
}

module.exports = Controller;
