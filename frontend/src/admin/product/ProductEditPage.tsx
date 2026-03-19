import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getProductById, updateProduct } from "./productStorage";

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const product = getProductById(Number(id));
    if (!product) return;

    setInitialValues({
      name: product.name,
      image: product.image,
      price: product.price.replace(" VND", "").replaceAll(".", ""),
      salePrice: product.salePrice.replace(" VND", "").replaceAll(".", ""),
      stock: product.stock,
      category: product.category,
      brand: product.brand,
      description: product.description || "",
      type: product.type || "",
    });
  }, [id]);

  const fields = [
    { name: "name", label: "Tên sản phẩm", type: "text" as const },
    { name: "image", label: "Hình ảnh", type: "file" as const },
    { name: "price", label: "Giá", type: "number" as const },
    { name: "salePrice", label: "Giá khuyến mãi", type: "number" as const },
    { name: "stock", label: "Số lượng", type: "number" as const },
    {
      name: "category",
      label: "Danh mục",
      type: "select" as const,
      options: ["Khai vị", "Món chính"],
    },
    {
      name: "brand",
      label: "Thương hiệu",
      type: "select" as const,
      options: ["Món Việt", "Món Âu"],
    },
    { name: "type", label: "Kiểu", type: "text" as const },
    { name: "description", label: "Mô tả", type: "textarea" as const },
  ];

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa sản phẩm"
      breadcrumb="Sửa sản phẩm"
      backLink="/admin/product"
      submitText="Cập nhật sản phẩm"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateProduct(Number(id), {
          image: formData.imagePreview || initialValues.image,
          name: formData.name || "",
          category: formData.category || "",
          brand: formData.brand || "",
          price: `${formData.price || 0} VND`,
          salePrice: `${formData.salePrice || 0} VND`,
          stock: Number(formData.stock || 0),
          type: formData.type || "",
          description: formData.description || "",
        });

        alert("Cập nhật sản phẩm thành công");
        navigate("/admin/product");
      }}
    />
  );
}