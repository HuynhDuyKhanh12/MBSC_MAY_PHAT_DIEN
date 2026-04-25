import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCategoryByIdApi,
  updateCategoryApi,
} from "../../../api/modules/categoryApi";
import { uploadCategoryImageApi } from "../../../api/modules/uploadApi";
import CategoryForm from "./components/CategoryForm";

export default function CategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    isVisible: true,
  });

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setFetching(true);
        const data = await getCategoryByIdApi(id as string);
        const item = data?.data || data;

        setForm({
          name: item?.name || "",
          image: item?.image || item?.imageUrl || "",
          description: item?.description || "",
          isVisible: Boolean(item?.isVisible),
        });
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được danh mục"
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) loadDetail();
  }, [id]);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      return form.image || "";
    }

    try {
      setUploading(true);

      const res = await uploadCategoryImageApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      if (!imageUrl) {
        throw new Error("Không lấy được link ảnh sau khi upload");
      }

      setForm((prev) => ({
        ...prev,
        image: imageUrl,
      }));

      return imageUrl;
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Upload ảnh thất bại"
      );
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setLoading(true);

      let imageUrl = form.image || "";

      if (selectedFile) {
        imageUrl = await handleUploadImage();
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      await updateCategoryApi(id, {
        name: form.name.trim(),
        image: imageUrl,
        description: form.description.trim(),
        isVisible: form.isVisible,
        parentId: null,
      });

      alert("Cập nhật danh mục thành công");
      navigate("/admin/categories");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Cập nhật danh mục thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p>Đang tải dữ liệu danh mục...</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Sửa danh mục</h2>

      <CategoryForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading || uploading}
        submitText={uploading ? "Đang upload..." : "Cập nhật"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUploadImage={handleUploadImage}
      />
    </div>
  );
}