import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addWishlist } from "./wishlistStorage";

export default function WishlistCreatePage() {
  const navigate = useNavigate();

  const fields = [
    { name: "userId", label: "User ID", type: "text" as const },
    { name: "productId", label: "Product ID", type: "text" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm wishlist mới"
      breadcrumb="Thêm wishlist"
      backLink="/admin/wishlist"
      submitText="Lưu wishlist"
      fields={fields}
      onSubmit={(formData: any) => {
        addWishlist({
          userId: Number(formData.userId || 0),
          productId: Number(formData.productId || 0),
          status: true,
          deleted: false,
        });

        alert("Thêm wishlist thành công");
        navigate("/admin/wishlist");
      }}
    />
  );
}