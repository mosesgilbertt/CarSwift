import { Outlet, Navigate } from "react-router";
import MainNavbar from "../components/Navbar.main";

export default function MainLayout() {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <MainNavbar />

      <Outlet />
    </>
  );
}
