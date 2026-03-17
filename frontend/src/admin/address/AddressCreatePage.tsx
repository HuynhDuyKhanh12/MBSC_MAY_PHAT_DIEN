import AdminCreatePage from "../shared/AdminCreatePage";

export default function AddressCreatePage() {
  const fields = [
    { name: "fullName", label: "Họ tên", type: "text" as const },
    { name: "phone", label: "Số điện thoại", type: "text" as const },
    { name: "city", label: "Thành phố", type: "text" as const },
    { name: "addressLine", label: "Địa chỉ", type: "textarea" as const },
  ];

  return (
    <AdminCreatePage
      title="Thêm địa chỉ mới"
      breadcrumb="Thêm địa chỉ"
      backLink="/admin/address"
      submitText="Lưu địa chỉ"
      fields={fields}
    />
  );
}