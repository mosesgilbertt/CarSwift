import { BrowserRouter, Routes, Route } from "react-router";
import PublicLayout from "./layouts/Public.layout";
import MainLayout from "./layouts/Main.layout";
import HomePage from "./pages/MainHome.page";
import RegisterPage from "./pages/register.page";
import LoginPage from "./pages/login.page";
import PubHomePage from "./pages/PubHome.page";
import PubCarDetailPage from "./pages/PubCarDetail.page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/pub/cars" element={<PubHomePage />} />
          <Route path="/pub/cars/:id" element={<PubCarDetailPage />} />
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
