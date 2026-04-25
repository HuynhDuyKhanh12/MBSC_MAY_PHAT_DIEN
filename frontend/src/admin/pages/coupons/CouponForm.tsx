import type { ChangeEvent } from "react";

type CouponValue = {
  code: string;
  title: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number | string;
  startDate: string;
  endDate: string;
  isActive: boolean;
};

type Props = {
  value: CouponValue;
  setValue: React.Dispatch<React.SetStateAction<CouponValue>>;
  onSubmit: (e: React.FormEvent) => void;
  loading?: boolean;
  submitText?: string;
};

export default function CouponForm({
  value,
  setValue,
  onSubmit,
  loading = false,
  submitText = "Lưu",
}: Props) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value: v } = e.target;

    setValue((prev) => ({
      ...prev,
      [name]:
        name === "isActive"
          ? v === "true"
          : name === "discountValue"
          ? v
          : v,
    }));
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        maxWidth: 900,
        background: "#fff",
        padding: 24,
        borderRadius: 12,
        border: "1px solid #e5e7eb",
      }}
    >
      {/* CODE */}
      <div style={groupStyle}>
        <label style={labelStyle}>Code</label>
        <input
          name="code"
          value={value.code}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* TITLE */}
      <div style={groupStyle}>
        <label style={labelStyle}>Tiêu đề</label>
        <input
          name="title"
          value={value.title}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* TYPE */}
      <div style={groupStyle}>
        <label style={labelStyle}>Loại giảm</label>
        <select
          name="discountType"
          value={value.discountType}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="PERCENT">%</option>
          <option value="FIXED">VNĐ</option>
        </select>
      </div>

      {/* VALUE */}
      <div style={groupStyle}>
        <label style={labelStyle}>Giá trị giảm</label>
        <input
          type="number"
          name="discountValue"
          value={value.discountValue}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* START */}
      <div style={groupStyle}>
        <label style={labelStyle}>Ngày bắt đầu</label>
        <input
          type="date"
          name="startDate"
          value={value.startDate}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* END */}
      <div style={groupStyle}>
        <label style={labelStyle}>Ngày kết thúc</label>
        <input
          type="date"
          name="endDate"
          value={value.endDate}
          onChange={handleChange}
          style={inputStyle}
        />
      </div>

      {/* STATUS */}
      <div style={groupStyle}>
        <label style={labelStyle}>Trạng thái</label>
        <select
          name="isActive"
          value={value.isActive ? "true" : "false"}
          onChange={handleChange}
          style={inputStyle}
        >
          <option value="true">Hiển thị</option>
          <option value="false">Ẩn</option>
        </select>
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={loading}
        style={{
          height: 44,
          minWidth: 180,
          borderRadius: 8,
          border: "none",
          background: loading ? "#94a3b8" : "#1d4ed8",
          color: "#fff",
          fontWeight: 700,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Đang lưu..." : submitText}
      </button>
    </form>
  );
}

// ===== style giống UserForm =====
const groupStyle: React.CSSProperties = {
  marginBottom: 16,
};
const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: 600,
  marginBottom: 8,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  padding: "0 12px",
  background: "#fff",
};