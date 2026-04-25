import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BrandForm from "./components/BrandForm";
import {
  getBrandByIdApi,
  updateBrandApi,
} from "../../../api/modules/brandApi";
import { uploadBrandLogoApi } from "../../../api/modules/uploadApi";

export default function BrandEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    logo: "",
    description: "",
    isVisible: true,
  });

  useEffect(() => {
    const loadDetail = async () => {
      try {
        setFetching(true);
        const data = await getBrandByIdApi(id as string);

        setForm({
          name: data?.name || "",
          logo: data?.logo || data?.logoUrl || "",
          description: data?.description || "",
          isVisible: Boolean(data?.isVisible),
        });
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được brand"
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      loadDetail();
    }
  }, [id]);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      return form.logo || "";
    }

    try {
      setUploading(true);

      const res = await uploadBrandLogoApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      if (!imageUrl) {
        throw new Error("Không lấy được link ảnh sau khi upload");
      }

      setForm((prev) => ({
        ...prev,
        logo: imageUrl,
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
      alert("Vui lòng nhập tên brand");
      return;
    }

    try {
      setLoading(true);

      let logoUrl = form.logo || "";

      if (selectedFile) {
        logoUrl = await handleUploadImage();
        if (!logoUrl) {
          setLoading(false);
          return;
        }
      }

      await updateBrandApi(id, {
        name: form.name.trim(),
        logo: logoUrl,
        description: form.description.trim(),
        isVisible: form.isVisible,
      });

      alert("Cập nhật brand thành công");
      navigate("/admin/brands");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Cập nhật brand thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p>Đang tải dữ liệu brand...</p>;
  }

  return (
    <div>
      <h2>Sửa Brand</h2>
      <BrandForm
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