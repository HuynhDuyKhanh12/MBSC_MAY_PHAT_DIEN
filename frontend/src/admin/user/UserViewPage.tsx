import { useNavigate, useParams } from "react-router-dom";
import { getUserById } from "./userStorage";

export default function UserViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = getUserById(Number(id));

  if (!user) {
    return <div style={{ padding: 20 }}>Không tìm thấy người dùng</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết người dùng</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 24,
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <img
            src={user.image}
            alt={user.name}
            style={{
              width: "100%",
              maxWidth: 200,
              height: 200,
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        </div>

        <div>
          <p>
            <b>Họ tên:</b> {user.name}
          </p>
          <p>
            <b>Email:</b> {user.email}
          </p>
          <p>
            <b>Số điện thoại:</b> {user.phone}
          </p>
          <p>
            <b>Vai trò:</b> {user.role}
          </p>
          <p>
            <b>ID:</b> {user.realId}
          </p>
          <p>
            <b>Trạng thái:</b> {user.status ? "Hiển thị" : "Ẩn"}
          </p>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/user")}>Quay lại</button>
            <button onClick={() => navigate(`/admin/user/edit/${user.id}`)}>
              Sửa người dùng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}