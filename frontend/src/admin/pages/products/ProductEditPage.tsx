import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductForm from "./ProductForm";
import { getProductByIdApi, updateProductApi } from "../../../api/modules/productApi";
import { uploadProductThumbnailApi } from "../../../api/modules/uploadApi";
import { getCategoriesApi } from "../../../api/modules/categoryApi";
import { getBrandsApi } from "../../../api/modules/brandApi";

type OptionItem = {
  id: number;
  name: string;
};

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
    const loadData = async () => {
      try {
        setFetching(true);

        const [productRes, categoryRes, brandRes] = await Promise.all([
          getProductByIdApi(id as string),
          getCategoriesApi(),
          getBrandsApi(),
        ]);

        const product = productRes?.data || productRes;

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

        setForm({
          name: product?.name || "",
          sku: product?.sku || "",
          shortDescription: product?.shortDescription || "",
          description: product?.description || "",
          categoryId: product?.categoryId ? String(product.categoryId) : "",
          brandId: product?.brandId ? String(product.brandId) : "",
          basePrice: product?.basePrice ? String(product.basePrice) : "",
          salePrice: product?.salePrice ? String(product.salePrice) : "",
          thumbnail: product?.thumbnail || "",
          status: product?.status || "DRAFT",
          isFeatured: Boolean(product?.isFeatured),
          tags: product?.tags || "",
          seoTitle: product?.seoTitle || "",
          seoDescription: product?.seoDescription || "",
        });
      } catch (error: any) {
        alert(
          error?.response?.data?.message ||
            error?.message ||
            "Không tải được dữ liệu sản phẩm"
        );
      } finally {
        setFetching(false);
      }
    };

    if (id) loadData();
  }, [id]);

  const handleUploadImage = async () => {
    if (!selectedFile) {
      return form.thumbnail || "";
    }

    try {
      setUploading(true);

      const res = await uploadProductThumbnailApi(selectedFile);
      const imageUrl = res?.data?.url || res?.url || "";

      if (!imageUrl) {
        throw new Error("Không lấy được link ảnh sau khi upload");
      }

      setForm((prev) => ({
        ...prev,
        thumbnail: imageUrl,
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

      let thumbnailUrl = form.thumbnail || "";

      if (selectedFile) {
        thumbnailUrl = await handleUploadImage();
        if (!thumbnailUrl) {
          setLoading(false);
          return;
        }
      }

      await updateProductApi(id, {
        ...form,
        thumbnail: thumbnailUrl || null,
        categoryId: Number(form.categoryId),
        brandId: form.brandId ? Number(form.brandId) : null,
        basePrice: Number(form.basePrice),
        salePrice: form.salePrice ? Number(form.salePrice) : null,
      });

      alert("Cập nhật sản phẩm thành công");
      navigate("/admin/products");
    } catch (error: any) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Cập nhật sản phẩm thất bại"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <p style={{ padding: 24 }}>Đang tải dữ liệu sản phẩm...</p>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20 }}>Sửa sản phẩm</h2>

      <ProductForm
        value={form}
        setValue={setForm}
        onSubmit={handleSubmit}
        loading={loading || uploading}
        submitText={uploading ? "Đang upload..." : "Cập nhật sản phẩm"}
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
        onUploadImage={handleUploadImage}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}