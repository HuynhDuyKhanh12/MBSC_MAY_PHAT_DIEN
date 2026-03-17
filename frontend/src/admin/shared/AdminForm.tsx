import type { FormField } from "./types";

type AdminFormProps = {
  title: string;
  fields: FormField[];
  buttonText: string;
};

export default function AdminForm({
  title,
  fields,
  buttonText,
}: AdminFormProps) {
  return (
    <section className="card">
      <h3>{title}</h3>

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

      <button className="btn btn--green" type="button">
        {buttonText}
      </button>
    </section>
  );
}