export default function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ font: "500 13px/1 var(--font-body)", color: "rgba(255,255,255,.7)" }}>
        {label}
      </span>
      {children}
    </label>
  );
}
