import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import https from "../helpers/https";
import Swal from "sweetalert2";

export default function MainHomePage() {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [orderBy, setOrderBy] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState("");

  const typeOptions = [
    "Coupe",
    "Sedan",
    "SUV",
    "Hatchback",
    "Convertible",
    "Pickup",
    "Minivan",
    "Hypercar",
    "Electric",
    "Luxury",
    "Supercar",
    "Sports",
    "Muscle",
    "Luxury SUV",
  ];
  const brandOptions = [
    "Ferrari",
    "Toyota",
    "Honda",
    "BMW",
    "Ford",
    "Bugatti",
    "Tesla",
    "Rolls-Royce",
    "Lamborghini",
    "Mercedes-Benz",
    "Porsche",
    "Chevrolet",
    "Jeep",
    "Nissan",
    "Audi",
    "Hyundai",
    "Mazda",
    "Lexus",
    "Kia",
    "Volkswagen",
    "Subaru",
    "Dodge",
    "Jaguar",
    "Mitsubishi",
    "Peugeot",
    "Suzuki",
  ];
  const sortOptions = ["name", "brand", "year", "price_per_day"];
  const orderOptions = ["asc", "desc"];

  useEffect(() => {
    fetchCars();
  }, [search, type, brand, minPrice, maxPrice, sortBy, orderBy, page]);

  const fetchCars = async () => {
    try {
      const response = await https({
        method: "GET",
        url: "/pub/cars",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        params: {
          search,
          type,
          brand,
          minPrice,
          maxPrice,
          sortBy,
          orderBy,
          page,
          limit: 6,
        },
      });

      setCars(response.data.cars);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <section className="container mt-1">
      <h1 className="text-center mb-4 fw-bold text text-uppercase display-4">
        Car List
      </h1>

      <div className="row mb-3">
        <div className="col-12 mb-2">
          <input
            type="text"
            placeholder="Search"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="">Select Brand</option>
            {brandOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="number"
            placeholder="Max Price"
            className="form-control"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            type="number"
            placeholder="Min Price"
            className="form-control"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value)}
          >
            {orderOptions.map((option) => (
              <option key={option} value={option}>
                {option === "asc" ? "Ascending" : "Descending"}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        {cars.map((car) => (
          <div className="col-md-4 mb-4" key={car.id}>
            <div
              className="card shadow text-black h-100 d-flex flex-column border-light rounded-4 overflow-hidden"
              style={{ transition: "transform 0.3s ease-in-out" }}
            >
              <img
                src={car.image}
                className="card-img-top"
                alt={car.name}
                style={{ objectFit: "cover", height: "400px" }}
              />
              <div className="card-body d-flex flex-column flex-grow-1 text-center">
                <h5 className="card-title fw-bold">{car.name}</h5>

                <div className="d-flex justify-content-center gap-5 mb-3">
                  <span className="badge bg-secondary px-3 py-2 rounded-pill fs-7">
                    {car.type}
                  </span>
                  <span className="badge bg-dark px-3 py-2 rounded-pill fs-7">
                    {car.brand}
                  </span>
                </div>

                <div className="d-flex justify-content-center mb-2">
                  <span
                    className="badge bg-success px-1 py-2 rounded-pill fs-4"
                    style={{ width: "75%" }}
                  >
                    Rp {car.price_per_day.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/rentals/" + car.id)}
                  className="btn btn-outline-dark mt-auto"
                >
                  Rent
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center mb-3 mt-4 gap-3">
        <button
          className="btn btn-outline-dark prev-btn d-flex align-items-center gap-2"
          disabled={page <= 1 || totalPages === 0}
          onClick={() => setPage(page - 1)}
        >
          <i className="fas fa-arrow-left"></i> Previous
        </button>

        <span className="page-indicator mt-1">
          Page {page} of {totalPages}
        </span>

        <button
          className="btn btn-outline-dark next-btn d-flex align-items-center gap-2"
          disabled={page >= totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </section>
  );
}
