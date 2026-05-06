import api from "../axiosClient";

export type CreateOrderPayload = {
  addressId?: number | null;
  couponCode?: string;
  shippingFee?: number;
  paymentMethod: "COD" | "BANK_TRANSFER" | "MOMO" | "VNPAY" | "ZALOPAY";
  note?: string;
  fullName: string;
  phone: string;
  province: string;
  district: string;
  ward: string;
  detailAddress: string;
};

export const createOrderApi = async (payload: CreateOrderPayload) => {
  const res = await api.post("/orders", payload);
  return res.data;
};

export const getMyOrdersApi = async () => {
  const res = await api.get("/orders/me");
  return res.data;
};

// ADMIN
export const getOrdersApi = async (params?: Record<string, any>) => {
  const res = await api.get("/orders", { params });
  return res.data;
};

// ADMIN
export const getOrderByIdApi = async (id: number | string) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

// ADMIN
export const updateOrderStatusApi = async (
  id: number | string,
  status: string
) => {
  const res = await api.put(`/orders/${id}/status`, {
    status,
  });

  return res.data;
};