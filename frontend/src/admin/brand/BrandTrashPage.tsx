import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBrands,
  restoreBrand,
  deleteBrandForever,
  clearBrandTrash,
  type BrandItem,
} from "./brandStorage";

export default function BrandTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<BrandItem[]>([]);

  const loadTrash = () => {
    setRows(getBrands().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreBrand(id);
    loadTrash();
  };

  const handleDeleteForever = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn thương hiệu này?");
    if (!ok) return;
    deleteBrandForever(id);
    loadTrash();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa toàn bộ thương hiệu trong thùng rác?");
    if (!ok) return;
    clearBrandTrash();
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác thương hiệu</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/brand")}>
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
            <th>Tên thương hiệu</th>
            <th>Slug</th>
            <th>Khôi phục</th>
            <th>Xóa khỏi thùng rác</th>
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
                <td>{item.slug}</td>
                <td>
                  <button onClick={() => handleRestore(item.id)}>
                    Khôi phục
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDeleteForever(item.id)}
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
              <td colSpan={6}>Không có thương hiệu nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}