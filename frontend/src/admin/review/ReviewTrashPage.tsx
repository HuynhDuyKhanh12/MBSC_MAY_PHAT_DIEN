import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReviews,
  restoreReview,
  deleteReviewForever,
  clearReviewTrash,
  type ReviewItem,
} from "./reviewStorage";

export default function ReviewTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ReviewItem[]>([]);

  const loadTrash = () => {
    setRows(getReviews().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreReview(id);
    loadTrash();
  };

  const handleDeleteForever = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn đánh giá này?");
    if (!ok) return;
    deleteReviewForever(id);
    loadTrash();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa tất cả đánh giá trong thùng rác?");
    if (!ok) return;
    clearReviewTrash();
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác đánh giá</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/review")}>
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
            <th>User ID</th>
            <th>Product ID</th>
            <th>Số sao</th>
            <th>Bình luận</th>
            <th>Khôi phục</th>
            <th>Xóa khỏi thùng rác</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.userId}</td>
                <td>{item.productId}</td>
                <td>{item.rating}</td>
                <td>{item.comment}</td>
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
              <td colSpan={7}>Không có đánh giá nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}