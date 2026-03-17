import AdminPageShell from "../shared/AdminPageShell";
import AdminTable from "../shared/AdminTable";

export default function AddressPage() {
  const columns = [
    { key: "id", label: "#" },
    { key: "fullName", label: "Họ tên" },
    { key: "phone", label: "Số điện thoại" },
    { key: "city", label: "Thành phố" },
    { key: "addressLine", label: "Địa chỉ" },
  ];

  const rows = [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      phone: "0909000001",
      city: "HCM",
      addressLine: "12 Nguyễn Trãi",
    },
  ];

  return (
    <AdminPageShell
      title="Quản lý địa chỉ"
      breadcrumb="Address"
      searchPlaceholder="Tìm kiếm địa chỉ..."
      addLink="/admin/address/create"
    >
      <AdminTable columns={columns} rows={rows} />
    </AdminPageShell>
  );
}