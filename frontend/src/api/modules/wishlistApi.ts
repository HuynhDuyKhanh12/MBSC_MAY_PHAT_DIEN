import axiosClient from "../axiosClient";

export const getWishlistsApi = async () => {
  const res = await axiosClient.get("/wishlists");
  return res.data;
};

export const addWishlistApi = async (productId: number) => {
  const res = await axiosClient.post("/wishlists", { productId });
  return res.data;
};

export const deleteWishlistApi = async (productId: number) => {
  const res = await axiosClient.delete(`/wishlists/${productId}`);
  return res.data;
};