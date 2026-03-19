import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, restoreProduct, type ProductItem } from "./productStorage";

export default function ProductTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProductItem[]>([]);

  const loadTrash = () => {
    setRows(getProducts().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreProduct(id);
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác sản phẩm</h2>

      <button onClick={() => navigate("/admin/product")} style={{ marginBottom: 16 }}>
        Quay lại
      </button>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Hình</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Thương hiệu</th>
            <th>Khôi phục</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: 70, height: 70, objectFit: "cover" }}
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.brand}</td>
                <td>
                  <button onClick={() => handleRestore(item.id)}>Khôi phục</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không có sản phẩm nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}