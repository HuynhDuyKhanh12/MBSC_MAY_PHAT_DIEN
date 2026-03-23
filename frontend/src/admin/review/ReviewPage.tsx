import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import ReviewTable from "./ReviewTable";
import {
  getReviews,
  softDeleteReview,
  toggleReviewStatus,
} from "./reviewStorage";

export default function ReviewPage() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(0);

  const columns = [
    { key: "id", label: "#" },
    { key: "userId", label: "User ID" },
    { key: "productId", label: "Product ID" },
    { key: "rating", label: "Số sao" },
    { key: "comment", label: "Bình luận" },
  ];

  const rows = getReviews().filter((item) => !item.deleted);

  const handleToggleStatus = (id: number) => {
    toggleReviewStatus(id);
    setRefresh((prev) => prev + 1);
  };

  const handleView = (id: number) => {
    navigate(`/admin/review/view/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa đánh giá này?");
    if (!ok) return;

    softDeleteReview(id);
    setRefresh((prev) => prev + 1);
  };

  return (
    <AdminPageShell
      title="Quản lý đánh giá"
      breadcrumb="Review"
      searchPlaceholder="Tìm kiếm đánh giá..."
      addLink="/admin/review/create"
      trashLink="/admin/review/trash"
    >
      <ReviewTable
        key={refresh}
        columns={columns}
        rows={rows}
        onView={handleView}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />
    </AdminPageShell>
  );
}