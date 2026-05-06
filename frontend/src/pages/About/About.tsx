import React, { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./about.css";

import { getProductsApi } from "../../api/modules/productApi";
import { getBrandsApi } from "../../api/modules/brandApi";
import { getCategoriesApi } from "../../api/modules/categoryApi";

const HERO_IMG =
  "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1800&q=80";

const IMG_1 =
  "https://images.unsplash.com/photo-1581093588401-12f6d7c8b2e4?auto=format&fit=crop&w=1400&q=80";

const IMG_2 =
  "https://images.unsplash.com/photo-1581092919531-4d4a7d9e7e1e?auto=format&fit=crop&w=1400&q=80";

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

const About: React.FC = () => {
  const [productCount, setProductCount] = useState(0);
  const [brandCount, setBrandCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        setLoading(true);

        const [productRes, brandRes, categoryRes] = await Promise.all([
          getProductsApi(),
          getBrandsApi(),
          getCategoriesApi(),
        ]);

        const products = normalizeArrayResponse(productRes).filter(
          (item: any) => !item.deletedAt
        );

        const brands = normalizeArrayResponse(brandRes).filter(
          (item: any) => !item.deletedAt
        );

        const categories = normalizeArrayResponse(categoryRes).filter(
          (item: any) => !item.deletedAt
        );

        setProductCount(products.length);
        setBrandCount(brands.length);
        setCategoryCount(categories.length);
      } catch (error) {
        console.log("Lỗi tải dữ liệu About:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  return (
    <>
      <Header />

      <main className="about">
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

        <section className="aboutSection">
          <div className="aboutContainer">
            <div className="aboutGrid2">
              <div className="aboutBlock">
                <div className="aboutKicker">VỀ CHÚNG TÔI</div>
                <h2 className="aboutHeading">MBSC MÁY PHÁT ĐIỆN</h2>
                <p className="aboutText">
                  Chúng tôi cung cấp máy phát điện, phụ kiện và dịch vụ bảo trì
                  sửa chữa chuyên nghiệp. Dữ liệu sản phẩm, thương hiệu và danh
                  mục được kết nối trực tiếp từ hệ thống backend.
                </p>
                <p className="aboutText">
                  Mục tiêu của chúng tôi là mang đến sản phẩm chính hãng, tư vấn
                  rõ ràng, bảo hành nhanh và hỗ trợ kỹ thuật tận tâm.
                </p>
              </div>

              <div className="aboutBlock">
                <div className="aboutKicker">TẦM NHÌN</div>
                <h2 className="aboutHeading">ĐỒNG HÀNH CÙNG KHÁCH HÀNG</h2>
                <p className="aboutText">
                  Với đội ngũ kỹ thuật giàu kinh nghiệm, chúng tôi luôn tối ưu
                  quy trình bán hàng, bảo trì và sửa chữa để khách hàng yên tâm
                  sử dụng.
                </p>
                <p className="aboutText">
                  Uy tín, chất lượng và dịch vụ hậu mãi là nền tảng phát triển
                  lâu dài của MBSC.
                </p>
              </div>
            </div>

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
                  MBSC bắt đầu từ nhu cầu cung cấp giải pháp máy phát điện ổn
                  định cho gia đình, công trình và doanh nghiệp.
                </p>
                <p className="aboutText">
                  <strong>Thương hiệu Việt, dịch vụ chuyên nghiệp.</strong>
                </p>
                <div className="aboutMeta">Cam kết: Uy tín – Tận tâm</div>
              </div>
            </div>

            <div className="aboutStory isReverse">
              <div className="aboutStory__content">
                <div className="aboutKicker">DỮ LIỆU HỆ THỐNG</div>
                <h3 className="aboutHeading2">Kết nối backend</h3>
                <p className="aboutText">
                  Trang giới thiệu này đã kết nối API để lấy số lượng sản phẩm,
                  thương hiệu và danh mục từ database.
                </p>
                <p className="aboutText">
                  Khi admin thêm sản phẩm, thương hiệu hoặc danh mục, số liệu ở
                  đây sẽ tự cập nhật.
                </p>
                <div className="aboutMeta">
                  {loading ? "Đang tải dữ liệu..." : "Dữ liệu đã kết nối API"}
                </div>
              </div>

              <div className="aboutStory__imgWrap">
                <div
                  className="aboutStory__img"
                  style={{ backgroundImage: `url(${IMG_2})` }}
                />
              </div>
            </div>

            <div className="aboutStats">
              <div className="aboutStat">
                <div className="aboutStat__icon">⚙️</div>
                <div className="aboutStat__title">
                  {loading ? "..." : productCount} sản phẩm
                </div>
                <div className="aboutStat__desc">
                  Sản phẩm lấy trực tiếp từ backend.
                </div>
              </div>

              <div className="aboutStat">
                <div className="aboutStat__icon">🏷️</div>
                <div className="aboutStat__title">
                  {loading ? "..." : brandCount} thương hiệu
                </div>
                <div className="aboutStat__desc">
                  Thương hiệu được quản lý trong admin.
                </div>
              </div>

              <div className="aboutStat">
                <div className="aboutStat__icon">📂</div>
                <div className="aboutStat__title">
                  {loading ? "..." : categoryCount} danh mục
                </div>
                <div className="aboutStat__desc">
                  Danh mục đồng bộ từ database.
                </div>
              </div>

              <div className="aboutStat">
                <div className="aboutStat__icon">☎</div>
                <div className="aboutStat__title">Hỗ trợ 24/7</div>
                <div className="aboutStat__desc">
                  Tư vấn nhanh qua hotline và chat.
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