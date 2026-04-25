import api from "../axiosClient";

export const getReviewsByProductApi = async (productId: number | string) => {
  const res = await api.get(`/reviews/product/${productId}`);
  return res.data;
};

export const deleteReviewApi = async (id: number | string) => {
  const res = await api.delete(`/reviews/${id}`);
  return res.data;
};