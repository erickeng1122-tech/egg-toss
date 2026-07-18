import { useEffect, useRef, useState } from "react";
import Bilingual from "../components/Bilingual.jsx";
import Stamp from "../components/Stamp.jsx";
import Field from "../components/Field.jsx";
import TextInput from "../components/TextInput.jsx";
import Segmented from "../components/Segmented.jsx";
import Button from "../components/Button.jsx";
import StickFigure from "../components/StickFigure.jsx";

const HIT_WORDS = {
  egg:     ["啪!",  "中!",   "哼!"],
  cabbage: ["呸!",  "烂菜!", "活该!"],
  slap:    ["啪!",  "啪!",   "醒醒!"],
};
const HIT_EN = {
  egg:     ["SPLAT", "BULLSEYE", "TAKE THAT"],
  cabbage: ["EW",    "ROTTEN",   "DESERVED"],
  slap:    ["SLAP",  "SMACK",    "WAKE UP"],
};

export default function VentScreen({ onComplete }) {
  const [phase, setPhase] = useState("setup");
  const [name, setName] = useState("王老板");
  const [gender, setGender] = useState("M");
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [crimeText, setCrimeText] = useState("周末突然要求加班\n画饼不兑现\nPUA 打工人");
  const [weapon, setWeapon] = useState("egg");

  const [splats, setSplats] = useState([]);
  const [hits, setHits] = useState(0);
  const [slapSide, setSlapSide] = useState(null);
  const [danmaku, setDanmaku] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [projectiles, setProjectiles] = useState([]);
  const stickRef = useRef(null);
  const stageRef = useRef(null);
  const idRef = useRef(0);
  const slapTickRef = useRef(0);

  const crimes = crimeText.split("\n").map((s) => s.trim()).filter(Boolean);

  function attack() {
    if (phase !== "battle") return;
    const id = ++idRef.current;
    const stage = stageRef.current?.getBoundingClientRect();
    if (!stage) return;

    if (window.GameAudio) {
      if (weapon === "slap") window.GameAudio.slap();
      else window.GameAudio.splat(weapon);
    }

    if (crimes.length) {
      const text = crimes[Math.floor(Math.random() * crimes.length)];
      setDanmaku((d) => [...d, { id, text, y: 30 + Math.random() * 180 }]);
      setTimeout(() => setDanmaku((d) => d.filter((x) => x.id !== id)), 4000);
    }

    const i = Math.floor(Math.random() * 3);
    setFeedback({ id, zh: HIT_WORDS[weapon][i], en: HIT_EN[weapon][i] });
    setTimeout(() => setFeedback((f) => (f && f.id === id ? null : f)), 700);
    setHits((h) => h + 1);

    if (weapon === "slap") {
      slapTickRef.current += 1;
      const side = slapTickRef.current % 2 === 1 ? "L" : "R";
      setSlapSide(side);
      setTimeout(() => setSlapSide(null), 350);
      return;
    }

    // projectile arc — origin near bottom-center, target near head
    const stickRect = stickRef.current?.headRect();
    const cx = stage.width / 2;
    const cy = stage.height - 40;
    const headCx = stickRect ? stickRect.left + stickRect.width / 2 - stage.left : stage.width / 2;
    const headCy = stickRect ? stickRect.top + stickRect.height / 2 - stage.top  : stage.height * 0.35;
    const tx = headCx + (Math.random() - 0.5) * 60;
    const ty = headCy + (Math.random() - 0.2) * 80;
    setProjectiles((p) => [...p, { id, kind: weapon, sx: cx, sy: cy, tx, ty }]);

    setTimeout(() => {
      setProjectiles((p) => p.filter((x) => x.id !== id));
      const stick = stickRef.current?.headRect();
      if (stick) {
        const size = 56 + Math.random() * 24;
        const region = Math.random();
        let lx, ly;
        if (region < 0.5) {
          lx = (Math.random() - 0.5) * 70 + 110;
          ly = 30 + Math.random() * 70;
        } else if (region < 0.85) {
          lx = 80 + Math.random() * 60;
          ly = 110 + Math.random() * 80;
        } else {
          lx = 30 + Math.random() * 140;
          ly = 90 + Math.random() * 60;
        }
        setSplats((s) => [
          ...s,
          { id, kind: weapon, x: lx - size / 2, y: ly - size / 2, rot: (Math.random() - 0.5) * 80, size },
        ]);
      }
    }, 380);
  }

  function pickAvatar(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => setAvatarUrl(ev.target.result);
    r.readAsDataURL(f);
  }

  if (phase === "setup") {
    return (
      <div className="screen" data-mode="vent">
        <div className="grain-layer" />
        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column",
          padding: "56px 20px 24px", overflowY: "auto",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <Bilingual zh="登记倒霉鬼" en="register the target" />
            <Stamp zh="发泄" rotate={-8} />
          </div>

          <div style={{
            background: "rgba(255,255,255,.04)",
            border: "1.5px solid rgba(255,255,255,.12)",
            borderRadius: 20, padding: 18,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            {/* avatar uploader */}
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <label style={{ cursor: "pointer", position: "relative" }}>
                <input type="file" accept="image/*" onChange={pickAvatar} style={{ display: "none" }} />
                <div style={{
                  width: 72, height: 72, borderRadius: "50%",
                  background: avatarUrl ? `center/cover url(${avatarUrl})` : "rgba(242,183,46,.18)",
                  border: "2px dashed var(--vent-yolk)",
                  display: "grid", placeItems: "center",
                  color: "var(--vent-yolk)", font: "700 22px var(--font-display)",
                  filter: avatarUrl ? "sepia(.2)" : "none",
                }}>{avatarUrl ? "" : "+"}</div>
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ font: "600 14px var(--font-body)", color: "var(--paper)" }}>头像 · upload photo</span>
                <span style={{ font: "400 12px var(--font-body)", color: "rgba(255,255,255,.55)" }}>会自动只留头部 · head only</span>
              </div>
            </div>

            <Field label="姓名 · name">
              <TextInput value={name} onChange={setName} />
            </Field>
            <Field label="性别 · gender">
              <Segmented
                options={[{ value: "M", label: "男·M" }, { value: "F", label: "女·F" }]}
                value={gender}
                onChange={setGender}
              />
            </Field>
            <Field label="罪行 · crimes (one per line)">
              <textarea
                value={crimeText}
                onChange={(e) => setCrimeText(e.target.value)}
                placeholder="他犯了什么罪? 一行一条"
                style={{
                  font: "400 15px/1.5 var(--font-body)", color: "var(--paper)",
                  background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.18)",
                  borderRadius: 12, padding: "10px 12px", outline: "none", width: "100%",
                  minHeight: 96, resize: "none",
                }}
              />
              <span style={{
                font: "500 11px var(--font-body-en)", color: "rgba(255,255,255,.5)",
                marginTop: 2, letterSpacing: ".06em",
              }}>
                {crimes.length} {crimes.length === 1 ? "crime" : "crimes"} · 会作为弹幕飘过
              </span>
            </Field>
          </div>

          <div style={{ flex: 1, minHeight: 16 }} />

          <Button
            variant="vent"
            onClick={() => setPhase("battle")}
            style={{ width: "100%", height: 56, font: "700 18px var(--font-display)", marginTop: 16 }}
          >
            开扔! · LET FLY
          </Button>
        </div>
      </div>
    );
  }

  // BATTLE
  return (
    <div className="screen" data-mode="vent">
      <div className="grain-layer" />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "56px 20px 8px",
        }}>
          <button onClick={() => setPhase("setup")} style={{
            background: "rgba(255,255,255,.08)", border: 0, color: "var(--paper)",
            padding: "8px 12px", borderRadius: 999, cursor: "pointer",
            font: "600 13px var(--font-body)",
          }}>← 返回</button>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1 }}>
            <div className="t-num" style={{ color: "var(--vent-yolk)", fontSize: 22 }}>+{hits}</div>
            <div style={{
              font: "500 10px var(--font-body-en)", letterSpacing: ".1em",
              color: "var(--ink-40)", textTransform: "uppercase",
            }}>HITS</div>
          </div>
          <Button
            variant="merit"
            onClick={() => onComplete && onComplete(hits)}
            style={{ height: 36, padding: "0 14px", font: "700 13px var(--font-body)" }}
          >完成 →</Button>
        </div>

        {/* Stage with stick figure + danmaku layer */}
        <div ref={stageRef} style={{
          flex: 1, position: "relative", display: "flex",
          justifyContent: "center", alignItems: "center", overflow: "hidden",
        }}>
          {/* danmaku layer */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
            {danmaku.map((d) => (
              <div key={d.id} style={{
                position: "absolute", top: d.y, right: -300, whiteSpace: "nowrap",
                font: "700 18px var(--font-display)", color: "var(--vent-yolk)",
                textShadow: "2px 2px 0 var(--vent-vermilion-2), 0 2px 6px rgba(0,0,0,.5)",
                animation: "danmaku 4s linear forwards",
                background: "rgba(26,22,18,.5)", padding: "4px 12px", borderRadius: 6,
                border: "1.5px solid var(--vent-vermilion)",
              }}>{d.text}</div>
            ))}
          </div>

          {/* stick figure */}
          <div style={{ position: "relative" }}>
            <StickFigure ref={stickRef} avatarUrl={avatarUrl} name={name} slapSide={slapSide} splats={splats} />
          </div>

          {/* projectiles */}
          {projectiles.map((p) => <Projectile key={p.id} {...p} />)}

          {/* hit feedback */}
          {feedback && (
            <div style={{
              position: "absolute", top: "22%", left: "50%", transform: "translate(-50%, -50%)",
              font: "700 56px var(--font-display)", color: "var(--vent-yolk)",
              textShadow: "4px 4px 0 var(--vent-vermilion-2)", letterSpacing: ".04em",
              pointerEvents: "none", animation: "hitPop 600ms var(--ease-snap) both",
            }}>
              {feedback.zh}
              <div style={{
                font: "600 14px var(--font-body-en)", letterSpacing: ".15em",
                color: "var(--paper)", marginTop: 4, textAlign: "center",
              }}>{feedback.en}</div>
            </div>
          )}
        </div>

        {/* Bottom: weapon picker + attack button + reset */}
        <div style={{
          padding: "8px 20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <WeaponPicker value={weapon} onChange={setWeapon} />
          <button
            onClick={attack}
            style={{
              width: 96, height: 96, borderRadius: 999, border: 0, cursor: "pointer",
              background: "var(--vent-vermilion)", color: "var(--paper)",
              font: "700 18px var(--font-display)",
              boxShadow: "0 6px 0 var(--vent-vermilion-2), 0 12px 28px rgba(0,0,0,.5)",
              transition: "transform .08s var(--ease-snap)", flexShrink: 0,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.94) translateY(3px)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
          >
            {weapon === "slap" ? "扇!" : "扔!"}
          </button>
          <button
            onClick={() => { setSplats([]); setHits(0); }}
            style={{
              background: "transparent", border: "1.5px solid rgba(255,255,255,.2)",
              color: "var(--paper)", padding: "10px 12px", borderRadius: 12, cursor: "pointer",
              font: "600 12px var(--font-body)", lineHeight: 1.2,
            }}
          >
            清空
            <br />
            <span style={{ font: "500 9px var(--font-body-en)", letterSpacing: ".1em", opacity: .7 }}>RESET</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function WeaponPicker({ value, onChange }) {
  const opts = [
    { v: "egg",     zh: "鸡蛋", en: "EGG",    emoji: "🥚", color: "var(--vent-yolk)" },
    { v: "cabbage", zh: "烂菜", en: "ROTTEN", emoji: "🥬", color: "var(--vent-cabbage)" },
    { v: "slap",    zh: "耳光", en: "SLAP",   emoji: "👋", color: "var(--vent-vermilion)" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {opts.map((o) => {
        const active = value === o.v;
        return (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            style={{
              width: 60, height: 68, borderRadius: 14, border: 0, cursor: "pointer",
              background: active ? "rgba(255,255,255,.14)" : "rgba(255,255,255,.04)",
              outline: active ? `2px solid ${o.color}` : "none",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 4, padding: 4,
            }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{o.emoji}</span>
            <span style={{
              font: "600 10px var(--font-body)", color: o.color,
              lineHeight: 1, whiteSpace: "nowrap",
            }}>{o.zh}</span>
          </button>
        );
      })}
    </div>
  );
}

function Projectile({ kind, sx, sy, tx, ty }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.animate(
      [
        { transform: `translate(${sx}px, ${sy}px) rotate(0deg)`,                                       offset: 0   },
        { transform: `translate(${(sx + tx) / 2}px, ${Math.min(sy, ty) - 120}px) rotate(180deg)`,      offset: 0.5 },
        { transform: `translate(${tx}px, ${ty}px) rotate(360deg)`,                                     offset: 1   },
      ],
      { duration: 380, easing: "cubic-bezier(.4,.1,.7,1)", fill: "forwards" }
    );
  }, [sx, sy, tx, ty]);
  const emoji = kind === "egg" ? "🥚" : "🥬";
  return (
    <div ref={ref} style={{
      position: "absolute", width: 36, height: 36, top: 0, left: 0,
      pointerEvents: "none", fontSize: 30, lineHeight: 1,
      filter: "drop-shadow(0 2px 4px rgba(0,0,0,.5))",
    }}>{emoji}</div>
  );
}
