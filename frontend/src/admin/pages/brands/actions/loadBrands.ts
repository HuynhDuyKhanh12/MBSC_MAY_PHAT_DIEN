import { getBrandsApi, getTrashBrandsApi } from "../../../../api/modules/brandApi";

export const loadBrands = async () => {
  const brandRes = await getBrandsApi();

  let trashRes: any = { data: { data: [] } };

  try {
    trashRes = await getTrashBrandsApi();
  } catch (error) {
    console.log("GET TRASH BRANDS ERROR:", error);
  }

  const brands = brandRes?.data?.data || brandRes?.data || [];
  const trash = trashRes?.data?.data || trashRes?.data || [];

  return {
    brands: Array.isArray(brands) ? brands : [],
    trash: Array.isArray(trash) ? trash : [],
  };
};