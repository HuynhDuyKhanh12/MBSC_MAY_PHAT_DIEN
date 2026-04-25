import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserApi, getRolesApi } from "../../../api/modules/userApi";
import { uploadUserAvatarApi } from "../../../api/modules/uploadApi";
import UserForm from "./UserForm";

type RoleItem = {
  id: number;
  name: string;
};

export default function UserCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roles, setRoles] = useState<RoleItem[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    avatar: "",
    gender: "",
    dateOfBirth: "",
    status: "ACTIVE",
    roleId: "",
  });

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await getRolesApi();
        const roleData = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res)
          ? res
          : [];

        setRoles(roleData);
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được danh sách vai trò"
        );
      }
    };

    loadRoles();
  }, []);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn ảnh trước");
      return "";
    }

    try {
      setUploading(true);
      const res = await uploadUserAvatarApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      setForm((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      return imageUrl;
    } catch (error: any) {
      console.error("Upload avatar lỗi:", error);
      alert(error?.response?.data?.message || "Upload avatar thất bại");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (!form.email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!form.password.trim() || form.password.trim().length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!form.roleId) {
      alert("Vui lòng chọn vai trò");
      return;
    }

    try {
      setLoading(true);

      let avatarUrl = form.avatar;

      if (selectedFile && !avatarUrl) {
        avatarUrl = await handleUploadImage();
        if (!avatarUrl) {
          setLoading(false);
          return;
        }
      }

      await createUserApi({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        phone: form.phone.trim() || null,
        avatar: avatarUrl || null,
        gender: form.gender || null,
        dateOfBirth: form.dateOfBirth || null,
        status: form.status,
        roleId: Number(form.roleId),
      });

      alert("Tạo người dùng thành công");
      navigate("/admin/users");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Tạo người dùng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Thêm người dùng</h2>

      <UserForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading || uploading}
        submitText={uploading ? "Đang upload..." : "Tạo người dùng"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUploadImage={handleUploadImage}
        roles={roles}
        isCreate
      />
    </div>
  );
}