import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductForm from "./ProductForm";
import { createProductApi } from "../../../api/modules/productApi";
import { uploadProductThumbnailApi } from "../../../api/modules/uploadApi";
import { getCategoriesApi } from "../../../api/modules/categoryApi";
import { getBrandsApi } from "../../../api/modules/brandApi";

type OptionItem = {
  id: number;
  name: string;
};

export default function ProductCreatePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [categories, setCategories] = useState<OptionItem[]>([]);
  const [brands, setBrands] = useState<OptionItem[]>([]);

  const [form, setForm] = useState({
    name: "",
    sku: "",
    shortDescription: "",
    description: "",
    categoryId: "",
    brandId: "",
    basePrice: "",
    salePrice: "",
    thumbnail: "",
    status: "DRAFT",
    isFeatured: false,
    tags: "",
    seoTitle: "",
    seoDescription: "",
  });

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([
          getCategoriesApi(),
          getBrandsApi(),
        ]);

        const categoryData = Array.isArray(categoryRes?.data)
          ? categoryRes.data
          : Array.isArray(categoryRes?.data?.data)
          ? categoryRes.data.data
          : Array.isArray(categoryRes)
          ? categoryRes
          : [];

        const brandData = Array.isArray(brandRes?.data)
          ? brandRes.data
          : Array.isArray(brandRes?.data?.data)
          ? brandRes.data.data
          : Array.isArray(brandRes)
          ? brandRes
          : [];

        setCategories(categoryData);
        setBrands(brandData);
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được dữ liệu danh mục / thương hiệu"
        );
      }
    };

    loadOptions();
  }, []);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      alert("Vui lòng chọn ảnh trước");
      return "";
    }

    try {
      setUploading(true);
      const res = await uploadProductThumbnailApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      setForm((prev) => ({
        ...prev,
        thumbnail: imageUrl,
      }));

      return imageUrl;
    } catch (error: any) {
      alert(error?.response?.data?.message || "Upload ảnh thất bại");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên sản phẩm");
      return;
    }

    if (!form.sku.trim()) {
      alert("Vui lòng nhập SKU");
      return;
    }

    if (!form.categoryId) {
      alert("Vui lòng chọn danh mục");
      return;
    }

    if (!form.basePrice) {
      alert("Vui lòng nhập giá gốc");
      return;
    }

    try {
      setLoading(true);

      let thumbnailUrl = form.thumbnail;

      if (selectedFile && !thumbnailUrl) {
        thumbnailUrl = await handleUploadImage();
        if (!thumbnailUrl) {
          setLoading(false);
          return;
        }
      }

      await createProductApi({
        ...form,
        thumbnail: thumbnailUrl || null,
        categoryId: Number(form.categoryId),
        brandId: form.brandId ? Number(form.brandId) : null,
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
      });

      alert("Tạo sản phẩm thành công");
      navigate("/admin/products");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Tạo sản phẩm thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Thêm sản phẩm</h2>

      <ProductForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading || uploading}
        submitText={uploading ? "Đang upload..." : "Tạo sản phẩm"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUploadImage={handleUploadImage}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}