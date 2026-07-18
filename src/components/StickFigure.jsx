import { forwardRef, useImperativeHandle, useRef } from "react";

// StickFigure — animated stick man with the user's avatar as a circular head.
// Body wobbles continuously; arms react to slaps; splats stick on body regions.
// Imperative handle exposes headRect() so VentScreen can target the head.

const StickFigure = forwardRef(function StickFigure(
  { avatarUrl, name, slapSide, splats },
  ref
) {
  const headRef = useRef(null);
  useImperativeHandle(ref, () => ({
    headRect: () => headRef.current?.getBoundingClientRect() || null,
  }));

  const W = 220, H = 340;

  return (
    <div style={{
      position: "relative", width: W, height: H,
      display: "flex", justifyContent: "center", alignItems: "flex-end",
    }}>
      {/* spotlight */}
      <div style={{
        position: "absolute", top: -20, left: "50%", transform: "translateX(-50%)",
        width: 320, height: 360, borderRadius: "50%",
        background: "radial-gradient(closest-side, rgba(242,183,46,.12), transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      {/* full figure with continuous wobble */}
      <div style={{
        position: "absolute", left: 0, top: 0, width: W, height: H,
        animation: "stickWobble 3.4s ease-in-out infinite",
        transformOrigin: "50% 100%",
      }}>
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          <ellipse cx={W / 2} cy={H - 6} rx="60" ry="6" fill="rgba(0,0,0,.45)" />
          <line x1={W / 2} y1="120" x2={W / 2} y2="148" stroke="var(--paper)" strokeWidth="3" strokeLinecap="round" />
          <line x1={W / 2} y1="148" x2={W / 2} y2="232" stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
          {/* left arm */}
          <line
            x1={W / 2} y1="160"
            x2={slapSide === "L" ? W / 2 - 78 : 50}
            y2={slapSide === "L" ? 92 : 200}
            stroke="var(--paper)" strokeWidth="3" strokeLinecap="round"
            style={{ transition: "all .18s var(--ease-snap)" }}
          />
          {/* right arm */}
          <line
            x1={W / 2} y1="160"
            x2={slapSide === "R" ? W / 2 + 78 : W - 50}
            y2={slapSide === "R" ? 92 : 200}
            stroke="var(--paper)" strokeWidth="3" strokeLinecap="round"
            style={{ transition: "all .18s var(--ease-snap)" }}
          />
          {/* legs */}
          <line x1={W / 2} y1="232" x2={W / 2 - 30} y2={H - 14} stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
          <line x1={W / 2} y1="232" x2={W / 2 + 30} y2={H - 14} stroke="var(--paper)" strokeWidth="4" strokeLinecap="round" />
          {/* tie — reads as office worker */}
          <polygon
            points={`${W / 2 - 7},152 ${W / 2 + 7},152 ${W / 2 + 5},170 ${W / 2},182 ${W / 2 - 5},170`}
            fill="var(--vent-vermilion)" stroke="var(--vent-vermilion-2)" strokeWidth="1"
          />
        </svg>

        {/* HEAD — DOM element so we can use the avatar image */}
        <div ref={headRef} style={{
          position: "absolute", left: "50%", top: 28, transform: "translateX(-50%)",
          width: 96, height: 96, borderRadius: "50%",
          overflow: "hidden",
          background: avatarUrl ? "transparent" : "linear-gradient(135deg, #C8A24B, #8B5E3C)",
          border: "3px solid var(--paper)",
          boxShadow: "0 4px 12px rgba(0,0,0,.5)",
          zIndex: 2,
          ...(slapSide ? { animation: `slapShake${slapSide} .3s` } : {}),
        }}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={name}
              style={{
                width: "100%", height: "100%", objectFit: "cover",
                filter: "sepia(.25) saturate(1.05) contrast(1.05)",
                WebkitMaskImage: "radial-gradient(circle at 50% 45%, black 58%, transparent 92%)",
                maskImage: "radial-gradient(circle at 50% 45%, black 58%, transparent 92%)",
              }}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%", display: "grid", placeItems: "center",
              color: "var(--vent-ink)", font: "700 40px var(--font-display)",
            }}>{(name || "?").slice(0, 1)}</div>
          )}
        </div>

        {/* SPLAT layer — stuck on body */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 3 }}>
          {splats.map((s) => (
            <div
              key={s.id}
              className="splat-stick"
              style={{
                position: "absolute", left: s.x, top: s.y,
                width: s.size, height: s.size,
                "--rot": s.rot + "deg",
                animation: "splatPop 240ms var(--ease-snap) both",
              }}
            >
              {s.kind === "egg" ? <EggSplat /> : <CabbageSplat />}
            </div>
          ))}
        </div>

        {/* Slap impact mark */}
        {slapSide && (
          <div style={{
            position: "absolute",
            left: slapSide === "L" ? "calc(50% - 60px)" : "calc(50% + 12px)",
            top: 60, width: 56, height: 56,
            color: "var(--vent-yolk)", font: "700 36px var(--font-display)",
            display: "grid", placeItems: "center",
            animation: "slapMark .35s var(--ease-snap)", pointerEvents: "none",
            zIndex: 4, textShadow: "2px 2px 0 var(--vent-vermilion-2)",
          }}>★</div>
        )}
      </div>
    </div>
  );
});

export default StickFigure;

// ─────── Splat artwork ───────

function EggSplat() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="yolk" cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor="#FFD86B" />
          <stop offset="70%" stopColor="#F2B72E" />
          <stop offset="100%" stopColor="#C28D14" />
        </radialGradient>
        <radialGradient id="white" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#FFF8E0" stopOpacity=".95" />
          <stop offset="80%" stopColor="#F7EFCC" stopOpacity=".75" />
          <stop offset="100%" stopColor="#F7EFCC" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="
        M 50 50
        m -34 -8
        c -6 4, -8 14, -2 18
        c -4 6, 0 14, 8 14
        c 2 8, 12 12, 18 6
        c 6 8, 18 6, 22 -2
        c 8 2, 16 -6, 12 -14
        c 6 -6, 4 -16, -4 -18
        c -2 -10, -14 -14, -22 -8
        c -8 -8, -22 -6, -32 4 Z
      " fill="url(#white)" />
      <ellipse cx="22" cy="78" rx="3"   ry="8" fill="#F7EFCC" opacity=".7" />
      <ellipse cx="78" cy="80" rx="2.5" ry="6" fill="#F7EFCC" opacity=".7" />
      <ellipse cx="62" cy="86" rx="2"   ry="5" fill="#F7EFCC" opacity=".6" />
      <ellipse cx="50" cy="48" rx="16"  ry="13" fill="url(#yolk)" />
      <ellipse cx="46" cy="44" rx="5"   ry="3"  fill="#FFE9A6" opacity=".7" />
      <g fill="#F4ECD8" stroke="#9C9286" strokeWidth="0.8">
        <path d="M 18 30 Q 14 24 22 22 Q 30 22 32 28 Q 26 32 18 30 Z" />
        <path d="M 76 32 Q 84 30 84 38 Q 82 44 74 42 Q 70 36 76 32 Z" />
      </g>
      <circle cx="14" cy="56" r="2.5" fill="#F2B72E" />
      <circle cx="86" cy="60" r="2"   fill="#F2B72E" />
      <circle cx="68" cy="22" r="1.8" fill="#FFF8E0" />
    </svg>
  );
}

function CabbageSplat() {
  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%" style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id="rot" cx="50%" cy="50%" r="60%">
          <stop offset="0%"  stopColor="#9DB85A" />
          <stop offset="60%" stopColor="#6B8F3C" />
          <stop offset="100%" stopColor="#3F5A22" />
        </radialGradient>
      </defs>
      <path d="
        M 50 50
        m -32 -6
        c -8 6, -6 18, 4 20
        c -2 10, 8 16, 16 12
        c 4 10, 18 8, 22 -2
        c 10 4, 18 -6, 14 -16
        c 6 -8, 0 -18, -10 -18
        c -6 -10, -22 -10, -28 -2
        c -8 -2, -16 0, -18 6 Z
      " fill="url(#rot)" />
      <ellipse cx="36" cy="42" rx="7" ry="5" fill="#C8A24B" opacity=".7" />
      <ellipse cx="62" cy="56" rx="6" ry="4" fill="#9C7A2E" opacity=".55" />
      <path d="M 20 50 Q 50 46 80 52" stroke="#3F5A22" strokeWidth="1.5" fill="none" />
      <path d="M 30 38 Q 50 50 70 38" stroke="#3F5A22" strokeWidth="1"   fill="none" opacity=".7" />
      <path d="M 18 40 Q 22 30 32 30 Q 24 38 24 44 Z" fill="#7DA044" />
      <path d="M 78 60 Q 86 58 86 70 Q 80 66 76 64 Z" fill="#7DA044" />
      <ellipse cx="28" cy="78" rx="2.2" ry="6" fill="#3F5A22" opacity=".7" />
      <ellipse cx="72" cy="82" rx="2"   ry="5" fill="#3F5A22" opacity=".7" />
      <circle cx="44" cy="52" r="2"   fill="#1F3010" />
      <circle cx="58" cy="44" r="1.5" fill="#1F3010" />
    </svg>
  );
}
