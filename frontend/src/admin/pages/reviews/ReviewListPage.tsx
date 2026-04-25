import { useEffect, useMemo, useState } from "react";
import api from "../../../api/axiosClient";
import {
  deleteReviewApi,
  getReviewsByProductApi,
} from "../../../api/modules/reviewApi";

type Product = {
  id: number;
  name: string;
  thumbnail?: string;
};

type Review = {
  id: number;
  rating: number;
  comment?: string | null;
  createdAt: string;
  user?: {
    id?: number;
    fullName?: string;
    avatar?: string;
  };
  product?: {
    id: number;
    name: string;
    thumbnail?: string;
  };
};

export default function ReviewListPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [keyword, setKeyword] = useState("");
  const [productId, setProductId] = useState("all");
  const [loading, setLoading] = useState(false);

  const unwrapArray = (res: any): any[] => {
    if (Array.isArray(res?.data?.data)) return res.data.data;
    if (Array.isArray(res?.data?.data?.items)) return res.data.data.items;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res)) return res;
    return [];
  };

  const fetchProducts = async () => {
    const res = await api.get("/products");
    const list = unwrapArray(res);
    return list.map((item: any) => ({
      id: item.id,
      name: item.name || item.productName || "Không có tên",
      thumbnail: item.thumbnail || item.image || item.images?.[0]?.url || "",
    }));
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const productList = await fetchProducts();
      setProducts(productList);

      const reviewResults = await Promise.allSettled(
        productList.map(async (product) => {
          const res = await getReviewsByProductApi(product.id);
          const data = res?.data;

          const list = Array.isArray(data?.reviews) ? data.reviews : [];

          return list.map((review: Review) => ({
            ...review,
            product: {
              id: product.id,
              name: product.name,
              thumbnail: product.thumbnail,
            },
          }));
        })
      );

      const mergedReviews = reviewResults
        .filter((item) => item.status === "fulfilled")
        .flatMap((item: any) => item.value);

      setReviews(mergedReviews);
    } catch (error: any) {
      alert(error?.response?.data?.message || "Lỗi tải danh sách đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa đánh giá này?")) return;

    try {
      await deleteReviewApi(id);
      alert("Xóa đánh giá thành công");
      fetchReviews();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Lỗi xóa đánh giá");
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter((item) => {
      const matchKeyword =
        item.comment?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.user?.fullName?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.product?.name?.toLowerCase().includes(keyword.toLowerCase());

      const matchProduct =
        productId === "all" || String(item.product?.id) === productId;

      return matchKeyword && matchProduct;
    });
  }, [reviews, keyword, productId]);

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Quản lý đánh giá</h2>
          <p style={styles.subtitle}>
            Xem và xóa đánh giá của khách hàng theo từng sản phẩm.
          </p>
        </div>

        <button style={styles.reloadBtn} onClick={fetchReviews}>
          Tải lại
        </button>
      </div>

      <div style={styles.filterBox}>
        <input
          style={styles.input}
          placeholder="Tìm theo sản phẩm, người dùng, nội dung..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          style={styles.select}
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          <option value="all">Tất cả sản phẩm</option>
          {products.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div style={styles.card}>
        {loading ? (
          <div style={styles.empty}>Đang tải đánh giá...</div>
        ) : filteredReviews.length === 0 ? (
          <div style={styles.empty}>Chưa có đánh giá nào</div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Sản phẩm</th>
                  <th style={styles.th}>Khách hàng</th>
                  <th style={styles.th}>Số sao</th>
                  <th style={styles.th}>Nội dung</th>
                  <th style={styles.th}>Ngày tạo</th>
                  <th style={styles.th}>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {filteredReviews.map((item) => (
                  <tr key={item.id}>
                    <td style={styles.td}>#{item.id}</td>

                    <td style={styles.td}>
                      <div style={styles.productCell}>
                        <img
                          src={
                            item.product?.thumbnail ||
                            "https://placehold.co/80x80?text=No+Image"
                          }
                          alt={item.product?.name}
                          style={styles.productImage}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://placehold.co/80x80?text=No+Image";
                          }}
                        />
                        <span>{item.product?.name || "Không rõ sản phẩm"}</span>
                      </div>
                    </td>

                    <td style={styles.td}>
                      {item.user?.fullName || "Không rõ người dùng"}
                    </td>

                    <td style={styles.td}>
                      <span style={styles.rating}>{item.rating} ⭐</span>
                    </td>

                    <td style={styles.td}>
                      {item.comment || "Không có nội dung"}
                    </td>

                    <td style={styles.td}>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleString("vi-VN")
                        : ""}
                    </td>

                    <td style={styles.td}>
                      <button
                        style={styles.deleteBtn}
                        onClick={() => handleDelete(item.id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 24,
    background: "#f5f7fb",
    minHeight: "100vh",
    fontFamily: "Times New Roman, serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: 28,
    color: "#111827",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
  },
  reloadBtn: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "10px 16px",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 700,
  },
  filterBox: {
    display: "flex",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    outline: "none",
  },
  select: {
    width: 260,
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: 10,
    outline: "none",
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
    overflow: "hidden",
  },
  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 1000,
  },
  th: {
    background: "#111827",
    color: "#fff",
    padding: "14px 12px",
    textAlign: "left",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "14px 12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    verticalAlign: "middle",
  },
  productCell: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 240,
  },
  productImage: {
    width: 48,
    height: 48,
    objectFit: "cover",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
  },
  rating: {
    background: "#fff7ed",
    color: "#c2410c",
    padding: "6px 10px",
    borderRadius: 999,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
  },
  empty: {
    padding: 30,
    textAlign: "center",
    color: "#6b7280",
  },
};