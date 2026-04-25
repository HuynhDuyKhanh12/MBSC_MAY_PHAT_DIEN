import api from "../axiosClient";

export const getCouponsApi = async () => {
  const res = await api.get("/coupons");
  return res.data;
};

export const getCouponByIdApi = async (id: number | string) => {
  const res = await api.get(`/coupons/${id}`);
  return res.data;
};

export const createCouponApi = async (data: any) => {
  const res = await api.post("/coupons", data);
  return res.data;
};

export const updateCouponApi = async (id: number | string, data: any) => {
  const res = await api.put(`/coupons/${id}`, data);
  return res.data;
};

export const deleteCouponApi = async (id: number | string) => {
  const res = await api.delete(`/coupons/${id}`);
  return res.data;
};

export const toggleCouponApi = async (id: number | string) => {
  const res = await api.patch(`/coupons/${id}/toggle`);
  return res.data;
};

export const getTrashCouponsApi = async () => {
  const res = await api.get("/coupons/trash");
  return res.data;
};

export const restoreCouponApi = async (id: number | string) => {
  const res = await api.patch(`/coupons/${id}/restore`);
  return res.data;
};

export const forceDeleteCouponApi = async (id: number | string) => {
  const res = await api.delete(`/coupons/${id}/force`);
  return res.data;
};