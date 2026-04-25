import axiosClient from "../axiosClient";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  fullName: string;
  email: string;
  phone?: string;
  password: string;
};

export const loginApi = async (payload: LoginPayload) => {
  const body = {
    email: payload.email.trim().toLowerCase(),
    password: payload.password,
  };

  console.log("LOGIN API PAYLOAD:", body);

  const res = await axiosClient.post("/auth/login", body);

  console.log("LOGIN API RESPONSE:", res.data);

  return res.data;
};

export const registerApi = async (payload: RegisterPayload) => {
  const body = {
    fullName: payload.fullName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone?.trim() || "",
    password: payload.password,
  };

  console.log("REGISTER API PAYLOAD:", body);

  const res = await axiosClient.post("/auth/register", body);

  console.log("REGISTER API RESPONSE:", res.data);

  return res.data;
};