import { useEffect, useState } from "react";

type RoleItem = {
  id: number;
  name: string;
};

type UserFormValue = {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  avatar: string;
  gender: string;
  dateOfBirth: string;
  status: string;
  roleId: string;
};

type Props = {
  value: UserFormValue;
  setValue: React.Dispatch<React.SetStateAction<UserFormValue>>;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitText?: string;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  onUploadImage?: () => Promise<string>;
  roles: RoleItem[];
  isCreate?: boolean;
};

function getImageSrc(image?: string) {
  if (!image || !String(image).trim()) return "";

  const value = String(image).trim();

  if (value.startsWith("data:image/")) return value;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `http://localhost:5000${value}`;
  if (value.startsWith("uploads/")) return `http://localhost:5000/${value}`;
  if (value.startsWith("/")) return `http://localhost:5000${value}`;

  return `http://localhost:5000/uploads/${value}`;
}

export default function UserForm({
  value,
  setValue,
  onSubmit,
  loading = false,
  submitText = "Lưu",
  selectedFile,
  setSelectedFile,
  onUploadImage,
  roles,
  isCreate = false,
}: Props) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreview(getImageSrc(value.avatar || ""));
  }, [selectedFile, value.avatar]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: inputValue } = e.target;

    setValue((prev) => ({
      ...prev,
      [name]: inputValue,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 900,
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={groupStyle}>
        <label style={labelStyle}>Họ tên</label>
        <input
          type="text"
          name="fullName"
          value={value.fullName}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          value={value.email}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {isCreate && (
        <div style={groupStyle}>
          <label style={labelStyle}>Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={value.password || ""}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>
      )}

      <div style={groupStyle}>
        <label style={labelStyle}>Số điện thoại</label>
        <input
          type="text"
          name="phone"
          value={value.phone}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Avatar</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p style={{ color: "#6b7280", marginTop: 8 }}>
          Chọn file ảnh mới để upload avatar người dùng.
        </p>
      </div>

      {preview && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Xem trước ảnh</div>
          <img
            src={preview}
            alt="preview"
            style={{
              width: 160,
              height: 160,
              objectFit: "cover",
              borderRadius: 999,
              border: "1px solid #d1d5db",
            }}
          />
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={onUploadImage}
          disabled={loading || !selectedFile}
          style={{
            height: 42,
            padding: "0 16px",
            borderRadius: 8,
            border: "none",
            background: loading || !selectedFile ? "#94a3b8" : "#2563eb",
            color: "#fff",
            cursor: loading || !selectedFile ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang upload..." : "Upload avatar"}
        </button>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Link avatar</label>
        <input
          type="text"
          name="avatar"
          value={value.avatar}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Giới tính</label>
        <select
          name="gender"
          value={value.gender}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Chọn giới tính</option>
          <option value="MALE">Nam</option>
          <option value="FEMALE">Nữ</option>
          <option value="OTHER">Khác</option>
        </select>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Ngày sinh</label>
        <input
          type="date"
          name="dateOfBirth"
          value={value.dateOfBirth}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Trạng thái</label>
        <select
          name="status"
          value={value.status}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Vai trò</label>
        <select
          name="roleId"
          value={value.roleId}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Chọn vai trò</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          height: 44,
          minWidth: 180,
          borderRadius: 8,
          border: "none",
          background: loading ? "#94a3b8" : "#1d4ed8",
          color: "#fff",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {submitText}
      </button>
    </form>
  );
}

const groupStyle: React.CSSProperties = {
  marginBottom: 16,
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  padding: "0 12px",
  background: "#fff",
};