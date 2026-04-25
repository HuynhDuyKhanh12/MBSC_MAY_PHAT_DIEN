import { createBrandApi } from "../../../../api/modules/brandApi";

export const createBrandAction = async (form: { name: string; slug: string }) => {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim(),
  };

  const res = await createBrandApi(payload);
  return res?.data;
};