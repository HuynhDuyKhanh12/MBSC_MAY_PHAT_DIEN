import { restoreBrandApi } from "../../../../api/modules/brandApi";

export const restoreBrandAction = async (id: number) => {
  const res = await restoreBrandApi(id);
  return res?.data;
};