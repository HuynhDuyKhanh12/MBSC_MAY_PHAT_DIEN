import { useEffect, useState } from "react";
import { loadBrands } from "../actions/loadBrands";
import { createBrandAction } from "../actions/createBrandAction";
import { updateBrandAction } from "../actions/updateBrandAction";
import { deleteBrandAction } from "../actions/deleteBrandAction";
import { restoreBrandAction } from "../actions/restoreBrandAction";
import { forceDeleteBrandAction } from "../actions/forceDeleteBrandAction";
import { toggleBrandVisibilityAction } from "../actions/toggleBrandVisibilityAction";

export function useBrandPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [trash, setTrash] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await loadBrands();
      setBrands(data.brands);
      setTrash(data.trash);
    } catch (error: any) {
      console.log("LOAD BRANDS ERROR:", error);
      alert(error?.response?.data?.message || error?.message || "Lỗi tải brand");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "" });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Vui lòng nhập tên brand");
      return;
    }

    if (!form.slug.trim()) {
      alert("Vui lòng nhập slug");
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await updateBrandAction(editingId, form);
        alert("Cập nhật brand thành công");
      } else {
        await createBrandAction(form);
        alert("Thêm brand thành công");
      }

      resetForm();
      await fetchData();
    } catch (error: any) {
      console.log("SUBMIT BRAND ERROR:", error);
      alert(error?.response?.data?.message || error?.message || "Lưu brand thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteBrandAction(id);
      alert("Xóa brand thành công");
      await fetchData();
    } catch (error: any) {
      console.log("DELETE BRAND ERROR:", error);
      alert(error?.response?.data?.message || error?.message || "Xóa brand thất bại");
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreBrandAction(id);
      alert("Khôi phục brand thành công");
      await fetchData();
    } catch (error: any) {
      console.log("RESTORE BRAND ERROR:", error);
      alert(error?.response?.data?.message || error?.message || "Khôi phục thất bại");
    }
  };

  const handleForceDelete = async (id: number) => {
    try {
      await forceDeleteBrandAction(id);
      alert("Xóa vĩnh viễn thành công");
      await fetchData();
    } catch (error: any) {
      console.log("FORCE DELETE BRAND ERROR:", error);
      alert(error?.response?.data?.message || error?.message || "Xóa vĩnh viễn thất bại");
    }
  };

  const handleToggleVisibility = async (id: number) => {
    try {
      await toggleBrandVisibilityAction(id);
      alert("Đổi trạng thái thành công");
      await fetchData();
    } catch (error: any) {
      console.log("TOGGLE VISIBILITY ERROR:", error);
      alert(
        error?.response?.data?.message || error?.message || "Đổi trạng thái thất bại"
      );
    }
  };

  return {
    brands,
    trash,
    loading,
    submitting,
    form,
    setForm,
    editingId,
    setEditingId,
    handleEdit,
    handleSubmit,
    handleDelete,
    handleRestore,
    handleForceDelete,
    handleToggleVisibility,
    resetForm,
  };
}