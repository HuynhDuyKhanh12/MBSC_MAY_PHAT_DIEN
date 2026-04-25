import { Link } from "react-router-dom";
  subtitle,
  actionLabel,
  actionTo,
  extra,
  children,
}: Props) {
  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: 28 }}>{title}</h2>
          {subtitle ? (
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>{subtitle}</p>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {extra}
          {actionLabel && actionTo ? (
            <Link to={actionTo}>
              <button
                style={{
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "none",
                  background: "#2563eb",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {actionLabel}
              </button>
            </Link>
          ) : null}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}