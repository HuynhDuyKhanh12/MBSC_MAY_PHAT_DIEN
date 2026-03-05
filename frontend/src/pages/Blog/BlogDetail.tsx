import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./blog-detail.css";

type BlogPost = {
  id: number;
  title: string;
  image: string;
  date: string; // "17 Tháng 06, 2022"
  category?: string;
  contentHtml: string; // nội dung bài viết (HTML)
};

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1600&auto=format&fit=crop";

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const postId = Number(id);

  // ✅ TẠM: dữ liệu mock (sau này bạn lấy API)
  const posts: BlogPost[] = useMemo(
    () => [
      {
        id: 1,
        title: "Hướng dẫn cách tạo mục lục bài viết",
        image:
          "https://images.unsplash.com/photo-1520975958225-2b4f1f8b4a36?q=80&w=1600&auto=format&fit=crop",
        date: "17 Tháng 06, 2022",
        category: "Tin tức",
        contentHtml: `
          <p>Trong bài viết này, tôi sẽ hướng dẫn bạn cách tạo mục lục bài viết siêu đơn giản...</p>
          <h2>1. Lợi ích của việc tạo mục lục</h2>
          <ul>
            <li>Giúp người đọc dễ theo dõi</li>
            <li>Tối ưu trải nghiệm</li>
            <li>Hỗ trợ SEO tốt hơn</li>
          </ul>
          <h2>2. Cách tạo mục lục bài viết</h2>
          <p>Bạn có thể dùng plugin hoặc tự code...</p>
          <blockquote>Mẹo: hãy đặt các heading H2/H3 hợp lý.</blockquote>
          <h2>3. Tùy chỉnh mục lục</h2>
          <p>Thêm style, highlight mục đang đọc...</p>
        `,
      },
      {
        id: 2,
        title: "Đánh giá DJI Air 2S: Nâng cấp nổi bật, góc quay vượt trội",
        image:
          "https://images.unsplash.com/photo-1508615070457-7baeba4003ab?q=80&w=1600&auto=format&fit=crop",
        date: "23 Tháng 05, 2022",
        category: "Tin tức",
        contentHtml: `
          <p>DJI Air 2S mang đến cảm biến lớn hơn, quay 5.4K, chống rung tốt...</p>
          <h2>Thông số nổi bật</h2>
          <ul><li>Quay 5.4K</li><li>Cảm biến 1 inch</li><li>ActiveTrack</li></ul>
          <h2>Trải nghiệm thực tế</h2>
          <p>Bay ổn định, pin tốt, chất lượng hình ảnh vượt trội...</p>
        `,
      },
      {
        id: 3,
        title: "So sánh DJI Air 2S và DJI Mavic 2 Pro: Đánh giá flycam nào tốt hơn?",
        image:
          "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?q=80&w=1600&auto=format&fit=crop",
        date: "23 Tháng 05, 2022",
        category: "Tin tức",
        contentHtml: `
          <p>Cả Air 2S và Mavic 2 Pro đều mạnh, nhưng khác nhau về cảm biến, giá và tính năng.</p>
          <h2>So sánh nhanh</h2>
          <p>Air 2S: nhẹ, mới, giá tốt. Mavic 2 Pro: cảm biến Hasselblad...</p>
        `,
      },
      {
        id: 4,
        title: "Hướng dẫn làm thủ tục xin giấy phép bay flycam tại Việt Nam",
        image:
          "https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1600&auto=format&fit=crop",
        date: "23 Tháng 05, 2022",
        category: "Tin tức",
        contentHtml: `
          <p>Để xin giấy phép bay flycam bạn cần chuẩn bị hồ sơ, bản đồ khu vực bay...</p>
          <h2>Hồ sơ cần có</h2>
          <ul><li>Đơn xin phép</li><li>CMND/CCCD</li><li>Bản đồ khu vực</li></ul>
          <h2>Nộp hồ sơ ở đâu?</h2>
          <p>Tuỳ khu vực, bạn nộp theo hướng dẫn cơ quan chức năng...</p>
        `,
      },
    ],
    []
  );

  const post = posts.find((p) => p.id === postId);

  const formatDateDot = (s: string) => {
    const m = s.match(/(\d{1,2}).*?(\d{1,2}).*?(\d{4})/);
    if (!m) return s;
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const yy = m[3];
    return `${dd}.${mm}.${yy}`;
  };

  // sidebar newest accordion
  const newestOptions = posts.slice(0, 6);
  const [latestOpen, setLatestOpen] = useState(true);

  // related posts (3 bài khác)
  const related = posts.filter((p) => p.id !== postId).slice(0, 3);

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
            {/* LEFT: content */}
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
                    const img = e.currentTarget;
                    img.onerror = null;
                    img.src = FALLBACK_IMG;
                  }}
                />
              </div>

              {/* Nội dung bài viết */}
              <div
                className="bdContent"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />

              {/* Related */}
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
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src = FALLBACK_IMG;
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

            {/* RIGHT: sidebar newest */}
            <aside className="bdSide">
              <div className="sideCard">
                <button
                  type="button"
                  className="sideCard__head"
                  onClick={() => setLatestOpen((v) => !v)}
                >
                  <span className="sideCard__title">Bài viết mới nhất</span>
                  <span className={`sideCard__chev ${latestOpen ? "isOpen" : ""}`}>
                    ⌄
                  </span>
                </button>

                {latestOpen && (
                  <div className="latestList">
                    {newestOptions.slice(0, 4).map((p, idx) => (
                      <Link key={p.id} className="latestItem" to={`/blog/${p.id}`}>
                        <span className="latestItem__badge">{idx + 1}</span>

                        <div className="latestItem__thumb">
                          <img
                            src={p.image}
                            alt={p.title}
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