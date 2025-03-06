const {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const request = require("supertest");
const app = require("../app");
const { User, Car, Rental } = require("../models");
const { queryInterface } = require("../models/index").sequelize;
const { hashPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { formatDateTime } = require("../helpers/dateFormatter");

let access_token_admin;
let access_token_user;

beforeAll(async () => {
  await queryInterface.bulkInsert("Users", [
    {
      name: "John Doe",
      email: "admin@mail.com",
      password: hashPassword("123456"),
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Jane Doe",
      email: "user@mail.com",
      password: hashPassword("123456"),
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Jumaidin",
      email: "j@mail.com",
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

  await queryInterface.bulkInsert("Rentals", [
    {
      UserId: 1,
      CarId: 1,
      rentalDate: new Date(),
      returnDate: new Date(),
      status: "ongoing",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const admin = await User.findOne({ where: { email: "admin@mail.com" } });
  access_token_admin = signToken({ id: admin.id });

  const user = await User.findOne({ where: { email: "user@mail.com" } });
  access_token_user = signToken({ id: user.id });
});

afterAll(async () => {
  await User.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Car.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });

  await Rental.destroy({
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

describe("GET /", () => {
  test("Return the correct message from the route", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Car Swift ini bosss!!!!" });
  });
});

describe("POST /register", () => {
  test("Success create a new user and return name and email", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      email: "a@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", "Anto");
    expect(response.body).toHaveProperty("email", "a@mail.com");
  });

  test("Failed create a new user with invalid email", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      email: "a",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });

  test("Failed create a new user with invalid password", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      email: "a@mail.com",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters long"
    );
  });

  test("Failed create a new user with empty name", async () => {
    const response = await request(app).post("/register").send({
      email: "a@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });

  test("Failed create a new user with empty email", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Failed create a new user with empty password", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      email: "a@mail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("Failed create a new user with empty name, email, and password", async () => {
    const response = await request(app).post("/register").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });

  test("Failed create a new user with existing email", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      email: "user@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email already exists");
  });

  test("Failed create a new user with invalid email format", async () => {
    const response = await request(app).post("/register").send({
      name: "Anto",
      email: "a",
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });
});

describe("POST /login", () => {
  test("Success login and return access_token", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  test("Failed login with wrong email", async () => {
    const response = await request(app).post("/login").send({
      email: "z@mail.com",
      password: "123456",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or Password is incorrect"
    );
  });

  test("Failed login with wrong password", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
      password: "abcdef",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Email or Password is incorrect"
    );
  });

  test("Failed login with empty email", async () => {
    const response = await request(app).post("/login").send({
      password: "123456",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and Password are required"
    );
  });

  test("Failed login with empty password", async () => {
    const response = await request(app).post("/login").send({
      email: "user@mail.com",
    });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and Password are required"
    );
  });

  test("Failed login with empty email and password", async () => {
    const response = await request(app).post("/login").send({});

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Email and Password are required"
    );
  });
});

describe("GET /pub/cars", () => {
  test("Success get all cars", async () => {
    const response = await request(app).get("/pub/cars");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("cars");
  });

  test("Success get all cars with query filter", async () => {
    const response = await request(app).get("/pub/cars?brand=Ferrari");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("cars");
  });

  test("Success get all cars with pagination", async () => {
    const response = await request(app).get("/pub/cars?limit=2&page=1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("currentPage", 1);
    expect(response.body).toHaveProperty("totalPages", 5);
    expect(response.body).toHaveProperty("totalCars", 10);
  });
});

describe("GET /pub/cars/:id", () => {
  test("Success get car by id", async () => {
    const response = await request(app).get("/pub/cars/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name", "Ferrari 488 GTB");
    expect(response.body).toHaveProperty("brand", "Ferrari");
  });

  test("Failed get car by id with invalid id", async () => {
    const response = await request(app).get("/pub/cars/100");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });
});

describe("PUT /profile", () => {
  test("Success update profile", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Anto",
        email: "user@mail.com",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Profile updated successfully"
    );
  });

  test("Failed update profile with empty token", async () => {
    const response = await request(app).put("/profile").send({
      name: "Anto",
      email: "user2@mail.com",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed update profile with invalid token", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer 123`)
      .send({
        name: "Anto",
        email: "user@mail.com",
        password: "123456",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed update profile with invalid email format", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Anto",
        email: "a",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid email format");
  });

  test("Failed update profile with invalid password", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Anto",
        email: "user@mail.com",
        password: "123",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters long"
    );
  });

  test("Failed update profile with empty name", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "",
        email: "user@mail.com",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Name is required");
  });

  test("Failed update profile with empty email", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Anto",
        email: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("Failed update profile with empty password", async () => {
    const response = await request(app)
      .put("/profile")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Anto",
        email: "user@mail.com",
        password: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Password must be at least 6 characters long"
    );
  });
});

describe("GET /admin", () => {
  test("Success Fetch All Users", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);
    expect(response.body[0]).toHaveProperty("id");
  });

  test("Failed Fetch All Users with empty token", async () => {
    const response = await request(app).get("/admin");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Fetch All Users with invalid token", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Fetch All Users with invalid role", async () => {
    const response = await request(app)
      .get("/admin")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
});

describe("DELETE /admin/:id", () => {
  test("Success Delete User", async () => {
    const response = await request(app)
      .delete("/admin/4")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User with ID:4 deleted successfully"
    );
  });

  test("Failed Delete User with empty token", async () => {
    const response = await request(app).delete("/admin/3");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Delete User with invalid token", async () => {
    const response = await request(app)
      .delete("/admin/3")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Delete User with invalid role", async () => {
    const response = await request(app)
      .delete("/admin/3")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  test("Failed Delete User with invalid id", async () => {
    const response = await request(app)
      .delete("/admin/100")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });
});

describe("PATCH /admin/:id/role", () => {
  test("Success Update User Role", async () => {
    const response = await request(app)
      .patch("/admin/3/role")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        role: "admin",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "User role with ID:3 updated to admin"
    );
  });

  test("Failed Update User Role with empty token", async () => {
    const response = await request(app).patch("/admin/2/role").send({
      role: "admin",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Update User Role with invalid token", async () => {
    const response = await request(app)
      .patch("/admin/3/role")
      .set("Authorization", `Bearer 123`)
      .send({
        role: "admin",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Update User Role with invalid role", async () => {
    const response = await request(app)
      .patch("/admin/2/role")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        role: "admin",
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  test("Failed Update User Role with invalid id", async () => {
    const response = await request(app)
      .patch("/admin/100/role")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        role: "admin",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "User not found");
  });

  test("Failed Update User Role with invalid role", async () => {
    const response = await request(app)
      .patch("/admin/2/role")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        role: "adminn",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Invalid role");
  });
});

describe("GET /cars", () => {
  test("Success Fetch All Cars", async () => {
    const response = await request(app)
      .get("/cars")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name", expect.any(String));
  });

  test("Success Fetch All Cars with Filter By Brand Toyota", async () => {
    const response = await request(app)
      .get("/cars?brand=Toyota")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("brand", "Toyota");
  });

  test("Success Fetch All Cars with with Sort by Price DESC", async () => {
    const response = await request(app)
      .get("/cars?sort=price_desc")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty(
      "price_per_day",
      expect.any(Number)
    );
  });

  test("Failed Fetch All Cars with empty token", async () => {
    const response = await request(app).get("/cars");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Fetch All Cars with Invalid Token", async () => {
    const response = await request(app)
      .get("/cars")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });
});

describe("GET /cars/:id", () => {
  test("Success Fetch Car by ID", async () => {
    const response = await request(app)
      .get("/cars/1")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", expect.any(String));
  });

  test("Failed Fetch Car by ID with Empty Token", async () => {
    const response = await request(app).get("/cars/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Fetch Car by ID with Invalid Token", async () => {
    const response = await request(app)
      .get("/cars/1")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Fetch Car by ID with Invalid ID", async () => {
    const response = await request(app)
      .get("/cars/100")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });

  test("Failed Fetch Car by ID with Invalid ID", async () => {
    const response = await request(app)
      .get("/cars/100")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });
});

describe("POST /cars", () => {
  test("Success Create Car", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name", expect.any(String));
  });

  test("Failed Create Car with Empty Token", async () => {
    const response = await request(app).post("/cars").send({
      name: "Car Test",
      brand: "Toyota",
      year: 2024,
      type: "SUV",
      price_per_day: 100000,
      image: "https://example.com/car.jpg",
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Create Car with Invalid Token", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer 123`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Create Car with User Role", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  test("Failed Create Car with Invalid Name", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        brand: "Toyota",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Name of The Car is required"
    );
  });

  test("Failed Create Car with Invalid Brand", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Brand of The Car is required"
    );
  });

  test("Failed Create Car with Invalid Year", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Year of The Car is required"
    );
  });

  test("Failed Create Car with Invalid Type", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        year: 2024,
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Type of The Car is required"
    );
  });

  test("Failed Create Car with Invalid Price Per Day", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        year: 2024,
        type: "SUV",
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Price of The Car is required"
    );
  });

  test("Failed Create Car with Invalid Image", async () => {
    const response = await request(app)
      .post("/cars")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        brand: "Toyota",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Image of The Car is required"
    );
  });
});

describe("PUT /cars/:id", () => {
  test("Success Edit Car By ID", async () => {
    const response = await request(app)
      .put("/cars/4")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Car Test",
        brand: "Honda",
        year: 2024,
        type: "SUV",
        price_per_day: 100000,
        image: "https://example.com/car.jpg",
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Car with ID:4 updated successfully"
    );
  });

  test("Failed Edit Car By ID with Empty Token", async () => {
    const response = await request(app).put("/cars/1").send({
      name: "Ferrari 488 GTB",
      brand: "Ferrari",
      year: 2020,
      type: "Coupe",
      image:
        "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
      price_per_day: 15000000,
    });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Edit Car By ID with Invalid Token", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer 123`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Edit Car By ID with User Role", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  test("Failed Edit Car By ID with Invalid ID", async () => {
    const response = await request(app)
      .put("/cars/100")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });

  test("Failed Edit Car By ID with Invalid Name", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Name of The Car is required"
    );
  });

  test("Failed Edit Car By ID with Invalid Brand", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Brand of The Car is required"
    );
  });

  test("Failed Edit Car By ID with Invalid Year", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Year of The Car is required"
    );
  });

  test("Failed Edit Car By ID with Invalid Type", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Type of The Car is required"
    );
  });

  test("Failed Edit Car By ID with Invalid Image", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Image of The Car is required"
    );
  });

  test("Failed Edit Car By ID with Invalid Price Per Day", async () => {
    const response = await request(app)
      .put("/cars/1")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Price per Day of The Car is required"
    );
  });

  test("Failed Edit Car By ID with Invalid ID", async () => {
    const response = await request(app)
      .put("/cars/100")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        name: "Ferrari 488 GTB",
        brand: "Ferrari",
        year: 2020,
        type: "Coupe",
        image:
          "https://i.pinimg.com/736x/f1/6f/25/f16f2598507bcecd8f76832080bee4c6.jpg",
        price_per_day: 15000000,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });
});

describe("Delete /cars/:id", () => {
  test("Success Delete Car By ID", async () => {
    const response = await request(app)
      .delete("/cars/11")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Car Test deleted successfully"
    );
  });

  test("Failed Delete Car By ID with Empty Token", async () => {
    const response = await request(app).delete("/cars/1");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Delete Car By ID with Invalid Token", async () => {
    const response = await request(app)
      .delete("/cars/1")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Delete Car By ID with User Role", async () => {
    const response = await request(app)
      .delete("/cars/1")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });

  test("Failed Delete Car By ID with Invalid ID", async () => {
    const response = await request(app)
      .delete("/cars/100")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });
});

describe("POST /rentals", () => {
  test("Success Book Car By Car ID", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        CarId: 3,
        rentalDate: "2025-04-20",
        returnDate: "2025-04-22",
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Car with ID:3 booked successfully"
    );
  });

  test("Failed Book Car By Car ID with Empty Token", async () => {
    const response = await request(app).post("/rentals");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Book Car By Car ID with Invalid Token", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer 123`)
      .send({
        CarId: 3,
        rentalDate: "2025-04-20",
        returnDate: "2025-04-22",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Book Car By Car ID with Invalid User ID", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer 123`)
      .send({
        CarId: 3,
        rentalDate: "2025-04-20",
        returnDate: "2025-04-22",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Book Car By Car ID with Invalid Car ID", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        CarId: 100,
        rentalDate: "2025-04-20",
        returnDate: "2025-04-22",
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Car not found");
  });

  test("Failed Book Car By Car ID with Invalid Car ID", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        rentalDate: "2025-04-20",
        returnDate: "2025-04-20",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Car is required");
  });

  test("Failed Book Car By Car ID with Invalid Rental Date", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        CarId: 7,
        returnDate: "2025-04-20",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Rental date is required");
  });

  test("Failed Book Car By Car ID with Invalid Return Date", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        CarId: 7,
        rentalDate: "2025-04-20",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Return date is required");
  });

  test("Failed Book Car By Car ID with Invalid Rental Date", async () => {
    const response = await request(app)
      .post("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`)
      .send({
        CarId: 7,
        rentalDate: "2025-04-20",
        returnDate: "2025-04-19",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Return date must be after rental date"
    );
  });
});

describe("GET /rentals", () => {
  test("Success Get All Rentals", async () => {
    const response = await request(app)
      .get("/rentals")
      .set("Authorization", `Bearer ${access_token_admin}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("rentals", expect.any(Array));
  });

  test("Failed Get All Rentals with Empty Token", async () => {
    const response = await request(app).get("/rentals");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Get All Rentals with Invalid Token", async () => {
    const response = await request(app)
      .get("/rentals")
      .set("Authorization", `Bearer 123`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid or Expired token");
  });

  test("Failed Get All Rentals with User Role", async () => {
    const response = await request(app)
      .get("/rentals")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("message", "You are not authorized");
  });
});

describe("PATCH /rentals/:id/return", () => {
  test("Success Update Status Rental By ID", async () => {
    const response = await request(app)
      .patch("/rentals/1/return")
      .set("Authorization", `Bearer ${access_token_admin}`)
      .send({
        status: "returned",
      });

    console.log(response.body, ">> response.body");

    // const returnDate = formatDateTime(response.body.returnDate);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});

describe("GET /rentals/my-rentals", () => {
  test("Success Get User Rental", async () => {
    const response = await request(app)
      .get("/rentals/my-rentals")
      .set("Authorization", `Bearer ${access_token_user}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("rentals", expect.any(Array));
  });
});

describe("formatDateTime", () => {
  test("formats a valid date correctly", () => {
    const formatted = formatDateTime("2025-02-28T07:01:00Z");

    expect(formatted).toBe("28/02/2025, 14.01"); // Sesuaikan format kalau beda
  });

  test("returns 'Invalid Date' for an invalid date", () => {
    const formatted = formatDateTime("invalid-date");

    expect(formatted).toBe("Invalid Date");
  });

  test("handles empty input gracefully", () => {
    const formatted = formatDateTime();

    expect(formatted).toBe("Invalid Date");
  });
});
