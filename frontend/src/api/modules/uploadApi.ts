import api from "../axiosClient";

export const uploadBrandLogoApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload/brand-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadCategoryImageApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload/category-image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadUserAvatarApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload/user-avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const uploadProductThumbnailApi = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await api.post("/upload/product-thumbnail", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};