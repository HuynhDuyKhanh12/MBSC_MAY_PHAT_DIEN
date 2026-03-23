import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getWishlists,
  softDeleteWishlist,
  toggleWishlistStatus,
  type WishlistItem,
} from "./wishlistStorage";

export default function WishlistPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<WishlistItem[]>([]);

  const columns = [
    { key: "id", label: "#" },
    { key: "userId", label: "User ID" },
    { key: "productId", label: "Product ID" },
    { key: "realId", label: "ID" },
  ];

  const loadWishlists = () => {
    const data = getWishlists().filter((item) => !item.deleted);
    setRows(data);
  };

  useEffect(() => {
    loadWishlists();
  }, []);

  const handleView = (id: number) => {
    navigate(`/admin/wishlist/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/wishlist/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa wishlist này?");
    if (!ok) return;

    softDeleteWishlist(id);
    loadWishlists();
  };

  const handleToggleStatus = (id: number) => {
    toggleWishlistStatus(id);
    loadWishlists();
  };

  return (
    <AdminPageShell
      title="Quản lý yêu thích"
      breadcrumb="Wishlist"
      searchPlaceholder="Tìm kiếm wishlist..."
      addLink="/admin/wishlist/create"
    >
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/wishlist/trash")}>
          Thùng rác
        </button>
      </div>

      <AdminTable
        columns={columns}
        rows={rows}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </AdminPageShell>
  );
}