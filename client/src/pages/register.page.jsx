import { useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import https from "../helpers/https";
import DisplayPictureForm from "../components/DisplayPicture.form";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    try {
      await https({
        method: "POST",
        url: "/register",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can log in now.",
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  return (
    <section className="d-flex align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center shadow-lg rounded overflow-hidden bg-white">
          <DisplayPictureForm />

          <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <h2 className="text-center mb-4 fw-bold text text-uppercase display-4">
              🔑 CAR SWIFT
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="fw-semibold">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="login-email" className="fw-semibold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="fw-semibold">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="profilePicture" className="fw-semibold">
                  Profile Picture
                </label>
                <input
                  type="file"
                  className="form-control"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary rounded-pill w-100 p-2"
              >
                Register
              </button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login" className="text-primary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
