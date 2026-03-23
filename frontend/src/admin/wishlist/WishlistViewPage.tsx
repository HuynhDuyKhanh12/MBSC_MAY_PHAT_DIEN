import { useNavigate, useParams } from "react-router-dom";
import { getWishlistById } from "./wishlistStorage";

export default function WishlistViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const wishlist = getWishlistById(Number(id));

  if (!wishlist) {
    return <div style={{ padding: 20 }}>Không tìm thấy wishlist</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết wishlist</h2>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <p>
          <b>User ID:</b> {wishlist.userId}
        </p>
        <p>
          <b>Product ID:</b> {wishlist.productId}
        </p>
        <p>
          <b>ID:</b> {wishlist.realId}
        </p>
        <p>
          <b>Trạng thái:</b> {wishlist.status ? "Hiển thị" : "Ẩn"}
        </p>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/admin/wishlist")}>Quay lại</button>
          <button
            onClick={() => navigate(`/admin/wishlist/edit/${wishlist.id}`)}
          >
            Sửa wishlist
          </button>
        </div>
      </div>
    </div>
  );
}