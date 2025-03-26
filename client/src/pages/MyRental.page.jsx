import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import https from "../helpers/https";

export default function MyRentals() {
  const [rentals, setRentals] = useState([]);

  useEffect(() => {
    fetchRentals();
  }, []);

  const fetchRentals = async () => {
    try {
      const response = await https({
        method: "GET",
        url: "rentals/my-rentals",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setRentals(response.data.rentals);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Failed to fetch rentals",
      });
    }
  };

  const handleReturnCar = async (rentalId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to return this car?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, return it!",
    });

    if (result.isConfirmed) {
      try {
        await https({
          method: "PATCH",
          url: `rentals/${rentalId}/return`,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        Swal.fire("Success!", "Car returned successfully.", "success");

        fetchRentals();
      } catch (error) {
        Swal.fire(
          "Error!",
          error.response?.data?.message || "Failed to return car",
          "error"
        );
      }
    }
  };

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center mb-4">My Rental List</h2>
      <div className="row">
        {rentals.map((rental) => (
          <div key={rental.id} className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>{rental.Car.name}</h5>
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(rental.rentalDate).toLocaleString()}
              </p>
              <p>
                <strong>Return Date:</strong>{" "}
                {new Date(rental.returnDate).toLocaleString()}
              </p>
              <p>
                <strong>Status : </strong>
                {rental.status === "ongoing" ? (
                  <span className="badge bg-warning text-dark"> Ongoing </span>
                ) : (
                  <span className="badge bg-success"> Returned </span>
                )}
              </p>
              {rental.status === "ongoing" && (
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleReturnCar(rental.id)}
                >
                  Return
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
