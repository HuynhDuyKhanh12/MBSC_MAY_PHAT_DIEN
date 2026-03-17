import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function ReviewPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "userId", label: "User ID" },
    { key: "productId", label: "Product ID" },
    { key: "rating", label: "Số sao" },
    { key: "comment", label: "Bình luận" },
  ];

  const rows = [
    {
      id: 1,
      userId: 1,
      productId: 2,
      rating: 5,
      comment: "Rất tốt",
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý đánh giá"
      breadcrumb="Review"
      searchPlaceholder="Tìm kiếm đánh giá..."
      addLink="/admin/review/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}