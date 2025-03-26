import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";

export default function MainNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-dark shadow-lg fixed-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold fs-3 text-white" to="/">
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
              <NavLink className="nav-link text-white fw-bold px-3" to="/">
                Home
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link text-white fw-bold px-3"
                to="/my-rentals"
              >
                My Rentals
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                role="button"
                data-bs-toggle="dropdown"
              >
                <img
                  className="rounded-circle"
                  src="https://i.pinimg.com/736x/76/05/0c/76050c7dc0c0727c56e5431dfb1dd143.jpg"
                  alt="profile"
                  style={{
                    width: "2.1rem",
                    height: "2.1rem",
                    border: "2px solid white",
                  }}
                />
              </a>

              <ul
                className={
                  "dropdown-menu dropdown-menu-end bg-dark border-0 shadow-lg"
                }
              >
                <li>
                  <NavLink
                    className="dropdown-item text-light fw-bold"
                    to="/profile"
                  >
                    Profile
                  </NavLink>
                </li>
                <li>
                  <hr className="dropdown-divider bg-secondary" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger fw-bold"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>

      <style>
        {`
        .dropdown-menu {
          min-width: 8rem;
          text-align: center;
        }
        .dropdown-item {
          transition: all 0.3s ease-in-out;
        }
        .dropdown-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
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
