import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./about.css";

const HERO_IMG =
  "https://images.unsplash.com/photo-1527979809431-9f985d18c8b2?q=80&w=1800&auto=format&fit=crop";

const IMG_1 =
  "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=1400&auto=format&fit=crop";
const IMG_2 =
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop";

const About: React.FC = () => {
  return (
    <>
      <Header />

      <main className="about">

        {/* HERO */}
        <section className="aboutHero">
          <div
            className="aboutHero__bg"
            style={{ backgroundImage: `url(${HERO_IMG})` }}
          >
            <div className="aboutHero__overlay">
              <div className="aboutHero__content">
                <h1 className="aboutHero__title">GIỚI THIỆU</h1>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="aboutSection">
          <div className="aboutContainer">
            <div className="aboutGrid2">
              <div className="aboutBlock">
                <div className="aboutKicker">VỀ CHÚNG TÔI</div>
                <h2 className="aboutHeading">THƯƠNG HIỆU FLYCAM24h</h2>
                <p className="aboutText">
                  Trong suốt 6 năm kể từ khi được thành lập, chúng tôi đã xây dựng
                  hệ thống sản phẩm và dịch vụ chất lượng, tập trung vào trải
                  nghiệm khách hàng: tư vấn rõ ràng, minh bạch thông số, bảo hành
                  nhanh và hỗ trợ kỹ thuật tận tâm.
                </p>
                <p className="aboutText">
                  Mục tiêu của chúng tôi là mang đến giải pháp thiết bị bay, phụ
                  kiện và dịch vụ sửa chữa chuyên nghiệp, giúp bạn an tâm sử dụng
                  trong công việc và đam mê.
                </p>
              </div>

              <div className="aboutBlock">
                <div className="aboutKicker">TẦM NHÌN</div>
                <h2 className="aboutHeading">ĐỒNG HÀNH CÙNG BẠN</h2>
                <p className="aboutText">
                  Với đội ngũ kỹ thuật và tư vấn giàu kinh nghiệm, chúng tôi luôn
                  cập nhật sản phẩm mới, tối ưu quy trình bảo hành – sửa chữa,
                  đảm bảo thời gian xử lý nhanh và chất lượng ổn định.
                </p>
                <p className="aboutText">
                  Chúng tôi tin rằng sự uy tín và dịch vụ hậu mãi chính là nền
                  tảng tạo nên thương hiệu lâu dài.
                </p>
              </div>
            </div>

            {/* Story row 1: Ảnh trái - chữ phải */}
            <div className="aboutStory">
              <div className="aboutStory__imgWrap">
                <div
                  className="aboutStory__img"
                  style={{ backgroundImage: `url(${IMG_1})` }}
                />
              </div>

              <div className="aboutStory__content">
                <div className="aboutKicker">THÔNG ĐIỆP TỪ CHÚNG TÔI</div>
                <h3 className="aboutHeading2">Câu chuyện thương hiệu</h3>
                <p className="aboutText">
                  Chúng tôi bắt đầu từ niềm yêu thích công nghệ và mong muốn đem
                  sản phẩm chính hãng đến gần hơn với người dùng. Từ đó phát triển
                  hệ thống bán hàng – dịch vụ sửa chữa, cung cấp giải pháp trọn
                  gói cho khách hàng cá nhân và doanh nghiệp.
                </p>
                <p className="aboutText">
                  <strong>Thương hiệu Việt, dịch vụ chuyên nghiệp.</strong>
                </p>
                <div className="aboutMeta">Thành lập: 2020</div>
              </div>
            </div>

            {/* Story row 2: chữ trái - Ảnh phải */}
            <div className="aboutStory isReverse">
              <div className="aboutStory__content">
                <div className="aboutKicker">THÔNG ĐIỆP TỪ CHÚNG TÔI</div>
                <h3 className="aboutHeading2">Câu chuyện thương hiệu</h3>
                <p className="aboutText">
                  Chúng tôi đặt trải nghiệm khách hàng lên hàng đầu: tư vấn đúng
                  nhu cầu, hướng dẫn sử dụng rõ ràng, linh kiện chuẩn và quy trình
                  bảo hành minh bạch.
                </p>
                <p className="aboutText">
                  Mỗi sản phẩm bán ra đều kèm theo cam kết hỗ trợ kỹ thuật trong
                  suốt quá trình sử dụng.
                </p>
                <div className="aboutMeta">Cam kết: Uy tín – Tận tâm</div>
              </div>

              <div className="aboutStory__imgWrap">
                <div
                  className="aboutStory__img"
                  style={{ backgroundImage: `url(${IMG_2})` }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="aboutStats">
              <div className="aboutStat">
                <div className="aboutStat__icon">✦</div>
                <div className="aboutStat__title">Đổi trả, hoàn tiền</div>
                <div className="aboutStat__desc">
                  Chính sách rõ ràng, hỗ trợ nhanh.
                </div>
              </div>

              <div className="aboutStat">
                <div className="aboutStat__icon">⛨</div>
                <div className="aboutStat__title">Chính sách bảo mật</div>
                <div className="aboutStat__desc">
                  Bảo vệ thông tin khách hàng.
                </div>
              </div>

              <div className="aboutStat">
                <div className="aboutStat__icon">☎</div>
                <div className="aboutStat__title">Hỗ trợ khách hàng 24/7</div>
                <div className="aboutStat__desc">
                  Tư vấn nhanh qua hotline & chat.
                </div>
              </div>

              <div className="aboutStat">
                <div className="aboutStat__icon">★</div>
                <div className="aboutStat__title">Thương hiệu tin chọn</div>
                <div className="aboutStat__desc">
                  Hàng chính hãng, bảo hành chuẩn.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default About;