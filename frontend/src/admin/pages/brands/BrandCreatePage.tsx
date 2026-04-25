import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBrandApi } from "../../../api/modules/brandApi";
import { uploadBrandLogoApi } from "../../../api/modules/uploadApi";

export default function BrandCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    logo: "",
    description: "",
    isVisible: true,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview("");
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn ảnh trước");
      return "";
    }

    try {
      setUploading(true);
      const res = await uploadBrandLogoApi(selectedFile);
      const imageUrl = res?.data?.url || "";

      setForm((prev) => ({
        ...prev,
        logo: imageUrl,
      }));

      return imageUrl;
    } catch (error: any) {
      console.error("Upload ảnh lỗi:", error);
      alert(
        error?.response?.data?.message || "Upload ảnh thất bại"
      );
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên brand");
      return;
    }

    try {
      setLoading(true);

      let logoUrl = form.logo;

      if (selectedFile && !logoUrl) {
        logoUrl = await handleUploadImage();
        if (!logoUrl) {
          setLoading(false);
          return;
        }
      }

      await createBrandApi({
        name: form.name,
        logo: logoUrl,
        description: form.description,
        isVisible: form.isVisible,
      });

      alert("Thêm brand thành công");
      navigate("/admin/brands");
    } catch (error: any) {
      console.error("Create brand error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Lỗi khi tạo brand");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Thêm brand</h2>

      <form
        onSubmit={handleSubmit}
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
            value={form.name}
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
            Chọn file ảnh. Ảnh sẽ được upload lên backend và lưu link vào brand.
          </p>
        </div>

        {preview && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Xem trước hình ảnh</div>
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
            onClick={handleUploadImage}
            disabled={uploading || !selectedFile}
            style={{
              height: 42,
              padding: "0 16px",
              borderRadius: 8,
              border: "none",
              background: uploading ? "#94a3b8" : "#2563eb",
              color: "#fff",
              cursor: uploading || !selectedFile ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Đang upload..." : "Upload ảnh"}
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
            Link ảnh
          </label>
          <input
            type="text"
            value={form.logo}
            readOnly
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
            value={form.description}
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
              checked={form.isVisible}
              onChange={handleChange}
            />
            Hiển thị brand
          </label>
        </div>

        <button
          type="submit"
          disabled={loading || uploading}
          style={{
            height: 44,
            minWidth: 180,
            borderRadius: 8,
            border: "none",
            background: loading || uploading ? "#94a3b8" : "#1d4ed8",
            color: "#fff",
            fontWeight: 700,
            cursor: loading || uploading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang xử lý..." : "Tạo brand"}
        </button>
      </form>
    </div>
  );
}