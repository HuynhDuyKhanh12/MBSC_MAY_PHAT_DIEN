import { useNavigate, useParams } from "react-router-dom";
import { getReviewById } from "./reviewStorage";

export default function ReviewViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const review = getReviewById(Number(id));

  if (!review) {
    return <div style={{ padding: 20 }}>Không tìm thấy đánh giá</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết đánh giá</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <p><b>ID đánh giá:</b> {review.id}</p>
          <p><b>User ID:</b> {review.userId}</p>
          <p><b>Product ID:</b> {review.productId}</p>
          <p><b>Số sao:</b> {review.rating}</p>
          <p><b>Bình luận:</b> {review.comment || "Không có bình luận"}</p>
          <p><b>Trạng thái:</b> {review.status ? "Hiển thị" : "Ẩn"}</p>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/review")}>
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}