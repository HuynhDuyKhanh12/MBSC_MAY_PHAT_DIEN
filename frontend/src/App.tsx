import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductList from "./pages/ProductList/ProductList";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
      </Routes>
    </BrowserRouter>
  );
}