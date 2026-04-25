import { useEffect, useState } from "react";

type OptionItem = {
  id: number;
  name: string;
};

type ProductFormValue = {
  name: string;
  sku: string;
  shortDescription: string;
  description: string;
  categoryId: string;
  brandId: string;
  basePrice: string;
  salePrice: string;
  thumbnail: string;
  status: string;
  isFeatured: boolean;
  tags: string;
  seoTitle: string;
  seoDescription: string;
};

type Props = {
  value: ProductFormValue;
  setValue: React.Dispatch<React.SetStateAction<ProductFormValue>>;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitText?: string;
  selectedFile: File | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<File | null>>;
  onUploadImage?: () => Promise<string>;
  categories: OptionItem[];
  brands: OptionItem[];
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

export default function ProductForm({
  value,
  setValue,
  onSubmit,
  loading = false,
  submitText = "Lưu",
  selectedFile,
  setSelectedFile,
  onUploadImage,
  categories,
  brands,
}: Props) {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreview(getImageSrc(value.thumbnail || ""));
  }, [selectedFile, value.thumbnail]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 1000,
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
      }}
    >
      <div style={groupStyle}>
        <label style={labelStyle}>Tên sản phẩm</label>
        <input
          type="text"
          name="name"
          value={value.name}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>SKU</label>
        <input
          type="text"
          name="sku"
          value={value.sku}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Mô tả ngắn</label>
        <input
          type="text"
          name="shortDescription"
          value={value.shortDescription}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Mô tả chi tiết</label>
        <textarea
          name="description"
          value={value.description}
          onChange={handleChange}
          rows={5}
          style={textareaStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Danh mục</label>
        <select
          name="categoryId"
          value={value.categoryId}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Chọn danh mục</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Thương hiệu</label>
        <select
          name="brandId"
          value={value.brandId}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="">Chọn thương hiệu</option>
          {brands.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Giá gốc</label>
        <input
          type="number"
          name="basePrice"
          value={value.basePrice}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Giá khuyến mãi</label>
        <input
          type="number"
          name="salePrice"
          value={value.salePrice}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Ảnh thumbnail</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        />
        <p style={{ color: "#6b7280", marginTop: 8 }}>
          Chọn file ảnh mới để upload thumbnail sản phẩm.
        </p>
      </div>

      {preview && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Xem trước ảnh</div>
          <img
            src={preview}
            alt="preview"
            style={{
              width: 180,
              height: 180,
              objectFit: "cover",
              borderRadius: 12,
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
          style={uploadBtnStyle}
        >
          {loading ? "Đang upload..." : "Upload ảnh"}
        </button>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Link ảnh</label>
        <input
          type="text"
          name="thumbnail"
          value={value.thumbnail}
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
          <option value="DRAFT">DRAFT</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="OUT_OF_STOCK">OUT_OF_STOCK</option>
        </select>
      </div>

      <div style={groupStyle}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            type="checkbox"
            name="isFeatured"
            checked={value.isFeatured}
            onChange={handleChange}
          />
          Sản phẩm nổi bật
        </label>
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>Tags</label>
        <input
          type="text"
          name="tags"
          value={value.tags}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>SEO title</label>
        <input
          type="text"
          name="seoTitle"
          value={value.seoTitle}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      <div style={groupStyle}>
        <label style={labelStyle}>SEO description</label>
        <textarea
          name="seoDescription"
          value={value.seoDescription}
          onChange={handleChange}
          rows={4}
          style={textareaStyle}
        />
      </div>

      <button type="submit" disabled={loading} style={submitBtnStyle}>
        {submitText}
      </button>
    </form>
  );
}

const groupStyle: React.CSSProperties = { marginBottom: 16 };
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
const textareaStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid #d1d5db",
  padding: 12,
  background: "#fff",
};
const uploadBtnStyle: React.CSSProperties = {
  height: 42,
  padding: "0 16px",
  borderRadius: 8,
  border: "none",
  background: "#2563eb",
  color: "#fff",
  cursor: "pointer",
};
const submitBtnStyle: React.CSSProperties = {
  height: 44,
  minWidth: 180,
  borderRadius: 8,
  border: "none",
  background: "#1d4ed8",
  color: "#fff",
  fontWeight: 700,
  cursor: "pointer",
};