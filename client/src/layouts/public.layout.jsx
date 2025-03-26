import { Navigate, Outlet } from "react-router";
import PubNavbar from "../components/Navbar.pub";

export default function PublicLayout() {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <PubNavbar />

      <Outlet />
    </>
  );
}
