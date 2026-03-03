import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList/ProductList";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}