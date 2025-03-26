import { BrowserRouter, Routes, Route } from "react-router";
import PublicLayout from "./layouts/Public.layout";
import MainLayout from "./layouts/Main.layout";
import RegisterPage from "./pages/register.page";
import LoginPage from "./pages/login.page";
import PubHomePage from "./pages/PubHome.page";
import PubCarDetailPage from "./pages/PubCarDetail.page";
import MainHomePage from "./pages/MainHome.page";
import CarBookingForm from "./pages/BookRental.page";
import MyRentals from "./pages/MyRental.page";

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
          <Route path="/" element={<MainHomePage />} />
          <Route path="/rentals/:id" element={<CarBookingForm />} />
          <Route path="/my-rentals" element={<MyRentals />} />
          <Route path="/profile" element={<h1>Profile</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
