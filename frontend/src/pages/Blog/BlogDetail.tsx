import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./blog-detail.css";
import { getBlogByIdApi, getBlogsApi } from "../../api/modules/blogApi";

type BlogPost = {
  id: number;
  title: string;
  image: string;
  date: string;
  category?: string;
  contentHtml: string;
  excerpt?: string;
};

const API_URL = "http://localhost:5000";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1600&q=80";

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Cách chọn máy phát điện phù hợp cho gia đình",
    image:
      "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-01",
    category: "Hướng dẫn",
    excerpt:
      "Hướng dẫn chọn công suất máy phát điện phù hợp với nhu cầu sử dụng.",
    contentHtml: `
      <p>Máy phát điện gia đình cần chọn đúng công suất để đảm bảo hoạt động ổn định và tiết kiệm nhiên liệu.</p>
      <h2>1. Xác định thiết bị cần dùng</h2>
      <p>Bạn nên liệt kê các thiết bị như đèn, quạt, tủ lạnh, máy bơm, máy lạnh...</p>
      <h2>2. Chọn công suất dư</h2>
      <p>Nên chọn máy có công suất dư khoảng 20% - 30% so với tổng tải sử dụng.</p>
    `,
  },
  {
    id: 2,
    title: "Bao lâu nên bảo trì máy phát điện một lần?",
    image:
      "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-05",
    category: "Bảo trì",
    excerpt: "Bảo trì định kỳ giúp máy phát điện hoạt động ổn định.",
    contentHtml: `
      <p>Bảo trì máy phát điện định kỳ giúp tăng tuổi thọ máy và tránh hư hỏng nặng.</p>
      <h2>1. Kiểm tra dầu nhớt</h2>
      <p>Dầu nhớt cần được thay đúng thời gian khuyến nghị của nhà sản xuất.</p>
      <h2>2. Kiểm tra lọc gió và bugi</h2>
      <p>Lọc gió bẩn hoặc bugi yếu có thể làm máy khó nổ.</p>
    `,
  },
  {
    id: 3,
    title: "Dấu hiệu máy phát điện cần được kiểm tra ngay",
    image:
      "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-10",
    category: "Sửa chữa",
    excerpt: "Máy khó nổ, điện áp yếu hoặc tiếng máy lạ là dấu hiệu cần kiểm tra.",
    contentHtml: `
      <p>Khi máy phát điện có dấu hiệu bất thường, bạn nên kiểm tra sớm để tránh lỗi nặng hơn.</p>
      <h2>Dấu hiệu thường gặp</h2>
      <ul>
        <li>Máy khó khởi động</li>
        <li>Điện áp không ổn định</li>
        <li>Máy phát tiếng kêu lạ</li>
        <li>Hao nhiên liệu bất thường</li>
      </ul>
    `,
  },
  {
    id: 4,
    title: "Nên chọn máy phát điện xăng hay dầu?",
    image:
      "https://images.unsplash.com/photo-1581091215367-59e0a46fe7dd?auto=format&fit=crop&w=1400&q=80",
    date: "2026-04-15",
    category: "Tư vấn",
    excerpt: "So sánh ưu nhược điểm giữa máy phát điện xăng và dầu.",
    contentHtml: `
      <p>Máy phát điện xăng thường phù hợp gia đình nhỏ, còn máy dầu phù hợp công suất lớn và chạy lâu.</p>
      <h2>Máy xăng</h2>
      <p>Dễ khởi động, tiếng ồn thấp hơn, phù hợp nhu cầu nhỏ.</p>
      <h2>Máy dầu</h2>
      <p>Bền, tiết kiệm nhiên liệu hơn khi chạy công suất lớn.</p>
    `,
  },
];

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function normalizeObjectResponse(res: any) {
  return res?.data?.data || res?.data || res || null;
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
    image: getImageSrc(item.image || item.thumbnail || item.cover),
    date: item.createdAt || item.updatedAt || item.date || "Chưa có ngày",
    category: item.category?.name || item.category || "Tin tức",
    excerpt:
      item.excerpt ||
      item.shortDescription ||
      item.description ||
      "Chưa có mô tả bài viết.",
    contentHtml:
      item.contentHtml ||
      item.content ||
      item.description ||
      item.excerpt ||
      "Chưa có nội dung bài viết.",
  };
}

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>(DEFAULT_POSTS);
  const [loading, setLoading] = useState(false);
  const [latestOpen, setLatestOpen] = useState(true);

  useEffect(() => {
    const loadBlogDetail = async () => {
      try {
        setLoading(true);

        const [detailRes, listRes] = await Promise.all([
          getBlogByIdApi(postId),
          getBlogsApi(),
        ]);

        const detailData = normalizeObjectResponse(detailRes);
        const listData = normalizeArrayResponse(listRes)
          .filter((item: any) => !item.deletedAt)
          .map(mapApiBlog);

        setPost(detailData ? mapApiBlog(detailData) : null);
        setPosts(listData.length > 0 ? listData : DEFAULT_POSTS);
      } catch (error) {
        console.log("Backend chưa có API blog detail, dùng data mẫu:", error);

        const found = DEFAULT_POSTS.find((p) => p.id === postId) || null;
        setPost(found);
        setPosts(DEFAULT_POSTS);
      } finally {
        setLoading(false);
      }
    };

    if (Number.isFinite(postId)) {
      loadBlogDetail();
    }
  }, [postId]);

  const newestOptions = useMemo(() => posts.slice(0, 6), [posts]);

  const related = useMemo(() => {
    if (!post) return [];
    return posts.filter((p) => p.id !== post.id).slice(0, 3);
  }, [posts, post]);

  if (loading) {
    return (
      <>
        <Header />
        <main className="bdPage">
          <div className="bdWrap">
            <h1 className="bdTitle">Đang tải bài viết...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Header />
        <main className="bdPage">
          <div className="bdWrap">
            <h1 className="bdTitle">Không tìm thấy bài viết</h1>
            <Link className="bdBack" to="/blog">
              ← Quay lại Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="bdPage">
        <div className="bdWrap">
          <div className="bdGrid">
            <article className="bdMain">
              <h1 className="bdH1">{post.title}</h1>

              <div className="bdMeta">
                <span>{post.category ?? "Tin tức"}</span>
                <span>•</span>
                <span>{formatDateDot(post.date)}</span>
              </div>

              <div className="bdHero">
                <img
                  src={post.image}
                  alt={post.title}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                />
              </div>

              <div
                className="bdContent"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />

              <section className="bdRelated">
                <div className="bdRelated__head">Bài viết liên quan</div>

                <div className="bdRelated__grid">
                  {related.map((r) => (
                    <Link key={r.id} to={`/blog/${r.id}`} className="relCard">
                      <div className="relCard__img">
                        <img
                          src={r.image}
                          alt={r.title}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = FALLBACK_IMG;
                          }}
                        />
                      </div>

                      <div className="relCard__title">{r.title}</div>

                      <div className="relCard__meta">
                        {r.category ?? "Tin tức"} - {formatDateDot(r.date)}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </article>

            <aside className="bdSide">
              <div className="sideCard">
                <button
                  type="button"
                  className="sideCard__head"
                  onClick={() => setLatestOpen((v) => !v)}
                >
                  <span className="sideCard__title">Bài viết mới nhất</span>
                  <span
                    className={`sideCard__chev ${latestOpen ? "isOpen" : ""}`}
                  >
                    ⌄
                  </span>
                </button>

                {latestOpen && (
                  <div className="latestList">
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
                )}
              </div>

              <Link className="bdBack" to="/blog">
                ← Quay lại Blog
              </Link>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default BlogDetail;