import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCoupons, restoreCoupon, type CouponItem } from "./couponStorage";

export default function CouponTrashPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<CouponItem[]>([]);

  const loadTrash = () => {
    setRows(getCoupons().filter((item) => item.deleted));
  };

  useEffect(() => {
    loadTrash();
  }, []);

  const handleRestore = (id: number) => {
    restoreCoupon(id);
    loadTrash();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Thùng rác coupon</h2>

      <button onClick={() => navigate("/admin/coupon")} style={{ marginBottom: 16 }}>
        Quay lại
      </button>

      <table border={1} cellPadding={10} cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th>#</th>
            <th>Hình</th>
            <th>Code</th>
            <th>Giảm giá</th>
            <th>Khôi phục</th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <img
                    src={item.image}
                    alt={item.code}
                    style={{ width: 70, height: 70, objectFit: "cover" }}
                  />
                </td>
                <td>{item.code}</td>
                <td>{item.discount}%</td>
                <td>
                  <button onClick={() => handleRestore(item.id)}>Khôi phục</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Không có coupon nào trong thùng rác</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}