import { useNavigate, useParams } from "react-router-dom";
import { getAuthById } from "./authStorage";

export default function AuthViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const auth = getAuthById(Number(id));

  if (!auth) {
    return <div style={{ padding: 20 }}>Không tìm thấy tài khoản</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chi tiết tài khoản</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
          background: "#fff",
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
        }}
      >
        <div>
          <p><b>ID:</b> {auth.id}</p>
          <p><b>Email:</b> {auth.email}</p>
          <p><b>Mật khẩu:</b> {auth.password}</p>
          <p><b>Vai trò:</b> {auth.role}</p>
          <p><b>Trạng thái:</b> {auth.status ? "Hiển thị" : "Ẩn"}</p>

          <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
            <button onClick={() => navigate("/admin/auth")}>
              Quay lại
            </button>

            <button onClick={() => navigate(`/admin/auth/edit/${auth.id}`)}>
              Sửa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}