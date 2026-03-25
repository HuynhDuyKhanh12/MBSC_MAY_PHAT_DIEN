import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProducts,
  restoreProduct,
  deleteProductForever,
  clearProductTrash,
  type ProductItem,
} from "./productStorage";

export default function ProductTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProductItem[]>([]);

  const loadTrash = () => {
    setRows(getProducts().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (realId: number) => {
    restoreProduct(realId);
    loadTrash();
  };

  const handleDeleteForever = (realId: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn sản phẩm này?");
    if (!ok) return;
    deleteProductForever(realId);
    loadTrash();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong thùng rác?");
    if (!ok) return;
    clearProductTrash();
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác sản phẩm</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/product")}>
          Quay lại
        </button>

        <button
          onClick={handleClearTrash}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Xóa tất cả thùng rác
        </button>
      </div>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Hình</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Thương hiệu</th>
            <th>Khôi phục</th>
            <th>Xóa khỏi thùng rác</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.realId}>
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
                  <button onClick={() => handleRestore(item.realId)}>
                    Khôi phục
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteForever(item.realId)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Không có sản phẩm nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}