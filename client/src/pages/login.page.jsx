import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import Swal from "sweetalert2";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await axios.post("http://localhost:3000/login", {
        email,
        password,
      });

      localStorage.setItem("access_token", data.access_token);

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
    }
  };

  return (
    <section
      className="w-100 d-flex align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="w-50 h-100 overflow-hidden">
        <img
          className="h-100 object-fit-cover"
          src="https://i.pinimg.com/736x/21/1b/52/211b52f957def0be9eefd7b6aaaeb9b5.jpg"
        />
      </div>

      <div className="w-50">
        <div className="w-50 m-auto">
          <h1 className="my-5 text-center">Car Swift</h1>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-control"
                id="exampleInputPassword1"
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
          </form>

          <p className="my-3">
            New here? <Link to="/register">Create an account!</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
