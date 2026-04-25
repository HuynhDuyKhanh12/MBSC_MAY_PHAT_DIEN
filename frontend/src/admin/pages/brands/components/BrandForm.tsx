import { useEffect, useState } from "react";

type BrandFormValue = {
  name: string;
  logo: string;
  description: string;
  isVisible: boolean;
};

type Props = {
  value: BrandFormValue;
  setValue: React.Dispatch<React.SetStateAction<BrandFormValue>>;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitText?: string;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  onUploadImage?: () => Promise<string>;
};

export default function BrandForm({
  value,
  setValue,
  onSubmit,
  loading = false,
  submitText = "Lưu",
  selectedFile,
  setSelectedFile,
  onUploadImage,
}: Props) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreview(value.logo || "");
  }, [selectedFile, value.logo]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value: inputValue, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setValue((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

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
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Tên brand
        </label>
        <input
          type="text"
          name="name"
          value={value.name}
          onChange={handleChange}
          placeholder="Nhập tên brand"
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0 12px",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Hình ảnh brand
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <p style={{ color: "#6b7280", marginTop: 8 }}>
          Chọn file ảnh mới để upload và cập nhật link ảnh.
        </p>
      </div>

      {preview && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            Xem trước hình ảnh
          </div>
          <img
            src={preview}
            alt="preview"
            style={{
              width: 160,
              height: 160,
              objectFit: "cover",
              borderRadius: 10,
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
          {loading ? "Đang upload..." : "Upload ảnh"}
        </button>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Link ảnh
        </label>
        <input
          type="text"
          name="logo"
          value={value.logo}
          onChange={handleChange}
          placeholder="Sau khi upload, link ảnh sẽ hiện ở đây"
          style={{
            width: "100%",
            height: 44,
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: "0 12px",
            background: "#f9fafb",
          }}
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
          Mô tả
        </label>
        <textarea
          name="description"
          value={value.description}
          onChange={handleChange}
          rows={5}
          placeholder="Nhập mô tả"
          style={{
            width: "100%",
            borderRadius: 8,
            border: "1px solid #d1d5db",
            padding: 12,
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="isVisible"
            checked={value.isVisible}
            onChange={handleChange}
          />
          Hiển thị brand
        </label>
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