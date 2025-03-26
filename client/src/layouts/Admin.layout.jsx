import { Outlet, Navigate } from "react-router";

export default function AdminLayout() {
  const accessToken = localStorage.getItem("access_token");
  const role = localStorage.getItem("role");

  if (!accessToken) {
    if (role === "admin") {
      return <Navigate to="/admin/cars" />;
    }
  }

  return (
    <>
      <Outlet />
    </>
  );
}
