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
        <NavLink
          className="navbar-brand fw-bold fs-3 text-white"
          to="/admin/cars"
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

            <li className="nav-item">
              <button
                className="btn btn-outline-danger fw-bold px-3"
                onClick={handleLogout}
              >
                Logout
              </button>
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
