import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteBrandApi,
  getBrandsApi,
  toggleBrandVisibilityApi,
} from "../../../api/modules/brandApi";

type BrandItem = {
  id: number;
  name: string;
  slug?: string;
  logo?: string;
  logoUrl?: string;
  description?: string;
  isVisible?: boolean;
};

function getImageSrc(logo?: string, logoUrl?: string) {
  const raw = logoUrl || logo;
  if (!raw || !String(raw).trim()) return "";

  const value = String(raw).trim();

  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;

  if (value.startsWith("/uploads/")) {
    return `http://localhost:5000${value}`;
  }

  if (value.startsWith("uploads/")) {
    return `http://localhost:5000/${value}`;
  }

  if (value.startsWith("/")) {
    return `http://localhost:5000${value}`;
  }

  return `http://localhost:5000/uploads/${value}`;
}

export default function BrandListPage() {
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const data = await getBrandsApi();

      console.log("BRANDS DATA:", data);

      setBrands(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("LOAD BRANDS ERROR:", error?.response?.data || error);
      alert(error?.response?.data?.message || error?.message || "Lỗi tải brand");
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa brand này?");
    if (!ok) return;

    try {
      await deleteBrandApi(id);
      alert("Xóa brand thành công");
      await loadBrands();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Xóa thất bại");
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      await toggleBrandVisibilityApi(id);
      alert("Đổi trạng thái hiển thị thành công");
      await loadBrands();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Ẩn / hiện thất bại, vui lòng đăng nhập lại"
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
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>Quản lý Brand</h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/brands/create">
            <button
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "none",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Thêm brand
            </button>
          </Link>

          <Link to="/admin/brands/trash">
            <button
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                color: "#111827",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Thùng rác
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflowX: "auto",
          boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        {loading ? (
          <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: 1100,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Tên brand</th>
                <th style={thStyle}>Hình ảnh</th>
                <th style={thStyle}>Link file</th>
                <th style={thStyle}>Mô tả</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {brands.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "#6b7280",
                    }}
                  >
                    Không có brand nào
                  </td>
                </tr>
              ) : (
                brands.map((item, index) => {
                  const imageSrc = getImageSrc(item.logo, item.logoUrl);

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
                        <div style={{ fontWeight: 600, color: "#111827" }}>
                          {item.name || "Không có tên"}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            width: 72,
                            height: 72,
                            borderRadius: 12,
                            overflow: "hidden",
                            border: "1px solid #e5e7eb",
                            background: "#f9fafb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={item.name || "brand"}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector(".fallback-text")) {
                                  const span = document.createElement("span");
                                  span.className = "fallback-text";
                                  span.innerText = "No image";
                                  span.style.fontSize = "12px";
                                  span.style.color = "#9ca3af";
                                  parent.appendChild(span);
                                }
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>
                              No image
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        {imageSrc ? (
                          <a
                            href={imageSrc}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              color: "#2563eb",
                              fontWeight: 600,
                              textDecoration: "none",
                              wordBreak: "break-all",
                            }}
                          >
                            Mở file ảnh
                          </a>
                        ) : (
                          <span style={{ color: "#9ca3af" }}>Không có link</span>
                        )}
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            maxWidth: 320,
                            color: "#374151",
                            lineHeight: 1.5,
                            wordBreak: "break-word",
                          }}
                          title={item.description || ""}
                        >
                          {item.description || "Không có mô tả"}
                        </div>
                      </td>

                      <td style={tdStyle}>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            borderRadius: 999,
                            fontSize: 13,
                            fontWeight: 600,
                            background: item.isVisible ? "#dcfce7" : "#fee2e2",
                            color: item.isVisible ? "#166534" : "#991b1b",
                          }}
                        >
                          {item.isVisible ? "Hiển thị" : "Đang ẩn"}
                        </span>
                      </td>

                      <td style={tdStyle}>
                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          <Link to={`/admin/brands/edit/${item.id}`}>
                            <button style={editBtnStyle}>Sửa</button>
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            style={deleteBtnStyle}
                          >
                            Xóa
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleVisibility(item.id)}
                            style={toggleBtnStyle}
                          >
                            {item.isVisible ? "Ẩn" : "Hiện"}
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

const toggleBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};