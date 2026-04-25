import { updateBrandApi } from "../../../../api/modules/brandApi";

export const updateBrandAction = async (
  id: number,
  form: { name: string; slug: string }
) => {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim(),
  };

  const res = await updateBrandApi(id, payload);
  return res?.data;
};