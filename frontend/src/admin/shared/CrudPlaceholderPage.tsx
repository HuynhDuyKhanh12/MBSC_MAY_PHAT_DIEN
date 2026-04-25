import { Link } from "react-router-dom";
  { id: 1, name: "Bản ghi mẫu 1", status: "Đang hoạt động", description: "Dữ liệu mẫu để hiển thị khung admin" },
  { id: 2, name: "Bản ghi mẫu 2", status: "Đang hoạt động", description: "Bạn thay bằng dữ liệu API thật sau" },
];

export default function CrudPlaceholderPage({ title, createTo, createLabel = "Thêm mới", trashTo }: Props) {
  return (
    <AdminPageShell
      title={title}
      subtitle="Khung CRUD dùng chung cho trang admin"
      actionLabel={createTo ? createLabel : undefined}
      actionTo={createTo}
      extra={
        trashTo ? (
          <Link to={trashTo}>
            <button
              style={{
                padding: "10px 16px",
                borderRadius: 10,
                border: "1px solid #d1d5db",
                background: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Thùng rác
            </button>
          </Link>
        ) : null
      }
    >
      <AdminTable
        data={mockData}
        columns={[
          { key: "id", title: "ID", render: (row) => row.id, width: 80 },
          { key: "name", title: "Tên", render: (row) => row.name },
          { key: "description", title: "Mô tả", render: (row) => row.description || "-" },
          { key: "status", title: "Trạng thái", render: (row) => row.status || "-", width: 180 },
          {
            key: "actions",
            title: "Hành động",
            width: 260,
            render: () => (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button style={btn("#f59e0b")}>Sửa</button>
                <button style={btn("#ef4444")}>Xóa</button>
                <button style={btn("#2563eb")}>Xem</button>
              </div>
            ),
          },
        ]}
      />
    </AdminPageShell>
  );
}

function btn(bg: string): React.CSSProperties {
  return {
    padding: "8px 14px",
    borderRadius: 8,
    border: "none",
    background: bg,
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  };
}