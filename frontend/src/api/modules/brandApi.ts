import axiosClient from "../axiosClient";

function extractArray(payload: any): any[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.brands)) return payload.data.brands;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.brands)) return payload.brands;
  return [];
}

function extractObject(payload: any): any {
  return (
    payload?.data?.data ||
    payload?.data ||
    payload ||
    null
  );
}

export const getBrandsApi = async () => {
  const res = await axiosClient.get("/brands");
  return extractArray(res.data);
};

export const getBrandByIdApi = async (id: number | string) => {
  const res = await axiosClient.get(`/brands/${id}`);
  return extractObject(res.data);
};

export const createBrandApi = async (payload: {
  name: string;
  logo: string;
  description: string;
  isVisible: boolean;
}) => {
  const res = await axiosClient.post("/brands", payload);
  return extractObject(res.data);
};

export const updateBrandApi = async (
  id: number | string,
  payload: {
    name?: string;
    logo?: string;
    description?: string;
    isVisible?: boolean;
  }
) => {
  const res = await axiosClient.put(`/brands/${id}`, payload);
  return extractObject(res.data);
};

export const deleteBrandApi = async (id: number | string) => {
  const res = await axiosClient.delete(`/brands/${id}`);
  return extractObject(res.data);
};

export const getTrashBrandsApi = async () => {
  const res = await axiosClient.get("/brands/trash");
  return extractArray(res.data);
};

export const restoreBrandApi = async (id: number | string) => {
  const res = await axiosClient.patch(`/brands/${id}/restore`);
  return extractObject(res.data);
};

export const forceDeleteBrandApi = async (id: number | string) => {
  const res = await axiosClient.delete(`/brands/${id}/force`);
  return extractObject(res.data);
};

export const toggleBrandVisibilityApi = async (id: number | string) => {
  const res = await axiosClient.patch(`/brands/${id}/toggle-visibility`);
  return extractObject(res.data);
};