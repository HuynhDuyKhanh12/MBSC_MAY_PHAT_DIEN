import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}