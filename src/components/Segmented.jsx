export default function Segmented({ options, value, onChange }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "rgba(255,255,255,.06)",
        border: "1.5px solid rgba(255,255,255,.18)",
        borderRadius: 999,
        padding: 3,
        alignSelf: "flex-start",
      }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          style={{
            font: "600 14px var(--font-body)",
            padding: "8px 18px",
            borderRadius: 999,
            border: 0,
            cursor: "pointer",
            background: value === o.value ? "var(--paper)" : "transparent",
            color: value === o.value ? "var(--ink-100)" : "rgba(255,255,255,.75)",
            transition: "background .14s",
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
