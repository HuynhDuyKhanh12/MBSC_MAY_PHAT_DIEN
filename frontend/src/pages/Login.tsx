// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { loginApi } from "../services/authApi";

// export default function Login() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({
//     email: "admin@gmail.com",
//     password: "Admin@123",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setError("");

//       const data = await loginApi(form);

//       // Tùy backend trả về tên field gì
//       const token =
//         data?.accessToken ||
//         data?.token ||
//         data?.data?.accessToken ||
//         data?.data?.token;

//       const user =
//         data?.user ||
//         data?.data?.user ||
//         null;

//       if (!token) {
//         throw new Error("Không nhận được token từ backend");
//       }

//       localStorage.setItem("token", token);
//       if (user) {
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       alert("Đăng nhập thành công");
//       navigate("/admin/products");
//     } catch (err: any) {
//       setError(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Đăng nhập thất bại"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={styles.wrapper}>
//       <form onSubmit={handleLogin} style={styles.form}>
//         <h2 style={styles.title}>Đăng nhập admin</h2>

//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           style={styles.input}
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Mật khẩu"
//           value={form.password}
//           onChange={handleChange}
//           style={styles.input}
//         />

//         {error ? <p style={styles.error}>{error}</p> : null}

//         <button type="submit" style={styles.button} disabled={loading}>
//           {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//         </button>
//       </form>
//     </div>
//   );
// }

// const styles: Record<string, React.CSSProperties> = {
//   wrapper: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "#f4f6f8",
//   },
//   form: {
//     width: 380,
//     background: "#fff",
//     padding: 24,
//     borderRadius: 12,
//     boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
//     display: "flex",
//     flexDirection: "column",
//     gap: 14,
//   },
//   title: {
//     margin: 0,
//     textAlign: "center",
//   },
//   input: {
//     padding: 12,
//     borderRadius: 8,
//     border: "1px solid #d0d7de",
//     fontSize: 15,
//   },
//   button: {
//     padding: 12,
//     border: "none",
//     borderRadius: 8,
//     background: "#1677ff",
//     color: "#fff",
//     fontWeight: 700,
//     cursor: "pointer",
//   },
//   error: {
//     color: "red",
//     margin: 0,
//     fontSize: 14,
//   },
// };