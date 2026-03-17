import { Link } from "react-router-dom";
import type { FormField } from "./types";

type Props = {
  title: string;
  breadcrumb: string;
  backLink: string;
  submitText: string;
  fields: FormField[];
};

export default function AdminCreatePage({
  title,
  breadcrumb,
  backLink,
  submitText,
  fields,
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
        <div className="adminPanel__body">
          <div className="createForm">
            {fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label>{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea />
                ) : field.type === "select" ? (
                  <select>
                    <option value="">Chọn</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <input type="file" accept="image/*" />
                ) : (
                  <input type={field.type || "text"} />
                )}
              </div>
            ))}

            <div className="createForm__actions">
              <button className="adminBtn adminBtn--green" type="button">
                {submitText}
              </button>

              <Link to={backLink} className="adminBtn adminBtn--blue">
                Quay lại
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}