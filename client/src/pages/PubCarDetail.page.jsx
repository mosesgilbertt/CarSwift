import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import https from "../helpers/https";
import Swal from "sweetalert2";

export default function PubCarDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [car, setCar] = useState(null);

  useEffect(() => {
    fetchCarDetail();
  }, [id]);

  async function fetchCarDetail() {
    try {
      const response = await https({
        method: "GET",
        url: `/pub/cars/${id}`,
      });

      setCar(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  }

  if (!car) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-1 mb-5">
      <h1 className="text-center mb-4 fw-bold text-uppercase display-4 text-dark">
        {car.name}
      </h1>

      <div className="card shadow-lg border-0 rounded-4 overflow-hidden bg-light">
        <img
          src={car.image}
          className="card-img-top"
          alt={car.name}
          style={{ objectFit: "cover", height: "900px" }}
        />

        <div className="card-body text-center">
          <h2 className="card-title text-dark fw-bold">{car.name}</h2>

          <div className="d-flex justify-content-center gap-3 my-3">
            <span className="badge bg-dark px-3 py-2 rounded-pill">
              {car.brand}
            </span>
            <span className="badge bg-secondary px-3 py-2 rounded-pill">
              {car.type}
            </span>
          </div>

          <p className="text-muted fs-5">Year: {car.year}</p>

          <div className="d-flex justify-content-center">
            <span className="badge bg-success px-4 py-3 fs-4">
              Rp {car.price_per_day.toLocaleString("id-ID")}
            </span>
          </div>

          <button
            className="btn btn-outline-dark mt-4 px-5"
            onClick={() => navigate("/pub/cars")}
          >
            Back to List
          </button>
        </div>
      </div>
    </div>
  );
}
