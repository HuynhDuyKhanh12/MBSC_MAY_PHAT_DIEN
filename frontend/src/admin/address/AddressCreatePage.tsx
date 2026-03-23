import { useNavigate } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { addAddress } from "./addressStorage";

export default function AddressCreatePage() {
  const navigate = useNavigate();

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
      onSubmit={(formData: any) => {
        addAddress({
          fullName: formData.fullName || "",
          phone: formData.phone || "",
          city: formData.city || "",
          addressLine: formData.addressLine || "",
          status: true,
          deleted: false,
        });

        alert("Thêm địa chỉ thành công");
        navigate("/admin/address");
      }}
    />
  );
}