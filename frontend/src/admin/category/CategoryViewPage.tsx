import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById } from "./categoryStorage";

export default function CategoryViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const category = getCategoryById(Number(id));

  if (!category) {
    return <div style={{ padding: 20 }}>Không tìm thấy danh mục</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết danh mục</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 24,
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <img
            src={category.image}
            alt={category.name}
            style={{
              width: "100%",
              maxWidth: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        </div>

        <div>
          <p><b>Tên danh mục:</b> {category.name}</p>
          <p><b>Slug:</b> {category.slug}</p>
          <p><b>Mô tả:</b> {category.description || "Không có mô tả"}</p>
          <p><b>ID:</b> {category.realId}</p>
          <p><b>Trạng thái:</b> {category.status ? "Hiển thị" : "Ẩn"}</p>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/category")}>
              Quay lại
            </button>

            <button onClick={() => navigate(`/admin/category/edit/${category.id}`)}>
              Sửa danh mục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}