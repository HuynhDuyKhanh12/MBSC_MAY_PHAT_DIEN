import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteProductApi,
  getProductsApi,
  toggleProductVisibilityApi,
} from "../../../api/modules/productApi";

type ProductItem = {
  id: number;
  name: string;
  sku: string;
  thumbnail?: string;
  basePrice: string | number;
  salePrice?: string | number | null;
  status: "DRAFT" | "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  brand?: { name: string };
  category?: { name: string };
  deletedAt?: string | null;
};

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function getImageSrc(image?: string) {
  if (!image || !String(image).trim()) return "";
  const value = String(image).trim();

  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `http://localhost:5000${value}`;
  if (value.startsWith("uploads/")) return `http://localhost:5000/${value}`;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;

  return `http://localhost:5000/uploads/${value}`;
}

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      const normalized = normalizeArrayResponse(data).filter(
        (item: ProductItem) => !item.deletedAt
      );
      setProducts(normalized);
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải sản phẩm"
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (!ok) return;

    try {
      const res = await deleteProductApi(id);
      alert(res?.message || "Đã chuyển vào thùng rác");
      await loadProducts();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Xóa thất bại");
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      const res = await toggleProductVisibilityApi(id);
      alert(res?.message || "Đổi trạng thái hiển thị thành công");
      await loadProducts();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Ẩn / hiện thất bại"
      );
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
          Quản lý Sản phẩm
        </h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/products/create">
            <button style={primaryBtnStyle}>+ Thêm sản phẩm</button>
          </Link>

          <Link to="/admin/products/trash">
            <button style={secondaryBtnStyle}>Thùng rác</button>
          </Link>
        </div>
      </div>

      <div style={tableWrapStyle}>
        {loading ? (
          <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Ảnh</th>
                <th style={thStyle}>Tên</th>
                <th style={thStyle}>SKU</th>
                <th style={thStyle}>Danh mục</th>
                <th style={thStyle}>Thương hiệu</th>
                <th style={thStyle}>Giá</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={9} style={emptyCellStyle}>
                    Không có sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((item, index) => {
                  const imageSrc = getImageSrc(item.thumbnail);

                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderTop: "1px solid #f1f5f9",
                        background: index % 2 === 0 ? "#ffffff" : "#fcfcfd",
                      }}
                    >
                      <td style={tdStyle}>{item.id}</td>
                      <td style={tdStyle}>
                        <div style={imageBoxStyle}>
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={item.name}
                              style={imageStyle}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>
                              No image
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>{item.sku}</td>
                      <td style={tdStyle}>{item.category?.name || "-"}</td>
                      <td style={tdStyle}>{item.brand?.name || "-"}</td>
                      <td style={tdStyle}>
                        {Number(item.basePrice).toLocaleString("vi-VN")}đ
                      </td>
                      <td style={tdStyle}>
                        <span
                          style={{
                            ...badgeStyle,
                            background:
                              item.status === "ACTIVE"
                                ? "#dcfce7"
                                : item.status === "INACTIVE"
                                ? "#fee2e2"
                                : item.status === "DRAFT"
                                ? "#fef3c7"
                                : "#e0e7ff",
                            color:
                              item.status === "ACTIVE"
                                ? "#166534"
                                : item.status === "INACTIVE"
                                ? "#991b1b"
                                : item.status === "DRAFT"
                                ? "#92400e"
                                : "#3730a3",
                          }}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <Link to={`/admin/products/edit/${item.id}`}>
                            <button style={editBtnStyle}>Sửa</button>
                          </Link>

                          <button
                            style={deleteBtnStyle}
                            onClick={() => handleDelete(item.id)}
                          >
                            Xóa
                          </button>

                          <button
                            style={statusBtnStyle}
                            onClick={() => handleToggleVisibility(item.id)}
                          >
                            {item.status === "ACTIVE" ? "Ẩn" : "Hiện"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const tableWrapStyle: React.CSSProperties = {
  background: "#fff",
  borderRadius: 16,
  border: "1px solid #e5e7eb",
  overflowX: "auto",
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  minWidth: 1200,
  borderCollapse: "collapse",
};

const thStyle: React.CSSProperties = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: 14,
  fontWeight: 700,
  color: "#111827",
  borderBottom: "1px solid #e5e7eb",
  whiteSpace: "nowrap",
};

const tdStyle: React.CSSProperties = {
  padding: "14px 16px",
  verticalAlign: "middle",
  fontSize: 14,
  color: "#111827",
};

const emptyCellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: 24,
  color: "#6b7280",
};

const badgeStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
};

const imageBoxStyle: React.CSSProperties = {
  width: 72,
  height: 72,
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid #e5e7eb",
  background: "#f9fafb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imageStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const primaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryBtnStyle: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: 10,
  border: "1px solid #d1d5db",
  background: "#fff",
  color: "#111827",
  fontWeight: 600,
  cursor: "pointer",
};

const editBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#f59e0b",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const deleteBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#ef4444",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const statusBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};