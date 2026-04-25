import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    config.headers = config.headers ?? axios.defaults.headers.common;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = String(error?.response?.data?.message || "").toLowerCase();

    if (
      status === 401 ||
      message.includes("invalid or expired token") ||
      message.includes("unauthorized")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (window.location.pathname !== "/auth") {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;