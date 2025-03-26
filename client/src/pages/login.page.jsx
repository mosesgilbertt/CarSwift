import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import https from "../helpers/https";
import DisplayPictureForm from "../components/DisplayPicture.form";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await https({
        method: "POST",
        url: "/login",
        data: { email, password },
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

  async function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    try {
      const { data } = await https({
        method: "POST",
        url: "/google-login",
        data: { googleToken: response.credential },
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
  }

  useEffect(() => {
    if (localStorage.getItem("access_token")) {
      navigate("/");
    }

    google.accounts.id.initialize({
      client_id:
        "742661070073-csof70ph3l2vctkqu7c9i6iss1tgdqhr.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });

    google.accounts.id.renderButton(document.getElementById("google-btn"), {
      theme: "outline",
      size: "large",
    });

    google.accounts.id.prompt();
  }, []);

  return (
    <section className="d-flex align-items-center vh-100 bg-light">
      <div className="container">
        <div className="row justify-content-center shadow-lg rounded overflow-hidden bg-white">
          <DisplayPictureForm />

          <div className="col-md-6 p-5 d-flex flex-column justify-content-center">
            <h2 className="text-center mb-4 fw-bold text text-uppercase display-4">
              Car Swift
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="fw-semibold">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                />
              </div>

              <button
                type="submit"
                className="btn btn-lg btn-primary rounded-pill w-100 p-2"
              >
                Login
              </button>
            </form>

            <div className="text-center fw-bold my-3">OR</div>
            <div
              id="google-btn"
              className="d-flex justify-content-center mb-3"
            ></div>

            <p className="text-center">
              New here?{" "}
              <Link to="/register" className="text-primary">
                Create an account!
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
