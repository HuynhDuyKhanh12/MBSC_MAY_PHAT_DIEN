import { useNavigate, useParams } from "react-router-dom";
import { getAddressById } from "./addressStorage";

export default function AddressViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const address = getAddressById(Number(id));

  if (!address) {
    return <div style={{ padding: 20 }}>Không tìm thấy địa chỉ</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết địa chỉ</h2>

      <div
        style={{
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <p>
          <b>Họ tên:</b> {address.fullName}
        </p>
        <p>
          <b>Số điện thoại:</b> {address.phone}
        </p>
        <p>
          <b>Thành phố:</b> {address.city}
        </p>
        <p>
          <b>Địa chỉ:</b> {address.addressLine}
        </p>
        <p>
          <b>ID:</b> {address.realId}
        </p>
        <p>
          <b>Trạng thái:</b> {address.status ? "Hiển thị" : "Ẩn"}
        </p>

        <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
          <button onClick={() => navigate("/admin/address")}>Quay lại</button>
          <button onClick={() => navigate(`/admin/address/edit/${address.id}`)}>
            Sửa địa chỉ
          </button>
        </div>
      </div>
    </div>
  );
}