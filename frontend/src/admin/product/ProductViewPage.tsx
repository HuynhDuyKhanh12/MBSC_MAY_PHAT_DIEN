import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "./productStorage";

export default function ProductViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = getProductById(Number(id));

  if (!product) {
    return <div style={{ padding: 20 }}>Không tìm thấy sản phẩm</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết sản phẩm</h2>

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
            src={product.image}
            alt={product.name}
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
          <p><b>Tên sản phẩm:</b> {product.name}</p>
          <p><b>Danh mục:</b> {product.category}</p>
          <p><b>Thương hiệu:</b> {product.brand}</p>
          <p><b>Giá gốc:</b> {product.price}</p>
          <p><b>Giá khuyến mãi:</b> {product.salePrice}</p>
          <p><b>Số lượng:</b> {product.stock}</p>
          <p><b>Kiểu:</b> {product.type || "Không có"}</p>
          <p><b>ID:</b> {product.realId}</p>
          <p><b>Trạng thái:</b> {product.status ? "Hiển thị" : "Ẩn"}</p>
          <p><b>Mô tả:</b> {product.description || "Không có mô tả"}</p>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/product")}>Quay lại</button>
            <button onClick={() => navigate(`/admin/product/edit/${product.id}`)}>
              Sửa sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}