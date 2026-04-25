type Props = {
  data: any[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggle?: (id: number) => void;
};

export default function CrudTable({
  data,
  loading,
  onEdit,
  onDelete,
  onToggle,
}: Props) {
  if (loading) return <p>Đang tải...</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ background: "#f1f5f9" }}>
          <th style={th}>ID</th>
          <th style={th}>Tên</th>
          <th style={th}>Hình</th>
          <th style={th}>Mô tả</th>
          <th style={th}>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item) => (
          <tr key={item.id}>
            <td style={td}>{item.id}</td>
            <td style={td}>{item.name}</td>

            <td style={td}>
              {item.image ? (
                <img
                  src={item.image}
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
              ) : (
                "No image"
              )}
            </td>

            <td style={td}>{item.description}</td>

            <td style={td}>
              <button onClick={() => onEdit(item.id)}>Sửa</button>
              <button onClick={() => onDelete(item.id)}>Xóa</button>
              {onToggle && (
                <button onClick={() => onToggle(item.id)}>Ẩn/Hiện</button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const th = { padding: 10, borderBottom: "1px solid #ddd" };
const td = { padding: 10 };