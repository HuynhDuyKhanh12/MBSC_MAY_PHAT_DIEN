import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminCreatePage from "../shared/AdminCreatePage";
import { getAddressById, updateAddress } from "./addressStorage";

export default function AddressEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    const address = getAddressById(Number(id));
    if (!address) return;

    setInitialValues({
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      addressLine: address.addressLine,
    });
  }, [id]);

  const fields = [
    { name: "fullName", label: "Họ tên", type: "text" as const },
    { name: "phone", label: "Số điện thoại", type: "text" as const },
    { name: "city", label: "Thành phố", type: "text" as const },
    { name: "addressLine", label: "Địa chỉ", type: "textarea" as const },
  ];

  if (!initialValues) {
    return <div style={{ padding: 20 }}>Đang tải dữ liệu...</div>;
  }

  return (
    <AdminCreatePage
      title="Sửa địa chỉ"
      breadcrumb="Sửa địa chỉ"
      backLink="/admin/address"
      submitText="Cập nhật địa chỉ"
      fields={fields}
      initialValues={initialValues}
      onSubmit={(formData: any) => {
        updateAddress(Number(id), {
          fullName: formData.fullName || "",
          phone: formData.phone || "",
          city: formData.city || "",
          addressLine: formData.addressLine || "",
        });

        alert("Cập nhật địa chỉ thành công");
        navigate("/admin/address");
      }}
    />
  );
}