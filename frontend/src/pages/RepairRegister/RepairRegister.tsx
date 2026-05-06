import React, { useMemo, useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./repair-register.css";
import { createServiceRequestApi } from "../../api/modules/serviceRequestApi";

type ServiceType = "warranty" | "repair";

type FormState = {
  serviceType: ServiceType;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  productName: string;
  model: string;
  serial: string;
  purchaseDate: string;
  invoiceNo: string;
  problem: string;
  preferredDate: string;
  preferredTime: string;
  note: string;
};

const initState: FormState = {
  serviceType: "warranty",
  fullName: "",
  phone: "",
  email: "",
  address: "",
  productName: "",
  model: "",
  serial: "",
  purchaseDate: "",
  invoiceNo: "",
  problem: "",
  preferredDate: "",
  preferredTime: "",
  note: "",
};

const RepairRegister: React.FC = () => {
  const [form, setForm] = useState<FormState>(initState);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState("");
  const [err, setErr] = useState("");

  const title = useMemo(() => {
    return form.serviceType === "warranty"
      ? "Đăng ký bảo hành"
      : "Đăng ký sửa chữa";
  }, [form.serviceType]);

  const onChange =
    (key: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const validate = (): string | null => {
    if (!form.fullName.trim()) return "Vui lòng nhập họ tên.";
    if (!form.phone.trim()) return "Vui lòng nhập số điện thoại.";
    if (!form.address.trim()) return "Vui lòng nhập địa chỉ.";
    if (!form.productName.trim()) return "Vui lòng nhập tên sản phẩm.";
    if (!form.problem.trim()) return "Vui lòng mô tả lỗi / yêu cầu.";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDone("");
    setErr("");

    const msg = validate();
    if (msg) {
      setErr(msg);
      return;
    }

    const fullName = form.fullName.trim();
    const phone = form.phone.trim();
    const email = form.email.trim();
    const address = form.address.trim();
    const productName = form.productName.trim();
    const model = form.model.trim();
    const serial = form.serial.trim();
    const problem = form.problem.trim();
    const note = form.note.trim();

    try {
      setLoading(true);

      const payload = {
        customerName: fullName,
        customerPhone: phone,
        customerEmail: email || undefined,

        province: address,
        district: "Chưa nhập",
        ward: "Chưa nhập",
        detailAddress: address,

        productName,
        model: model || undefined,
        serialNumber: serial || undefined,
        purchaseDate: form.purchaseDate || undefined,
        invoiceNo: form.invoiceNo || undefined,

        type: form.serviceType === "warranty" ? "MAINTENANCE" : "REPAIR",

        issueTitle: `${
          form.serviceType === "warranty" ? "Bảo hành" : "Sửa chữa"
        } - ${productName}`,
        description: problem,
        issueDescription: problem,

        preferredDate: form.preferredDate || undefined,
        preferredTime: form.preferredTime || undefined,
        note: note || undefined,
      };

      const res = await createServiceRequestApi(payload);

      setDone(
        res?.message ||
          "Đã gửi đăng ký thành công! Bộ phận kỹ thuật sẽ liên hệ sớm."
      );

      setForm(initState);
    } catch (error: any) {
      const data = error?.response?.data || error;

      console.log("REPAIR REGISTER ERROR:", data);

      setErr(
        typeof data?.message === "string"
          ? data.message
          : JSON.stringify(data, null, 2)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="rr">
        <div className="rr__container">
          <div className="rr__head">
            <h1 className="rr__title">Quản lý sửa chữa</h1>
            <p className="rr__sub">
              Vui lòng điền thông tin để đăng ký{" "}
              <b>{form.serviceType === "warranty" ? "bảo hành" : "sửa chữa"}</b>.
            </p>
          </div>

          <div className="rr__card">
            <div className="rr__tabs" role="tablist" aria-label="service type">
              <button
                type="button"
                className={`rr__tab ${
                  form.serviceType === "warranty" ? "is-active" : ""
                }`}
                onClick={() =>
                  setForm((p) => ({ ...p, serviceType: "warranty" }))
                }
                disabled={loading}
              >
                Đăng ký bảo hành
              </button>

              <button
                type="button"
                className={`rr__tab ${
                  form.serviceType === "repair" ? "is-active" : ""
                }`}
                onClick={() =>
                  setForm((p) => ({ ...p, serviceType: "repair" }))
                }
                disabled={loading}
              >
                Đăng ký sửa chữa
              </button>
            </div>

            <form className="rr__form" onSubmit={onSubmit}>
              <h2 className="rr__sectionTitle">{title}</h2>

              {(err || done) && (
                <div className={`rr__alert ${err ? "is-error" : "is-success"}`}>
                  {err || done}
                </div>
              )}

              <div className="rr__grid">
                <div className="rr__field">
                  <label>Họ và tên *</label>
                  <input
                    value={form.fullName}
                    onChange={onChange("fullName")}
                    placeholder="VD: Huỳnh Duy Khánh"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Số điện thoại *</label>
                  <input
                    value={form.phone}
                    onChange={onChange("phone")}
                    placeholder="VD: 09xxxxxxxx"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Email</label>
                  <input
                    value={form.email}
                    onChange={onChange("email")}
                    placeholder="VD: you@email.com"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field rr__field--full">
                  <label>Địa chỉ / Tỉnh thành *</label>
                  <input
                    value={form.address}
                    onChange={onChange("address")}
                    placeholder="VD: TP.HCM, Bến Tre..."
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Tên sản phẩm *</label>
                  <input
                    value={form.productName}
                    onChange={onChange("productName")}
                    placeholder="VD: Máy phát điện diesel 10KVA"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Model</label>
                  <input
                    value={form.model}
                    onChange={onChange("model")}
                    placeholder="VD: KUBOTA-10KVA"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Serial</label>
                  <input
                    value={form.serial}
                    onChange={onChange("serial")}
                    placeholder="Số serial trên máy"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Ngày mua</label>
                  <input
                    type="date"
                    value={form.purchaseDate}
                    onChange={onChange("purchaseDate")}
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Số hoá đơn</label>
                  <input
                    value={form.invoiceNo}
                    onChange={onChange("invoiceNo")}
                    placeholder="Nếu có"
                    disabled={loading}
                  />
                </div>

                <div className="rr__field rr__field--full">
                  <label>Mô tả lỗi / yêu cầu *</label>
                  <textarea
                    value={form.problem}
                    onChange={onChange("problem")}
                    rows={4}
                    placeholder="VD: Máy khó nổ, chạy rung mạnh, báo lỗi..."
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Ngày hẹn</label>
                  <input
                    type="date"
                    value={form.preferredDate}
                    onChange={onChange("preferredDate")}
                    disabled={loading}
                  />
                </div>

                <div className="rr__field">
                  <label>Giờ hẹn</label>
                  <input
                    type="time"
                    value={form.preferredTime}
                    onChange={onChange("preferredTime")}
                    disabled={loading}
                  />
                </div>

                <div className="rr__field rr__field--full">
                  <label>Ghi chú thêm</label>
                  <textarea
                    value={form.note}
                    onChange={onChange("note")}
                    rows={3}
                    placeholder="VD: gửi hình, yêu cầu kỹ thuật..."
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="rr__actions">
                <button className="rr__btn" type="submit" disabled={loading}>
                  {loading ? "Đang gửi..." : "Gửi đăng ký"}
                </button>

                <button
                  className="rr__btn rr__btn--ghost"
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setErr("");
                    setDone("");
                    setForm(initState);
                  }}
                >
                  Nhập lại
                </button>
              </div>

              <p className="rr__hint">
                Sau khi gửi, hệ thống sẽ chuyển thông tin về bộ phận quản trị.
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RepairRegister;