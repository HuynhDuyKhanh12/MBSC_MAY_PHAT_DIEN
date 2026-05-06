import axiosClient from "../axiosClient";

export const getBlogsApi = async () => {
  const res = await axiosClient.get("/blogs");
  return res.data;
};

export const getBlogByIdApi = async (id: number | string) => {
  const res = await axiosClient.get(`/blogs/${id}`);
  return res.data;
};