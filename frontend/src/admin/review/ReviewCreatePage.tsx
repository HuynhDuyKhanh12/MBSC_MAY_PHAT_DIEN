import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addReview } from "./reviewStorage";

export default function ReviewCreatePage() {
  const navigate = useNavigate();

  const fields = [
    { name: "userId", label: "User ID", type: "number" as const },
    { name: "productId", label: "Product ID", type: "number" as const },
    { name: "rating", label: "Số sao", type: "number" as const },
    { name: "comment", label: "Bình luận", type: "textarea" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm đánh giá mới"
      breadcrumb="Thêm review"
      backLink="/admin/review"
      submitText="Lưu đánh giá"
      fields={fields}
      onSubmit={(formData: any) => {
        addReview({
          userId: Number(formData.userId || 0),
          productId: Number(formData.productId || 0),
          rating: Number(formData.rating || 0),
          comment: formData.comment || "",
          status: true,
          deleted: false,
        });

        alert("Thêm đánh giá thành công");
        navigate("/admin/review");
      }}
    />
  );
}