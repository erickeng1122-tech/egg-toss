export default function TextInput({ value, onChange, placeholder, dark = true }) {
  const styleDark = {
    font: "400 16px var(--font-body)", color: "var(--paper)",
    background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.18)",
    borderRadius: 12, padding: "12px 14px", outline: "none", width: "100%",
  };
  const styleLight = {
    font: "400 16px var(--font-body)", color: "var(--ink-100)",
    background: "var(--paper-3)", border: "1.5px solid var(--ink-20)",
    borderRadius: 12, padding: "12px 14px", outline: "none", width: "100%",
  };
  return (
    <input
      style={dark ? styleDark : styleLight}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
