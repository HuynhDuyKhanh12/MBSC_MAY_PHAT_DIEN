import api from "../axiosClient";
export const getCategoriesApi = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryByIdApi = async (id: number | string) => {
  const res = await api.get(`/categories/${id}`);
  return res.data;
};

export const createCategoryApi = async (payload: any) => {
  const res = await api.post("/categories", payload);
  return res.data;
};

export const updateCategoryApi = async (
  id: number | string,
  payload: any
) => {
  const res = await api.put(`/categories/${id}`, payload);
  return res.data;
};

export const deleteCategoryApi = async (id: number | string) => {
  const res = await api.delete(`/categories/${id}`);
  return res.data;
};

export const getTrashCategoriesApi = async () => {
  const res = await api.get("/categories/trash");
  return res.data;
};

export const restoreCategoryApi = async (id: number | string) => {
  const res = await api.patch(`/categories/${id}/restore`);
  return res.data;
};

export const forceDeleteCategoryApi = async (id: number | string) => {
  const res = await api.delete(`/categories/${id}/force`);
  return res.data;
};

export const toggleCategoryVisibilityApi = async (id: number | string) => {
  const res = await api.patch(`/categories/${id}/toggle-visibility`);
  return res.data;
};