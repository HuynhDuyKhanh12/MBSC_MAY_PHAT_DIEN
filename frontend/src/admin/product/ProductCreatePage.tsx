import AdminCreatePage from "../shared/AdminCreatePage";

export default function ProductCreatePage() {
  const fields = [
    { name: "name", label: "Tên sản phẩm", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "price", label: "Giá", type: "number" as const },
    { name: "salePrice", label: "Giá khuyến mãi", type: "number" as const },
    { name: "stock", label: "Số lượng", type: "number" as const },
    { name: "category", label: "Danh mục", type: "select" as const, options: ["Khai vị", "Món chính"] },
    { name: "brand", label: "Thương hiệu", type: "select" as const, options: ["Món Việt", "Món Âu"] },
    { name: "description", label: "Mô tả", type: "textarea" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm sản phẩm mới"
      breadcrumb="Thêm sản phẩm"
      backLink="/admin/product"
      submitText="Lưu sản phẩm"
      fields={fields}
    />
  );
}