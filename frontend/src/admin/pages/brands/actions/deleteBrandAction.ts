import { deleteBrandApi } from "../../../../api/modules/brandApi";

export const deleteBrandAction = async (id: number) => {
  const res = await deleteBrandApi(id);
  return res?.data;
};