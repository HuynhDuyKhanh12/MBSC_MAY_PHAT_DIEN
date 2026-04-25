import api from "../axiosClient";

export const getUsersApi = async () => {
  const res = await api.get("/users");
  return res.data;
};

export const getTrashUsersApi = async () => {
  const res = await api.get("/users/trash");
  return res.data;
};

export const getUserByIdApi = async (id: number | string) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUserApi = async (payload: any) => {
  const res = await api.post("/users", payload);
  return res.data;
};

export const updateUserApi = async (id: number | string, payload: any) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};

export const deleteUserApi = async (id: number | string) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export const restoreUserApi = async (id: number | string) => {
  const res = await api.patch(`/users/${id}/restore`);
  return res.data;
};

export const forceDeleteUserApi = async (id: number | string) => {
  const res = await api.delete(`/users/${id}/force`);
  return res.data;
};

export const changeUserStatusApi = async (
  id: number | string,
  status: "ACTIVE" | "INACTIVE" | "BLOCKED"
) => {
  const res = await api.patch(`/users/${id}/status`, { status });
  return res.data;
};

export const getRolesApi = async () => {
  const res = await api.get("/users/roles");
  return res.data;
};