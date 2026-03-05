import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./blog.css";
import { Link } from "react-router-dom";

type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author?: string;
  date: string;
  category?: string;
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1600&auto=format&fit=crop";

const Blog: React.FC = () => {
  const posts: BlogPost[] = useMemo(
    () => [
      {
        id: 1,
        title: "Hướng dẫn cách tạo mục lục bài viết",
        excerpt:
          "Trong bài viết này, tôi sẽ hướng dẫn bạn cách tạo mục lục bài viết siêu đơn giản, nhanh chóng và cực kỳ hiệu quả...",
        image:
          "https://images.unsplash.com/photo-1520975958225-2b4f1f8b4a36?q=80&w=1400&auto=format&fit=crop",
        author: "mbsc",
        date: "17 Tháng 06, 2022",
        category: "Tin tức",
      },
      {
        id: 2,
        title: "Đánh giá DJI Air 2S: Nâng cấp nổi bật, góc quay vượt trội",
        excerpt:
          "Sau sự ra mắt của DJI FPV, ngay lúc này, DJI tiếp tục công bố phiên bản flycam có nhiều nâng cấp nổi bật...",
        image:
          "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?q=80&w=1400&auto=format&fit=crop",
        author: "mbsc",
        date: "23 Tháng 05, 2022",
        category: "Tin tức",
      },
      {
        id: 3,
        title:
          "So sánh DJI Air 2S và DJI Mavic 2 Pro: Đánh giá flycam nào tốt hơn?",
        excerpt:
          "Dù cả hai cùng kích thước nhỏ gọn và nhiều tính năng nổi bật, nhưng DJI Air 2S vs DJI Mavic 2 Pro vẫn có nhiều điểm khác...",
        image:
          "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1400&auto=format&fit=crop",
        author: "mbsc",
        date: "23 Tháng 05, 2022",
        category: "Tin tức",
      },
      {
        id: 4,
        title: "Hướng dẫn làm thủ tục xin giấy phép bay flycam tại Việt Nam",
        excerpt:
          "Cách đăng ký thủ tục xin cấp giấy phép bay flycam, hồ sơ cần chuẩn bị và quy trình chi tiết, tránh những lỗi thường gặp...",
        image:
          "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1400&auto=format&fit=crop",
        author: "mbsc",
        date: "23 Tháng 05, 2022",
        category: "Tin tức",
      },
      {
        id: 5,
        title: "Kinh nghiệm chọn flycam phù hợp nhu cầu quay phim",
        excerpt:
          "Chọn flycam theo mục đích: du lịch, công trình, sự kiện, bất động sản… và các thông số bạn cần quan tâm...",
        image:
          "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1400&auto=format&fit=crop",
        author: "mbsc",
        date: "30 Tháng 06, 2022",
        category: "Tin tức",
      },
      {
        id: 6,
        title: "Những lỗi thường gặp khi sử dụng flycam và cách khắc phục",
        excerpt:
          "Pin, GPS, gimbal rung, tín hiệu yếu… Đây là những lỗi phổ biến và cách xử lý nhanh trước khi đem đi kiểm tra kỹ thuật.",
        image:
          "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=1400&auto=format&fit=crop",
        author: "mbsc",
        date: "01 Tháng 07, 2022",
        category: "Tin tức",
      },
    ],
    []
  );

  // "17 Tháng 06, 2022" => "17.06.2022"
  const formatDateDot = (s: string) => {
    const m = s.match(/(\d{1,2}).*?(\d{1,2}).*?(\d{4})/);
    if (!m) return s;
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const yy = m[3];
    return `${dd}.${mm}.${yy}`;
  };

  // Latest list
  const newestOptions = useMemo(() => posts.slice(0, 6), [posts]);
  const [latestOpen, setLatestOpen] = useState(true);

  // đo height để animation mở/đóng mượt
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [contentH, setContentH] = useState(0);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newestOptions.length]);

  // Tin tức grid + pagination
  const perPage = 4;
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(posts.length / perPage));

  const pagePosts = useMemo(() => {
    const start = (page - 1) * perPage;
    return posts.slice(start, start + perPage);
  }, [posts, page]);

  return (
    <>
      <Header />

      <main className="blogPage">
        <div className="blogWrap">
          {/* LEFT: Tin tức */}
          <section className="blogMain">
            <h1 className="blogTitle">Tin tức</h1>

            <div className="blogGrid">
              {pagePosts.map((p) => (
                <article key={p.id} className="postCard">
                  {/* ✅ dùng Link thay vì <a> */}
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
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = FALLBACK_IMG;
                      }}
                    />
                  </Link>

                  <div className="postCard__body">
                    {/* ✅ dùng Link thay vì <a> */}
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

          {/* RIGHT: Bài viết mới nhất */}
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
                    /* ✅ dùng Link thay vì <a> */
                    <Link key={p.id} className="latestItem" to={`/blog/${p.id}`}>
                      <span className="latestItem__badge">{idx + 1}</span>

                      <div className="latestItem__thumb">
                        <img
                          src={p.image}
                          alt={p.title}
                          loading="lazy"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src = FALLBACK_IMG;
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