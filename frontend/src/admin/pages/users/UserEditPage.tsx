import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRolesApi,
  getUserByIdApi,
  updateUserApi,
} from "../../../api/modules/userApi";
import { uploadUserAvatarApi } from "../../../api/modules/uploadApi";
import UserForm from "./UserForm";

type RoleItem = {
  id: number;
  name: string;
};

export default function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [roles, setRoles] = useState<RoleItem[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatar: "",
    gender: "",
    dateOfBirth: "",
    status: "ACTIVE",
    roleId: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setFetching(true);

        const [userRes, roleRes] = await Promise.all([
          getUserByIdApi(id as string),
          getRolesApi(),
        ]);

        const user = userRes?.data || userRes;
        const roleData = Array.isArray(roleRes?.data)
          ? roleRes.data
          : Array.isArray(roleRes?.data?.data)
          ? roleRes.data.data
          : Array.isArray(roleRes)
          ? roleRes
          : [];

        setRoles(roleData);

        setForm({
          fullName: user?.fullName || "",
          email: user?.email || "",
          phone: user?.phone || "",
          avatar: user?.avatar || "",
          gender: user?.gender || "",
          dateOfBirth: user?.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
            : "",
          status: user?.status || "ACTIVE",
          roleId: user?.roleId ? String(user.roleId) : "",
        });
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được dữ liệu người dùng"
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      return form.avatar || "";
    }

    try {
      setUploading(true);

      const res = await uploadUserAvatarApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      if (!imageUrl) {
        throw new Error("Không lấy được link avatar sau khi upload");
      }

      setForm((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));

      return imageUrl;
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Upload avatar thất bại"
      );
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!form.fullName.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    if (!form.email.trim()) {
      alert("Vui lòng nhập email");
      return;
    }

    if (!form.roleId) {
      alert("Vui lòng chọn vai trò");
      return;
    }

    try {
      setLoading(true);

      let avatarUrl = form.avatar || "";

      if (selectedFile) {
        avatarUrl = await handleUploadImage();
        if (!avatarUrl) {
          setLoading(false);
          return;
        }
      }

      await updateUserApi(id, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        avatar: avatarUrl || null,
        gender: form.gender || null,
        dateOfBirth: form.dateOfBirth || null,
        status: form.status,
        roleId: Number(form.roleId),
      });

      alert("Cập nhật người dùng thành công");
      navigate("/admin/users");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Cập nhật người dùng thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p style={{ padding: 24 }}>Đang tải dữ liệu người dùng...</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Sửa người dùng</h2>

      <UserForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading || uploading}
        submitText={uploading ? "Đang upload..." : "Cập nhật người dùng"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUploadImage={handleUploadImage}
        roles={roles}
      />
    </div>
  );
}