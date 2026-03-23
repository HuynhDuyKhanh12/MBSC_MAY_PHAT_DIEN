import { useNavigate, useParams } from "react-router-dom";
import { getBrandById } from "./brandStorage";

export default function BrandViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const brand = getBrandById(Number(id));

  if (!brand) {
    return <div style={{ padding: 20 }}>Không tìm thấy thương hiệu</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết thương hiệu</h2>

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
            src={brand.image}
            alt={brand.name}
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
          <p><b>Tên thương hiệu:</b> {brand.name}</p>
          <p><b>Slug:</b> {brand.slug}</p>
          <p><b>Mô tả:</b> {brand.description || "Không có mô tả"}</p>
          <p><b>ID:</b> {brand.realId}</p>
          <p><b>Trạng thái:</b> {brand.status ? "Hiển thị" : "Ẩn"}</p>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/brand")}>
              Quay lại
            </button>

            <button onClick={() => navigate(`/admin/brand/edit/${brand.id}`)}>
              Sửa thương hiệu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}