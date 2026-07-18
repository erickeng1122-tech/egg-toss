export default function Button({ variant = "primary", children, onClick, disabled, style }) {
  return (
    <button
      className={"btn btn-" + variant}
      disabled={disabled}
      onClick={onClick}
      style={{ opacity: disabled ? 0.4 : 1, ...style }}
    >
      {children}
    </button>
  );
}
