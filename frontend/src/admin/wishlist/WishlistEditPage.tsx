import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getWishlistById, updateWishlist } from "./wishlistStorage";

export default function WishlistEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const wishlist = getWishlistById(Number(id));
    if (!wishlist) return;

    setInitialValues({
      userId: wishlist.userId,
      productId: wishlist.productId,
    });
  }, [id]);

  const fields = [
    { name: "userId", label: "User ID", type: "text" as const },
    { name: "productId", label: "Product ID", type: "text" as const },
  ];

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa wishlist"
      breadcrumb="Sửa wishlist"
      backLink="/admin/wishlist"
      submitText="Cập nhật wishlist"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateWishlist(Number(id), {
          userId: Number(formData.userId || 0),
          productId: Number(formData.productId || 0),
        });

        alert("Cập nhật wishlist thành công");
        navigate("/admin/wishlist");
      }}
    />
  );
}