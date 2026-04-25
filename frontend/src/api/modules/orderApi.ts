import api from "../axiosClient";

export const getOrdersApi = async (params?: Record<string, any>) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

export const getOrderByIdApi = async (id: number | string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export const updateOrderStatusApi = async (
  id: number | string,
  status: string
) => {
  const res = await api.put(`/orders/${id}/status`, { status });
  return res.data;
};