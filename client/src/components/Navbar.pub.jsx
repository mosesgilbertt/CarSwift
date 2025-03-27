import { NavLink } from "react-router";

export default function PubNavbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark shadow-lg fixed-top">
      <div className="container">
        <NavLink
          className="navbar-brand fw-bold fs-3 text-white"
          to="/pub/cars"
        >
          🔑 CAR SWIFT
        </NavLink>

        <button
          className="navbar-toggler border-light"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                className="nav-link text-white fw-bold px-3"
                to="/pub/cars"
              >
                Car List
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link text-white fw-bold px-3"
                to="/register"
              >
                Register
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link text-white fw-bold px-3" to="/login">
                Login
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      <style>
        {`
        .navbar-nav .nav-link {
          transition: all 0.3s ease-in-out;
        }
        .navbar-nav .nav-link:hover {
          color: #999 !important;
          transform: scale(1.05);
        }
      `}
      </style>
    </nav>
  );
}
