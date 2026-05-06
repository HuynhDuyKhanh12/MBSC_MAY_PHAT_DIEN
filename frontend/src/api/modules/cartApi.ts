import api from "../axiosClient";

export const getCartApi = async () => {
  const res = await api.get("/cart");
  return res.data;
};

export const addToCartApi = async (payload: {
  productId: number;
  quantity: number;
  variantId?: number | null;
}) => {
  const body: any = {
    productId: payload.productId,
    quantity: payload.quantity,
  };

  if (payload.variantId) {
    body.variantId = payload.variantId;
  }

  const res = await api.post("/cart", body);
  return res.data;
};

export const updateCartItemApi = async (
  productId: number,
  quantity: number,
  variantId?: number | null
) => {
  const body: any = { quantity };

  if (variantId) {
    body.variantId = variantId;
  }

  const res = await api.put(`/cart/product/${productId}`, body);
  return res.data;
};

export const deleteCartItemApi = async (
  productId: number,
  variantId?: number | null
) => {
  const res = await api.delete(`/cart/product/${productId}`, {
    params: variantId ? { variantId } : {},
  });

  return res.data;
};