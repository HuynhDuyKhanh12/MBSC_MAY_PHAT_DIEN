type BrandTableProps = {
  brands: any[];
  onEdit: (item: any) => void;
  onDelete: (id: number) => void;
  onToggleVisibility: (id: number) => void;
};

export default function BrandTable({
  brands,
  onEdit,
  onDelete,
  onToggleVisibility,
}: BrandTableProps) {
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
        {brands.length === 0 ? (
          <tr>
            <td colSpan={4} style={{ textAlign: "center", padding: 20 }}>
              Không có brand nào
            </td>
          </tr>
        ) : (
          brands.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.slug}</td>
              <td style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button type="button" onClick={() => onEdit(item)}>
                  Sửa
                </button>

                <button type="button" onClick={() => onDelete(item.id)}>
                  Xóa
                </button>

                <button type="button" onClick={() => onToggleVisibility(item.id)}>
                  Ẩn / Hiện
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}