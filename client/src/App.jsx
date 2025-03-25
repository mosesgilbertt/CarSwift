import { BrowserRouter, Routes, Route } from "react-router";
import PublicLayout from "./layouts/public.layout";
import LoginPage from "./pages/login.page";
import RegisterPage from "./pages/register.page";
import MainLayout from "./layouts/Main.layout";
import HomePage from "./pages/home.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/pub" element={<h1>Public Home Page</h1>} />
          <Route path="/pub/cars/:id" element={<h1>Public Car Detail</h1>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
