export default function Bilingual({ zh, en, className = "", style }) {
  return (
    <span className={"bilingual " + className} style={style}>
      <span className="zh">{zh}</span>
      {en && <span className="en">{en}</span>}
    </span>
  );
}
