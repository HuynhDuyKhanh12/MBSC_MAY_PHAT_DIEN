import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  forceDeleteCategoryApi,
  getTrashCategoriesApi,
  restoreCategoryApi,
} from "../../../api/modules/categoryApi";

type CategoryItem = {
  id: number;
  name: string;
  image?: string;
  imageUrl?: string;
  description?: string;
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

export default function CategoryTrashPage() {
  const [trash, setTrash] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadTrash = async () => {
    try {
      setLoading(true);
      const data = await getTrashCategoriesApi();
      console.log("TRASH CATEGORIES DATA:", data);
      setTrash(normalizeArrayResponse(data));
    } catch (error: any) {
      console.error("LOAD TRASH CATEGORIES ERROR:", error?.response?.data || error);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Lỗi tải thùng rác"
      );
      setTrash([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = async (id: number) => {
    try {
      await restoreCategoryApi(id);
      alert("Khôi phục danh mục thành công");
      await loadTrash();
    } catch (error: any) {
      alert(error?.response?.data?.message || error?.message || "Khôi phục thất bại");
    }
  };

  const handleForceDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn danh mục này?");
    if (!ok) return;

    try {
      await forceDeleteCategoryApi(id);
      alert("Xóa vĩnh viễn thành công");
      await loadTrash();
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Xóa vĩnh viễn thất bại"
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
        <h2 style={{ margin: 0 }}>Thùng rác Danh mục</h2>

        <Link to="/admin/categories">
          <button
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #d1d5db",
              background: "#fff",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Quay lại danh sách
          </button>
        </Link>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflowX: "auto",
        }}
      >
        {loading ? (
          <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
        ) : (
          <table
            style={{
              width: "100%",
              minWidth: 950,
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Tên</th>
                <th style={thStyle}>Hình ảnh</th>
                <th style={thStyle}>Link file</th>
                <th style={thStyle}>Mô tả</th>
                <th style={thStyle}>Hành động</th>
              </tr>
            </thead>

            <tbody>
              {trash.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 20 }}>
                    Thùng rác trống
                  </td>
                </tr>
              ) : (
                trash.map((item) => {
                  const imageSrc = getImageSrc(item.image, item.imageUrl);

                  return (
                    <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9" }}>
                      <td style={tdStyle}>{item.id}</td>
                      <td style={tdStyle}>{item.name}</td>
                      <td style={tdStyle}>
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            borderRadius: 10,
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
                              alt={item.name}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                              }}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span style={{ fontSize: 12, color: "#9ca3af" }}>
                              Không có
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
                        {item.description || "Không có mô tả"}
                      </td>

                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button
                            type="button"
                            onClick={() => handleRestore(item.id)}
                            style={restoreBtnStyle}
                          >
                            Khôi phục
                          </button>

                          <button
                            type="button"
                            onClick={() => handleForceDelete(item.id)}
                            style={forceDeleteBtnStyle}
                          >
                            Xóa vĩnh viễn
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

const restoreBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#16a34a",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};

const forceDeleteBtnStyle: React.CSSProperties = {
  padding: "8px 14px",
  borderRadius: 8,
  border: "none",
  background: "#dc2626",
  color: "#fff",
  fontWeight: 600,
  cursor: "pointer",
};