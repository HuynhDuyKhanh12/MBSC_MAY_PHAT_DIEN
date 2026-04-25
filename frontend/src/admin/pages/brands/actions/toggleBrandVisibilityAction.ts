import { toggleBrandVisibilityApi } from "../../../../api/modules/brandApi";

export const toggleBrandVisibilityAction = async (id: number) => {
  const res = await toggleBrandVisibilityApi(id);
  return res?.data;
};