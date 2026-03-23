import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { FormField } from "./types";

type Props = {
  title: string;
  breadcrumb: string;
  backLink: string;
  submitText: string;
  fields: FormField[];
  onSubmit?: (formData: any) => void;
  initialValues?: Record<string, any>;
};

export default function AdminCreatePage({
  title,
  breadcrumb,
  backLink,
  submitText,
  fields,
  onSubmit,
  initialValues,
}: Props) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});

  useEffect(() => {
    setFormData(initialValues || {});
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

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
          <form className="createForm" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div className="form-group" key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>

                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                ) : field.type === "select" ? (
                  <select
                    id={field.name}
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  >
                    <option value="">Chọn</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : field.type === "file" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      id={field.name}
                      name={field.name}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, field.name)}
                    />

                    {(formData.imagePreview || formData.image) && (
                      <img
                        src={formData.imagePreview || formData.image}
                        alt="preview"
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          borderRadius: 8,
                          border: "1px solid #ddd",
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type || "text"}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}

            <div className="createForm__actions">
              <button className="adminBtn adminBtn--green" type="submit">
                {submitText}
              </button>

              <Link to={backLink} className="adminBtn adminBtn--blue">
                Quay lại
              </Link>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}