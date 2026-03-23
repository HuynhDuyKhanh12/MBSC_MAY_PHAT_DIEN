type Column = {
  key: string;
  label: string;
};

type RowData = Record<string, any>;

type Props = {
  columns: Column[];
  rows: RowData[];
  onView?: (id: number) => void;
  onDelete?: (id: number) => void;
  onToggleStatus?: (id: number) => void;
};

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "14px 12px",
  background: "#f8f8f8",
  whiteSpace: "nowrap" as const,
  fontWeight: 700,
  fontSize: 16,
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "14px 12px",
  verticalAlign: "middle" as const,
  fontSize: 15,
};

const iconButtonStyle = (bg: string) => ({
  border: "none",
  width: 42,
  height: 42,
  borderRadius: 8,
  background: bg,
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
  padding: 0,
});

export default function ReviewTable({
  columns,
  rows,
  onView,
  onDelete,
  onToggleStatus,
}: Props) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
        }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...thStyle,
                  textAlign:
                    col.key === "id" ||
                    col.key === "userId" ||
                    col.key === "productId" ||
                    col.key === "rating"
                      ? "center"
                      : "left",
                }}
              >
                {col.label}
              </th>
            ))}

            <th
              style={{
                ...thStyle,
                textAlign: "center",
                minWidth: 150,
              }}
            >
              Chức năng
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id ?? index}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={{
                    ...tdStyle,
                    textAlign:
                      col.key === "id" ||
                      col.key === "userId" ||
                      col.key === "productId" ||
                      col.key === "rating"
                        ? "center"
                        : "left",
                  }}
                >
                  {row[col.key]}
                </td>
              ))}

              <td
                style={{
                  ...tdStyle,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <button
                    onClick={() => onToggleStatus?.(row.id)}
                    title={row.status ? "Đang hiển thị" : "Đang ẩn"}
                    style={{
                      width: 46,
                      height: 26,
                      borderRadius: 999,
                      border: "none",
                      background: row.status ? "#22c55e" : "#cbd5e1",
                      position: "relative",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        top: 2,
                        left: row.status ? 22 : 2,
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.18)",
                      }}
                    />
                  </button>

                  <button
                    onClick={() => onView?.(row.id)}
                    title="Xem"
                    style={iconButtonStyle("#0ea5e9")}
                  >
                    <EyeIcon />
                  </button>

                  <button
                    onClick={() => onDelete?.(row.id)}
                    title="Xóa"
                    style={iconButtonStyle("#ef4444")}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                style={{
                  border: "1px solid #ddd",
                  padding: "20px",
                  textAlign: "center",
                  color: "#666",
                  fontSize: 15,
                }}
              >
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}