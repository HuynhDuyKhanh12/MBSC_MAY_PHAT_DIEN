import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAddresses,
  restoreAddress,
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

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác địa chỉ</h2>

      <button
        onClick={() => navigate("/admin/address")}
        style={{ marginBottom: 16 }}
      >
        Quay lại
      </button>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Thành phố</th>
            <th>Địa chỉ</th>
            <th>Khôi phục</th>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Không có địa chỉ nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}