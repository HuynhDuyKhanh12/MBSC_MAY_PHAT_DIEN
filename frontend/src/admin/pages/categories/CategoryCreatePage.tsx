import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCategoryApi } from "../../../api/modules/categoryApi";
import { uploadCategoryImageApi } from "../../../api/modules/uploadApi";
import CategoryForm from "./components/CategoryForm";

export default function CategoryCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    isVisible: true,
  });

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn ảnh trước");
      return "";
    }

    try {
      setUploading(true);
      const res = await uploadCategoryImageApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      setForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      return imageUrl;
    } catch (error: any) {
      console.error("Upload ảnh category lỗi:", error);
      alert(error?.response?.data?.message || "Upload ảnh thất bại");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.image;

      if (selectedFile && !imageUrl) {
        imageUrl = await handleUploadImage();
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      await createCategoryApi({
        name: form.name.trim(),
        image: imageUrl,
        description: form.description.trim(),
        isVisible: form.isVisible,
        parentId: null,
      });

      alert("Thêm danh mục thành công");
      navigate("/admin/categories");
    } catch (error: any) {
      console.error("Create category error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Lỗi khi tạo danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Thêm danh mục</h2>

      <CategoryForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading || uploading}
        submitText={uploading ? "Đang upload..." : "Tạo danh mục"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUploadImage={handleUploadImage}
      />
    </div>
  );
}