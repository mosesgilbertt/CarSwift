import { Navigate, Outlet } from "react-router";

export const PublicLayout = () => {
  const accessToken = localStorage.getItem("access_token");

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};
