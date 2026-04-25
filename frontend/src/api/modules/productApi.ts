import api from "../axiosClient";

export const getProductsApi = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const getProductByIdApi = async (id: number | string) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

export const createProductApi = async (payload: any) => {
  const res = await api.post("/products", payload);
  return res.data;
};

export const updateProductApi = async (
  id: number | string,
  payload: any
) => {
  const res = await api.put(`/products/${id}`, payload);
  return res.data;
};

export const deleteProductApi = async (id: number | string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};

export const getTrashProductsApi = async () => {
  const res = await api.get("/products/trash");
  return res.data;
};

export const restoreProductApi = async (id: number | string) => {
  const res = await api.patch(`/products/${id}/restore`);
  return res.data;
};

export const forceDeleteProductApi = async (id: number | string) => {
  const res = await api.delete(`/products/${id}/force`);
  return res.data;
};

export const toggleProductVisibilityApi = async (id: number | string) => {
  const res = await api.patch(`/products/${id}/toggle-visibility`);
  return res.data;
};