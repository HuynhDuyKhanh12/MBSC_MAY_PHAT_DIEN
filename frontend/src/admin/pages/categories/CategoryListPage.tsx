import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteCategoryApi,
  getCategoriesApi,
  toggleCategoryVisibilityApi,
} from "../../../api/modules/categoryApi";

type CategoryItem = {
  id: number;
  name: string;
  slug?: string;
  image?: string;
  imageUrl?: string;
  description?: string;
  isVisible?: boolean;
};

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function getImageSrc(image?: string, imageUrl?: string) {
  const raw = imageUrl || image;
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

export default function CategoryListPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getCategoriesApi();
      console.log("CATEGORIES DATA:", data);
      setCategories(normalizeArrayResponse(data));
    } catch (error: any) {
      console.error("LOAD CATEGORIES ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải danh mục"
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa danh mục này?");
    if (!ok) return;

    try {
      await deleteCategoryApi(id);
      alert("Xóa danh mục thành công");
      await loadCategories();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Xóa thất bại");
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      await toggleCategoryVisibilityApi(id);
      alert("Đổi trạng thái hiển thị thành công");
      await loadCategories();
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
        <h2 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
          Quản lý Danh mục
        </h2>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link to="/admin/categories/create">
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
              + Thêm danh mục
            </button>
          </Link>

          <Link to="/admin/categories/trash">
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
                <th style={thStyle}>Tên danh mục</th>
                <th style={thStyle}>Hình ảnh</th>
                <th style={thStyle}>Link file</th>
                <th style={thStyle}>Mô tả</th>
                <th style={thStyle}>Trạng thái</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      padding: 24,
                      color: "#6b7280",
                    }}
                  >
                    Không có danh mục nào
                  </td>
                </tr>
              ) : (
                categories.map((item, index) => {
                  const imageSrc = getImageSrc(item.image, item.imageUrl);

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
                              alt={item.name || "category"}
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
                          <Link to={`/admin/categories/edit/${item.id}`}>
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