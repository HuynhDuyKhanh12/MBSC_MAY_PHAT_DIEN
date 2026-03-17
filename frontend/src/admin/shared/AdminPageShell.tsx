import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaTrashAlt, FaSearch } from "react-icons/fa";

type FilterOption = {
  label: string;
  options: string[];
};

type Props = {
  title: string;
  breadcrumb: string;
  searchPlaceholder?: string;
  filters?: FilterOption[];
  addLink: string;
  trashLink?: string;
  children: ReactNode;
};

export default function AdminPageShell({
  title,
  breadcrumb,
  searchPlaceholder = "Tìm kiếm...",
  filters = [],
  addLink,
  trashLink = "#",
  children,
}: Props) {
  return (
    <div className="adminPageShell">
      <div className="adminPageShell__head">
        <h1 className="adminPageShell__title">{title}</h1>

        <div className="adminPageShell__breadcrumb">
          <span>Trang chủ</span>
          <span>/</span>
          <span>{breadcrumb}</span>
        </div>
      </div>

      <section className="adminPanel">
        <div className="adminToolbar">
          <div className="adminToolbar__left">
            <span className="adminToolbar__label">Lọc theo:</span>

            <input
              className="adminInput"
              placeholder={searchPlaceholder}
              type="text"
            />

            {filters.map((filter) => (
              <select className="adminSelect" key={filter.label}>
                <option value="">{filter.label}</option>
                {filter.options.map((option) => (
                  <option value={option} key={option}>
                    {option}
                  </option>
                ))}
              </select>
            ))}

            <button className="adminBtn adminBtn--blue" type="button">
              <FaSearch />
              <span>Tìm kiếm</span>
            </button>
          </div>

          <div className="adminToolbar__right">
            <Link to={addLink} className="adminBtn adminBtn--green">
              <FaPlus />
              <span>Thêm</span>
            </Link>

            <Link to={trashLink} className="adminBtn adminBtn--red">
              <FaTrashAlt />
              <span>Thùng rác</span>
            </Link>
          </div>
        </div>

        <div className="adminPanel__body">{children}</div>
      </section>
    </div>
  );
}