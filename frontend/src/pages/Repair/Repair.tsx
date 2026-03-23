import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./repair.css";

type ServiceType = "Bảo hành" | "Sửa chữa";

const Repair: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    productName: "",
    serialNumber: "",
    serviceType: "Bảo hành" as ServiceType,
    problem: "",
    note: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Dữ liệu đăng ký:", formData);
    alert("Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn sớm.");
    
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      address: "",
      productName: "",
      serialNumber: "",
      serviceType: "Bảo hành",
      problem: "",
      note: "",
    });
  };

  return (
    <>
      <Header />

      <main className="repairPage">
        <section className="repairHero">
          <div className="repairContainer">
            <div className="repairHero__content">
              <span className="repairHero__badge">FLYCAM24H</span>
              <h1 className="repairHero__title">Đăng ký sửa chữa / bảo hành</h1>
              <p className="repairHero__desc">
                Điền đầy đủ thông tin để đội ngũ kỹ thuật tiếp nhận nhanh chóng,
                hỗ trợ kiểm tra, sửa chữa hoặc bảo hành sản phẩm cho bạn.
              </p>
            </div>
          </div>
        </section>

        <section className="repairSection">
          <div className="repairContainer">
            <div className="repairGrid">
              <div className="repairInfo">
                <h2 className="repairInfo__title">Thông tin hỗ trợ</h2>

                <div className="repairInfo__card">
                  <h3>Quy trình tiếp nhận</h3>
                  <ul>
                    <li>Tiếp nhận thông tin đăng ký từ khách hàng</li>
                    <li>Kiểm tra tình trạng sản phẩm</li>
                    <li>Xác nhận phương án sửa chữa hoặc bảo hành</li>
                    <li>Liên hệ bàn giao sản phẩm sau khi hoàn tất</li>
                  </ul>
                </div>

                <div className="repairInfo__card">
                  <h3>Lưu ý</h3>
                  <ul>
                    <li>Vui lòng cung cấp đúng số điện thoại để được liên hệ</li>
                    <li>Mô tả lỗi càng chi tiết càng tốt</li>
                    <li>Giữ lại phiếu mua hàng hoặc thông tin đơn hàng nếu có</li>
                  </ul>
                </div>

                <div className="repairInfo__contact">
                  <div><strong>Hotline:</strong> 0909 123 456</div>
                  <div><strong>Email:</strong> hotro@flycam24h.vn</div>
                  <div><strong>Địa chỉ:</strong> 182 Lê Đại Hành, Quận 11, TP.HCM</div>
                </div>
              </div>

              <div className="repairFormWrap">
                <form className="repairForm" onSubmit={handleSubmit}>
                  <h2 className="repairForm__title">Phiếu đăng ký</h2>

                  <div className="repairForm__grid">
                    <div className="repairField">
                      <label>Họ và tên</label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                        required
                      />
                    </div>

                    <div className="repairField">
                      <label>Số điện thoại</label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </div>

                    <div className="repairField">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email"
                      />
                    </div>

                    <div className="repairField">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>

                    <div className="repairField">
                      <label>Tên sản phẩm</label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="Ví dụ: DJI Phantom 4"
                        required
                      />
                    </div>

                    <div className="repairField">
                      <label>Số serial</label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        placeholder="Nhập số serial sản phẩm"
                      />
                    </div>

                    <div className="repairField repairField--full">
                      <label>Loại dịch vụ</label>
                      <select
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                      >
                        <option value="Bảo hành">Bảo hành</option>
                        <option value="Sửa chữa">Sửa chữa</option>
                      </select>
                    </div>

                    <div className="repairField repairField--full">
                      <label>Mô tả lỗi / tình trạng sản phẩm</label>
                      <textarea
                        name="problem"
                        value={formData.problem}
                        onChange={handleChange}
                        placeholder="Mô tả lỗi sản phẩm..."
                        rows={5}
                        required
                      />
                    </div>

                    <div className="repairField repairField--full">
                      <label>Ghi chú thêm</label>
                      <textarea
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Thông tin bổ sung nếu có..."
                        rows={4}
                      />
                    </div>
                  </div>

                  <button className="repairSubmit" type="submit">
                    Gửi đăng ký
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Repair;