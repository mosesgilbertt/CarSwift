import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="/" element={<h1>Home Page</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
