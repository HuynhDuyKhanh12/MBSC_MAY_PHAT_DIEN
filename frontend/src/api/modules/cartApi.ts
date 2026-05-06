import axiosClient from "../axiosClient";

export const getCartApi = async () => {
  const res = await axiosClient.get("/cart");
  return res.data;
};

export const updateCartItemApi = async (
  id: number | string,
  quantity: number
) => {
  const res = await axiosClient.put(`/cart/items/${id}`, { quantity });
  return res.data;
};

export const deleteCartItemApi = async (id: number | string) => {
  const res = await axiosClient.delete(`/cart/items/${id}`);
  return res.data;
};