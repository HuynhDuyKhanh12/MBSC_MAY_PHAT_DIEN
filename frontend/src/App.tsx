import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import ProductList from "./pages/ProductList/ProductList";
import Cart from "./pages/Cart/Cart";
import About from "./pages/About/About";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/Blog/BlogDetail";
import RepairRegister from "./pages/RepairRegister/RepairRegister";
import Promotions from "./pages/Promotions/Promotions";
import ProductDetail from "./pages/ProductDetail/ProductDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/san-pham/:id" element={<ProductDetail />} />
        <Route path="/" element={<Home />} />
        <Route path="/productlist" element={<ProductList />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/repair" element={<RepairRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;