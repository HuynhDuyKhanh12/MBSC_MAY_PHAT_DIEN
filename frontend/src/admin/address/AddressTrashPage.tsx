import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddresses,
  restoreAddress,
  deleteAddressForever,
  clearAddressTrash,
  type AddressItem,
} from "./addressStorage";

export default function AddressTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<AddressItem[]>([]);

  const loadTrash = () => {
    setRows(getAddresses().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreAddress(id);
    loadTrash();
  };

  const handleDeleteForever = (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa vĩnh viễn địa chỉ này?");
    if (!ok) return;

    deleteAddressForever(id);
    loadTrash();
  };

  const handleClearTrash = () => {
    const ok = window.confirm("Bạn có chắc muốn xóa tất cả địa chỉ trong thùng rác?");
    if (!ok) return;

    clearAddressTrash();
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác địa chỉ</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <button onClick={() => navigate("/admin/address")}>
          Quay lại
        </button>

        <button
          onClick={handleClearTrash}
          style={{
            background: "#ef4444",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Xóa tất cả thùng rác
        </button>
      </div>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>SĐT</th>
            <th>Thành phố</th>
            <th>Địa chỉ</th>
            <th>Khôi phục</th>
            <th>Xóa khỏi thùng rác</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.fullName}</td>
                <td>{item.phone}</td>
                <td>{item.city}</td>
                <td>{item.addressLine}</td>

                <td>
                  <button onClick={() => handleRestore(item.id)}>
                    Khôi phục
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => handleDeleteForever(item.id)}
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: 6,
                      cursor: "pointer",
                    }}
                  >
                    Xóa vĩnh viễn
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>Không có địa chỉ nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}