import { forceDeleteBrandApi } from "../../../../api/modules/brandApi";

export const forceDeleteBrandAction = async (id: number) => {
  const res = await forceDeleteBrandApi(id);
  return res?.data;
};