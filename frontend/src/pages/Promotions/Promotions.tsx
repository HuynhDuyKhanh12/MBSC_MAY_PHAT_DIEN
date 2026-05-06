import React, { useEffect, useMemo, useState } from "react";
import "./promotions.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { getCouponsApi } from "../../api/modules/couponApi";

type Promotion = {
  id: string;
  title: string;
  desc: string;
  code: string;
  exp: string;
  icon?: string;
  minOrder?: string;
  condition?: string;
};

const formatVND = (n: number) =>
  Number(n || 0).toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "₫";

function normalizeArrayResponse(res: any) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
}

function formatDateVN(value?: string) {
  if (!value) return "Không giới hạn";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("vi-VN");
}

function mapCouponToPromotion(item: any): Promotion {
  const discountType = item.discountType || item.type;
  const discountValue = Number(item.discountValue || item.value || 0);
  const minOrderValue = Number(item.minOrderValue || item.minOrder || 0);

  const isPercent = discountType === "PERCENT";

  return {
    id: String(item.id),
    title:
      item.title ||
      (isPercent ? `Giảm ${discountValue}%` : `Giảm ${formatVND(discountValue)}`),
    desc:
      item.description ||
      (minOrderValue > 0
        ? `Đơn hàng từ ${formatVND(minOrderValue)}`
        : "Áp dụng cho đơn hàng hợp lệ"),
    code: item.code || "",
    exp: formatDateVN(item.endDate || item.expiredAt || item.expiresAt),
    icon: isPercent ? "🎟️" : "💸",
    minOrder: minOrderValue > 0 ? formatVND(minOrderValue) : "0₫",
    condition:
      item.condition ||
      (item.isActive === false
        ? "Mã hiện đang tạm tắt"
        : "Sao chép mã và dùng ở bước thanh toán"),
  };
}

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPromotions = async () => {
      try {
        setLoading(true);

        const res = await getCouponsApi();

        const data = normalizeArrayResponse(res)
          .filter((item: any) => !item.deletedAt)
          .filter((item: any) => item.isActive !== false)
          .map(mapCouponToPromotion);

        setPromotions(data);
      } catch (error: any) {
        console.log("Lỗi tải khuyến mãi:", error?.response?.data || error);
        setPromotions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPromotions();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return promotions;

    return promotions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        String(p.condition || "").toLowerCase().includes(q)
    );
  }, [promotions, query]);

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      alert(`Đã sao chép mã: ${code}`);
    } catch {
      alert("Không thể sao chép. Bạn hãy copy thủ công nhé.");
    }
  };

  return (
    <>
      <Header />

      <div className="promoPage">
        <div className="promoContainer">
          <div className="promoTop">
            <div>
              <h1 className="promoH1">Khuyến mãi dành cho bạn</h1>
              <div className="promoSub">
                Chọn mã và sao chép để dùng ở bước thanh toán.
              </div>
            </div>

            <div className="promoSearch">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên / mã / điều kiện..."
              />
              <span className="promoSearch__icon">🔎</span>
            </div>
          </div>

          {loading ? (
            <div className="promoEmpty">Đang tải khuyến mãi...</div>
          ) : (
            <>
              <div className="promoGrid">
                {filtered.map((p) => (
                  <div key={p.id} className="promoCard">
                    <div className="promoCard__left">
                      <div className="promoBadge">{p.icon ?? "🎁"}</div>
                    </div>

                    <div className="promoCard__mid">
                      <div className="promoCard__title">{p.title}</div>
                      <div className="promoCard__desc">{p.desc}</div>

                      <div className="promoCard__meta">
                        <div>
                          Mã: <b>{p.code}</b>
                        </div>
                        <div>HSD: {p.exp}</div>
                      </div>

                      <div className="promoCard__cond">
                        <div>
                          <span className="promoTag">Tối thiểu</span>{" "}
                          <b>{p.minOrder}</b>
                        </div>
                        <div className="promoCondText">{p.condition}</div>
                      </div>
                    </div>

                    <div className="promoCard__right">
                      <button
                        className="promoBtn"
                        type="button"
                        onClick={() => copyCode(p.code)}
                        disabled={!p.code}
                      >
                        SAO CHÉP MÃ
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="promoEmpty">
                  Không tìm thấy khuyến mãi phù hợp.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Promotions;