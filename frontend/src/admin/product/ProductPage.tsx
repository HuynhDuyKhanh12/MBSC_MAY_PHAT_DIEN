import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import ProductTable from "./ProductTable";
import {
  getProducts,
  softDeleteProduct,
  toggleProductStatus,
  type ProductItem,
} from "./productStorage";

export default function ProductPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<ProductItem[]>([]);

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

  const loadProducts = () => {
    const data = getProducts()
      .filter((item) => !item.deleted)
      .map((item) => ({
        ...item,
        type: item.type || "",
      }));

    setRows(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleToggleStatus = (realId: number) => {
    toggleProductStatus(realId);
    loadProducts();
  };

  const handleView = (realId: number) => {
    navigate(`/admin/product/view/${realId}`);
  };

  const handleEdit = (realId: number) => {
    navigate(`/admin/product/edit/${realId}`);
  };

  const handleDelete = (realId: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa sản phẩm này?");
    if (!ok) return;

    softDeleteProduct(realId);
    loadProducts();
  };

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
      trashLink="/admin/product/trash"
    >
      <ProductTable
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