import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWishlists,
  restoreWishlist,
  type WishlistItem,
} from "./wishlistStorage";

export default function WishlistTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<WishlistItem[]>([]);

  const loadTrash = () => {
    setRows(getWishlists().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreWishlist(id);
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác wishlist</h2>

      <button
        onClick={() => navigate("/admin/wishlist")}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </button>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>User ID</th>
            <th>Product ID</th>
            <th>Khôi phục</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.userId}</td>
                <td>{item.productId}</td>
                <td>
                  <button onClick={() => handleRestore(item.id)}>
                    Khôi phục
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>Không có wishlist nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}