type BrandTrashTableProps = {
  trash: any[];
  onRestore: (id: number) => void;
  onForceDelete: (id: number) => void;
};

export default function BrandTrashTable({
  trash,
  onRestore,
  onForceDelete,
}: BrandTrashTableProps) {
  return (
    <table
      width="100%"
      cellPadding={10}
      style={{ background: "#fff", borderCollapse: "collapse", borderRadius: 12 }}
    >
      <thead>
        <tr>
          <th>ID</th>
          <th>Tên</th>
          <th>Slug</th>
          <th>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {trash.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
              Thùng rác trống
            </td>
          </tr>
        ) : (
          trash.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.slug}</td>
              <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" onClick={() => onRestore(item.id)}>
                  Khôi phục
                </button>

                <button type="button" onClick={() => onForceDelete(item.id)}>
                  Xóa vĩnh viễn
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}