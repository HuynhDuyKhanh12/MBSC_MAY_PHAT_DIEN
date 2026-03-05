import React, { useMemo, useState } from "react";
import "./promotions.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

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

const Promotions: React.FC = () => {
  const promotions = useMemo<Promotion[]>(
    () => [
      {
        id: "FREESHIP300",
        title: "Miễn phí vận chuyển",
        desc: "Đơn hàng từ 300k",
        code: "A87TYRT55",
        exp: "10/04/2026",
        icon: "🚚",
        minOrder: "300.000₫",
        condition: "Áp dụng cho đơn giao hàng tiêu chuẩn",
      },
      {
        id: "SALE20",
        title: "Giảm 20%",
        desc: "Đơn hàng từ 200k",
        code: "QH5G8J0Y",
        exp: "05/05/2026",
        icon: "🎟️",
        minOrder: "200.000₫",
        condition: "Không áp dụng chung với mã khác",
      },
      {
        id: "SALE50K",
        title: "Giảm 50.000₫",
        desc: "Đơn hàng từ 500k",
        code: "FLY50K",
        exp: "30/06/2026",
        icon: "💸",
        minOrder: "500.000₫",
        condition: "Áp dụng cho toàn bộ sản phẩm",
      },
      {
        id: "NEWUSER10",
        title: "Khách mới giảm 10%",
        desc: "Tối đa 150k",
        code: "NEW10",
        exp: "31/12/2026",
        icon: "🆕",
        minOrder: "0₫",
        condition: "Chỉ áp dụng cho đơn đầu tiên",
      },
    ],
    []
  );

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return promotions;
    return promotions.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
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
                  >
                    SAO CHÉP MÃ
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="promoEmpty">Không tìm thấy khuyến mãi phù hợp.</div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Promotions;