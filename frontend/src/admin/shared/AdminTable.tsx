type Column<T> = {
  emptyText?: string;
};

export default function AdminTable<T>({
  columns,
  data,
  loading = false,
  emptyText = "Không có dữ liệu",
}: Props<T>) {
  return (
    <div style={{ overflowX: "auto" }}>
      {loading ? (
        <p style={{ padding: 20, margin: 0 }}>Đang tải...</p>
      ) : (
        <table style={{ width: "100%", minWidth: 1000, borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    padding: "14px 16px",
                    textAlign: "left",
                    borderBottom: "1px solid #e5e7eb",
                    whiteSpace: "nowrap",
                    width: col.width,
                  }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 24, textAlign: "center", color: "#6b7280" }}>
                  {emptyText}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} style={{ borderTop: "1px solid #f1f5f9" }}>
                  {columns.map((col) => (
                    <td key={col.key} style={{ padding: "14px 16px", verticalAlign: "middle" }}>
                      {col.render(row, index)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}