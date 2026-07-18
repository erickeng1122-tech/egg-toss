export default function Stamp({ zh, rotate = -6, color = "var(--seal-red)", style }) {
  return (
    <span
      className="stamp"
      style={{ transform: `rotate(${rotate}deg)`, color, borderColor: color, ...style }}
    >
      {zh}
    </span>
  );
}
