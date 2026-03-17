import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function ProductPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "image", label: "Hình" },
    { key: "name", label: "Tên sản phẩm" },
    { key: "category", label: "Danh mục" },
    { key: "brand", label: "Thương hiệu" },
    { key: "price", label: "Giá gốc" },
    { key: "salePrice", label: "Giá khuyến mãi" },
    { key: "stock", label: "Số lượng" },
    { key: "type", label: "Kiểu" },
    { key: "realId", label: "ID" },
  ];

  const rows = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=300&auto=format&fit=crop",
      name: "Test sửa sản phẩm",
      category: "Khai vị",
      brand: "Món Việt",
      price: "78.000 VND",
      salePrice: "46.000 VND",
      stock: 40,
      type: "",
      realId: 51,
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=300&auto=format&fit=crop",
      name: "Salad rau mùa sốt cam",
      category: "Khai vị",
      brand: "Món Việt",
      price: "82.390 VND",
      salePrice: "68.000 VND",
      stock: 76,
      type: "Sản phẩm mới",
      realId: 1,
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý sản phẩm"
      breadcrumb="Sản phẩm"
      searchPlaceholder="Tìm kiếm sản phẩm..."
      filters={[
        { label: "Danh mục", options: ["Khai vị", "Món chính"] },
        { label: "Thương hiệu", options: ["Món Việt", "Món Âu"] },
      ]}
      addLink="/admin/product/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}