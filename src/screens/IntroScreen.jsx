// IntroScreen — bilingual rules + start CTA. Sets the cathartic tone up-front.

const RULES = [
  { emoji: "🥚", zh: "登记倒霉鬼", en: "Register the target", body: "上传头像，列出他的罪状 — 老板、同事、前任、扣你工资的房东、随便谁。" },
  { emoji: "👋", zh: "扔! 砸! 扇!", en: "Throw, smash, slap",  body: "鸡蛋直接糊脸，烂菜叶随便挂，耳光左右开弓。罪行会一条一条飘过。" },
  { emoji: "🪷", zh: "积点功德",   en: "Earn some merit",      body: "扔够了换种姿态。佛、基督、伊斯兰 — 按你信的来，把火气消一消。" },
];

export default function IntroScreen({ onStart, onSkipToMerit, bank = 0 }) {
  return (
    <div className="screen" data-mode="vent">
      <div className="grain-layer" />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column",
        padding: "62px 22px 28px", overflowY: "auto",
      }}>
        {/* Logo lockup */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, background: "var(--seal-red)", borderRadius: 6,
            display: "grid", placeItems: "center",
            font: "400 36px var(--font-brush)", color: "var(--paper)",
            boxShadow: "var(--shadow-stamp)",
            transform: "rotate(-4deg)",
          }}>扔</div>
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <div style={{
              font: "400 30px var(--font-display)", color: "var(--paper)",
              lineHeight: 1, whiteSpace: "nowrap",
            }}>扔鸡蛋</div>
            <div style={{
              font: "600 11px var(--font-body-en)", letterSpacing: ".18em",
              color: "var(--vent-yolk)", marginTop: 4,
            }}>EGG · TOSS</div>
          </div>
        </div>

        {/* tagline */}
        <h1 style={{
          font: "700 30px/1.1 var(--font-display)", color: "var(--paper)",
          marginTop: 22, letterSpacing: "-.01em",
        }}>
          老板今天让你<br />
          <span style={{ color: "var(--vent-yolk)" }}>气炸了</span>?
        </h1>
        <p style={{
          font: "400 14px/1.5 var(--font-body)",
          color: "rgba(247,241,226,.7)",
          marginTop: 8, fontStyle: "italic",
        }}>
          Pissed at your boss / coworker / landlord / ex / whoever?<br />
          Hurl some eggs, then go earn it back.
        </p>

        {/* rules cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18, flex: 1 }}>
          {RULES.map((r, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              background: "rgba(255,255,255,.05)",
              border: "1.5px solid rgba(255,255,255,.1)",
              borderRadius: 14, padding: "12px 14px",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "rgba(242,183,46,.15)",
                display: "grid", placeItems: "center", fontSize: 20,
                border: "1px solid rgba(242,183,46,.4)",
              }}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ font: "700 16px var(--font-display)", color: "var(--paper)" }}>{r.zh}</span>
                  <span style={{
                    font: "500 10px var(--font-body-en)", letterSpacing: ".1em",
                    textTransform: "uppercase", color: "rgba(242,183,46,.85)",
                  }}>{r.en}</span>
                </div>
                <div style={{
                  font: "400 12.5px/1.5 var(--font-body)",
                  color: "rgba(247,241,226,.65)", marginTop: 4,
                }}>{r.body}</div>
              </div>
            </div>
          ))}
        </div>

        <p style={{
          font: "400 11px/1.4 var(--font-body)",
          color: "rgba(247,241,226,.4)", textAlign: "center",
          marginTop: 14, marginBottom: 10, fontStyle: "italic",
        }}>
          仅供发泄，并无恶意 · purely cathartic, no real harm intended
        </p>

        <button
          onClick={onStart}
          style={{
            width: "100%", height: 56, borderRadius: 999, border: 0, cursor: "pointer",
            background: "var(--seal-red)", color: "var(--paper)",
            font: "700 18px var(--font-display)", letterSpacing: ".02em",
            boxShadow: "0 6px 0 #6B1810, 0 12px 28px rgba(0,0,0,.5)",
            transition: "transform .12s var(--ease-snap)",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "translateY(2px)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        >
          开始 · BEGIN
        </button>

        {/* Skip-to-merit path — for days you don't want to vent, just bank some merit. */}
        <button
          onClick={onSkipToMerit}
          style={{
            width: "100%", height: 44, borderRadius: 999, marginTop: 10,
            background: "transparent", cursor: "pointer",
            border: "1.5px solid var(--merit-gold)",
            color: "var(--merit-gold)",
            font: "600 14px var(--font-body)", letterSpacing: ".01em",
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            transition: "transform .12s var(--ease-snap), background-color .14s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        >
          <span>今天直接积功德 · just earn merit</span>
          {bank > 0 && (
            <span style={{
              font: "700 11px/1 var(--font-num)",
              padding: "3px 7px", borderRadius: 999,
              background: "rgba(200,162,75,.16)",
              border: "1px solid rgba(200,162,75,.5)",
              letterSpacing: ".04em",
            }}>+{bank}</span>
          )}
        </button>
      </div>
    </div>
  );
}
