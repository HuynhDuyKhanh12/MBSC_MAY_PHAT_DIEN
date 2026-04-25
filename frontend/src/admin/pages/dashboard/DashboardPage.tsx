const cards = [
  { label: "Người dùng", value: 0 },
  { label: "Brand", value: 0 },
  { label: "Danh mục", value: 0 },
  { label: "Sản phẩm", value: 0 },
  { label: "Đơn hàng", value: 0 },
  { label: "Phiếu dịch vụ", value: 0 },
];

export default function DashboardPage() {
  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginTop: 0, marginBottom: 20 }}>Dashboard admin</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 20,
              boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
            }}
          >
            <div style={{ color: "#6b7280", marginBottom: 10 }}>{card.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{card.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}