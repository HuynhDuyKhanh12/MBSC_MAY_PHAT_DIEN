import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";
import {
  getAddresses,
  softDeleteAddress,
  toggleAddressStatus,
  type AddressItem,
} from "./addressStorage";

export default function AddressPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AddressItem[]>([]);

  const columns = [
    { key: "id", label: "#" },
    { key: "fullName", label: "Họ tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "city", label: "Thành phố" },
    { key: "addressLine", label: "Địa chỉ" },
    { key: "realId", label: "ID" },
  ];

  const loadAddresses = () => {
    const data = getAddresses().filter((item) => !item.deleted);
    setRows(data);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleView = (id: number) => {
    navigate(`/admin/address/view/${id}`);
  };

  const handleEdit = (id: number) => {
    navigate(`/admin/address/edit/${id}`);
  };

  const handleDelete = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa địa chỉ này?");
    if (!ok) return;

    softDeleteAddress(id);
    loadAddresses();
  };

  const handleToggleStatus = (id: number) => {
    toggleAddressStatus(id);
    loadAddresses();
  };

  return (
    <AdminPageShell
      title="Quản lý địa chỉ"
      breadcrumb="Address"
      searchPlaceholder="Tìm kiếm địa chỉ..."
      addLink="/admin/address/create"
      trashLink="/admin/address/trash"
    >
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