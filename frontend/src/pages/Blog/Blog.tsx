import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./blog.css";
import { Link } from "react-router-dom";
import { getBlogsApi } from "../../api/modules/blogApi.ts";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author?: string;
  date: string;
  category?: string;
};

const API_URL = "http://localhost:5000";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80";

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Cách chọn máy phát điện phù hợp cho gia đình",
    excerpt:
      "Hướng dẫn chọn công suất máy phát điện phù hợp với nhu cầu sử dụng trong gia đình, cửa hàng và văn phòng nhỏ.",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80",
    author: "MBSC",
    date: "2026-04-01",
    category: "Hướng dẫn",
  },
  {
    id: 2,
    title: "Bao lâu nên bảo trì máy phát điện một lần?",
    excerpt:
      "Bảo trì định kỳ giúp máy phát điện hoạt động ổn định, tiết kiệm nhiên liệu và tránh hư hỏng nặng.",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1400&q=80",
    author: "MBSC",
    date: "2026-04-05",
    category: "Bảo trì",
  },
  {
    id: 3,
    title: "Dấu hiệu máy phát điện cần được kiểm tra ngay",
    excerpt:
      "Máy khó nổ, phát ra tiếng lạ, điện áp chập chờn hoặc hao nhiên liệu là các dấu hiệu cần kiểm tra sớm.",
    image:
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1400&q=80",
    author: "MBSC",
    date: "2026-04-10",
    category: "Sửa chữa",
  },
  {
    id: 4,
    title: "Nên chọn máy phát điện xăng hay dầu?",
    excerpt:
      "So sánh ưu nhược điểm giữa máy phát điện chạy xăng và chạy dầu để chọn đúng theo nhu cầu sử dụng.",
    image:
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1400&q=80",
    author: "MBSC",
    date: "2026-04-15",
    category: "Tư vấn",
  },
  {
    id: 5,
    title: "Lưu ý an toàn khi sử dụng máy phát điện",
    excerpt:
      "Không đặt máy trong nhà kín, kiểm tra nhiên liệu và dây dẫn trước khi vận hành để đảm bảo an toàn.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1400&q=80",
    author: "MBSC",
    date: "2026-04-20",
    category: "An toàn",
  },
  {
    id: 6,
    title: "Kinh nghiệm mua máy phát điện cho công trình",
    excerpt:
      "Công trình cần máy có công suất ổn định, bền bỉ và dễ bảo trì để đảm bảo tiến độ thi công.",
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80",
    author: "MBSC",
    date: "2026-04-25",
    category: "Kinh nghiệm",
  },
];

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function getImageSrc(image?: string) {
  if (!image || !String(image).trim()) return FALLBACK_IMG;

  const value = String(image).trim();

  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (value.startsWith("/uploads/")) return `${API_URL}${value}`;
  if (value.startsWith("uploads/")) return `${API_URL}/${value}`;
  if (value.startsWith("/")) return `${API_URL}${value}`;

  return value;
}

function formatDateDot(s: string) {
  if (!s) return "Chưa có ngày";

  const date = new Date(s);

  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString("vi-VN").replaceAll("/", ".");
  }

  const m = s.match(/(\d{1,2}).*?(\d{1,2}).*?(\d{4})/);

  if (!m) return s;

  const dd = m[1].padStart(2, "0");
  const mm = m[2].padStart(2, "0");
  const yy = m[3];

  return `${dd}.${mm}.${yy}`;
}

function mapApiBlog(item: any): BlogPost {
  return {
    id: Number(item.id),
    title: item.title || item.name || "Không có tiêu đề",
    excerpt:
      item.excerpt ||
      item.shortDescription ||
      item.description ||
      item.content ||
      "Chưa có mô tả bài viết.",
    image: getImageSrc(item.image || item.thumbnail || item.cover),
    author: item.author?.fullName || item.author?.name || item.author || "MBSC",
    date: item.createdAt || item.updatedAt || item.date || "Chưa có ngày",
    category: item.category?.name || item.category || "Tin tức",
  };
}

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [loading, setLoading] = useState(false);
  const [latestOpen, setLatestOpen] = useState(true);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentH, setContentH] = useState(0);

  const perPage = 4;
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        setLoading(true);

        const res = await getBlogsApi();

        const apiData = normalizeArrayResponse(res)
          .filter((item: any) => !item.deletedAt)
          .map(mapApiBlog);

        if (apiData.length > 0) {
          setPosts(apiData);
        } else {
          setPosts(DEFAULT_POSTS);
        }
      } catch (error) {
        console.log("Backend chưa có API blog, dùng data mẫu:", error);
        setPosts(DEFAULT_POSTS);
      } finally {
        setLoading(false);
      }
    };

    loadBlogs();
  }, []);

  const newestOptions = useMemo(() => posts.slice(0, 6), [posts]);

  const measure = () => {
    const el = contentRef.current;
    if (!el) return;
    setContentH(el.scrollHeight);
  };

  useLayoutEffect(() => {
    measure();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [newestOptions.length]);

  useEffect(() => {
    setPage(1);
  }, [posts.length]);

  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  const pagePosts = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages);
    const start = (safePage - 1) * perPage;

    return posts.slice(start, start + perPage);
  }, [posts, page, totalPages]);

  return (
    <>
      <Header />

      <main className="blogPage">
        <div className="blogWrap">
          <section className="blogMain">
            <h1 className="blogTitle">Tin tức</h1>

            {loading && (
              <p style={{ padding: "20px 0", fontWeight: 700 }}>
                Đang tải bài viết...
              </p>
            )}

            <div className="blogGrid">
              {pagePosts.map((p) => (
                <article key={p.id} className="postCard">
                  <Link
                    className="postCard__media"
                    to={`/blog/${p.id}`}
                    aria-label={p.title}
                  >
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_IMG;
                      }}
                    />
                  </Link>

                  <div className="postCard__body">
                    <Link className="postCard__heading" to={`/blog/${p.id}`}>
                      {p.title}
                    </Link>

                    <p className="postCard__excerpt">{p.excerpt}</p>

                    <div className="postCard__meta">
                      <span>📌 {p.category ?? "Tin tức"}</span>
                      <span>•</span>
                      <span>🕒 {formatDateDot(p.date)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="blogPager">
              <button
                className="blogPager__btn"
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;

                return (
                  <button
                    key={n}
                    className={`blogPager__num ${n === page ? "isActive" : ""}`}
                    type="button"
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                );
              })}

              <button
                className="blogPager__btn"
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                ›
              </button>
            </div>
          </section>

          <aside className="blogSide">
            <div className="sideCard">
              <button
                type="button"
                className="sideCard__head"
                onClick={() => setLatestOpen((v) => !v)}
                aria-expanded={latestOpen}
              >
                <span className="sideCard__title">Bài viết mới nhất</span>
                <span className={`sideCard__chev ${latestOpen ? "isOpen" : ""}`}>
                  ⌄
                </span>
              </button>

              <div
                className="latestCollapse"
                style={{ height: latestOpen ? contentH : 0 }}
              >
                <div ref={contentRef} className="latestList">
                  {newestOptions.slice(0, 4).map((p, idx) => (
                    <Link
                      key={p.id}
                      className="latestItem"
                      to={`/blog/${p.id}`}
                    >
                      <span className="latestItem__badge">{idx + 1}</span>

                      <div className="latestItem__thumb">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMG;
                          }}
                        />
                      </div>

                      <div className="latestItem__info">
                        <div className="latestItem__title">{p.title}</div>
                        <div className="latestItem__meta">
                          {p.category ?? "Tin tức"} - {formatDateDot(p.date)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Blog;