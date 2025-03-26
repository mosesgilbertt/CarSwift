import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import https from "../helpers/https";
import Swal from "sweetalert2";

export default function CarBookingForm() {
  const params = useParams();
  const navigate = useNavigate();

  const [rentalDate, setRentalDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await https({
        method: "POST",
        url: `/rentals/${params.id}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        data: { rentalDate, returnDate },
      });

      Swal.fire({
        icon: "success",
        title: "Booking Success",
        text: response.data.message,
      });

      navigate("/");
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "500px", width: "100%", marginTop: "80px" }}
      >
        <h2 className="text-center fw-bold mb-4">Book Car</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Rental Date</label>
            <input
              type="date"
              className="form-control"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Return Date</label>
            <input
              type="date"
              className="form-control"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-outline-dark w-100">
            Book Now
          </button>
        </form>
      </div>
    </div>
  );
}
