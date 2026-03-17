import { FaEye, FaEdit, FaTrash, FaToggleOn } from "react-icons/fa";
import type { RowData, TableColumn } from "./types";

type Props = {
  title?: string;
  columns: TableColumn[];
  rows: RowData[];
};

export default function AdminTable({ title, columns, rows }: Props) {
  return (
    <section className="card card--table">
      {title ? <h3>{title}</h3> : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={col.key === "image" ? "image-cell" : ""}
                >
                  {col.label}
                </th>
              ))}
              <th className="action-cell">Chức năng</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.key === "image" ? "image-cell" : ""}
                  >
                    {col.key === "image" ? (
                      <img
                        src={row[col.key]}
                        alt={row.name || row.title || "image"}
                        className="table-image"
                      />
                    ) : col.key === "type" && row[col.key] ? (
                      <span className="status-badge">{String(row[col.key])}</span>
                    ) : (
                      String(row[col.key] ?? "")
                    )}
                  </td>
                ))}

                <td className="action-cell">
                  <div className="action-group">
                    <button className="action-btn status" title="Trạng thái" type="button">
                      <FaToggleOn />
                    </button>
                    <button className="action-btn view" title="Xem" type="button">
                      <FaEye />
                    </button>
                    <button className="action-btn edit" title="Sửa" type="button">
                      <FaEdit />
                    </button>
                    <button className="action-btn delete" title="Xóa" type="button">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}