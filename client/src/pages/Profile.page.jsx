import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import https from "../helpers/https";
import Swal from "sweetalert2";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");

  useEffect(() => {
    fetchProfileUser();
  }, []);

  async function fetchProfileUser() {
    try {
      const response = await https({
        method: "GET",
        url: "/profile",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.log(error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  }

  return (
    <div className="container mt-5 pt-5">
      <div className="row">
        <div>
          <div className="card shadow-lg p-4">
            <div className="card-body text-center">
              <img
                src={
                  user.profilePicture ||
                  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000"
                }
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "100px", height: "100px" }}
              />
              <h3>{user.name}</h3>

              <p className="text-muted">{user.email}</p>

              <p className="fw-bold">Role : {user.role}</p>

              <button
                className="btn btn-outline-dark mt-3"
                onClick={() => navigate("/profile/update")}
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
