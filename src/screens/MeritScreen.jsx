import { useEffect, useRef, useState } from "react";
import Bilingual from "../components/Bilingual.jsx";
import Button from "../components/Button.jsx";

// ─── Static content ──────────────────────────────────────────
const RELIGIONS = [
  { id: "buddhist",  zh: "佛教",       en: "Buddhist",  emoji: "🪷",  color: "var(--merit-wood)", bg: "var(--merit-rice)" },
  { id: "christian", zh: "基督 / 天主", en: "Christian", emoji: "✝︎",  color: "#5C7A8A",           bg: "#EEF1F0" },
  { id: "muslim",    zh: "伊斯兰",      en: "Muslim",    emoji: "☪︎",  color: "#3A6B4E",           bg: "#F0EBDC" },
];

const SUTRAS = [
  { id: "heart",   zh: "心經",  en: "Heart Sutra",       excerpt: "色不异空，空不异色。" },
  { id: "diamond", zh: "金剛經", en: "Diamond Sutra",     excerpt: "凡所有相，皆是虚妄。" },
  { id: "great",   zh: "大悲咒", en: "Great Compassion",  excerpt: "南无喝啰怛那哆啰夜耶。" },
];

const CONFESSIONS_EN = [
  "I, uh, I sent a passive-aggressive email today.",
  "I called my boss a clown. In my head. Repeatedly.",
  "I ate the last dumpling without asking.",
  "I lied about being on a call to skip a meeting.",
  "I gossiped. A lot. It felt great.",
];
const CONFESSIONS_ZH = [
  "神父我又对老板翻白眼了…",
  "我吃了同事冰箱里的最后一颗布丁。",
  "我假装在开会其实在刷手机。",
  "我把客户拉黑了之后又解封又拉黑。",
  "我说了三句假话，但其中一句是善意的。",
];

const DUAS = [
  { zh: "原谅我今天的暴脾气",   en: "Forgive my temper today" },
  { zh: "让我心平气和",       en: "Grant me patience" },
  { zh: "原谅我背地里说过的话", en: "Forgive my unkind words" },
  { zh: "让我睡个好觉",       en: "Let me sleep peacefully" },
];

// ─── Top-level dispatcher ─────────────────────────────────────
export default function MeritScreen({ sinsToOffset = 0, startingMerit = 0, onDone }) {
  const [chosen, setChosen] = useState(null);
  // Start from the persisted bank — earning is additive on top of what's saved.
  const [merit, setMerit] = useState(startingMerit);

  if (!chosen) {
    return <ReligionPicker onPick={setChosen} sinsToOffset={sinsToOffset} onDone={onDone} />;
  }

  const offsetCount = Math.min(merit, sinsToOffset);
  const sharedProps = {
    merit, setMerit, offsetCount, sinsToOffset,
    onBack: () => setChosen(null),
    onDone: () => onDone && onDone(merit),
  };
  if (chosen === "buddhist")  return <BuddhistMode {...sharedProps} />;
  if (chosen === "christian") return <ChristianMode {...sharedProps} />;
  if (chosen === "muslim")    return <MuslimMode {...sharedProps} />;
  return null;
}

// ─── Religion picker ──────────────────────────────────────────
function ReligionPicker({ onPick, sinsToOffset, onDone }) {
  return (
    <div className="screen" data-mode="merit">
      <div className="grain-layer" />
      <div style={{
        position: "relative", zIndex: 1, height: "100%",
        display: "flex", flexDirection: "column", padding: "56px 20px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Bilingual zh="选择你的功德" en="choose your path" style={{ color: "var(--merit-wood-2)" }} />
          <button onClick={onDone} style={{
            background: "transparent", border: 0, color: "var(--merit-wood-2)",
            font: "600 13px var(--font-body)", cursor: "pointer",
          }}>跳过 →</button>
        </div>
        <p style={{ font: "400 14px/1.5 var(--font-body)", color: "var(--ink-80)", marginTop: 10, marginBottom: 6 }}>
          按你信的来。点几下，把刚才的火气消一消。
        </p>
        <p style={{
          font: "400 12px/1.4 var(--font-body-en)", color: "var(--ink-60)",
          fontStyle: "italic", marginBottom: 16,
        }}>
          Pick what you believe in (or don't). Tap to redeem.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
          {RELIGIONS.map((r) => (
            <button
              key={r.id}
              onClick={() => onPick(r.id)}
              style={{
                display: "flex", alignItems: "center", gap: 16, padding: "18px 18px",
                background: r.bg, border: `1.5px solid ${r.color}`, borderRadius: 20,
                cursor: "pointer", textAlign: "left", boxShadow: "var(--shadow-soft)",
                transition: "transform .14s var(--ease-snap)",
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
              onMouseUp={(e) => (e.currentTarget.style.transform = "")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            >
              <div style={{
                width: 56, height: 56, borderRadius: "50%", background: r.color, color: "#fff",
                display: "grid", placeItems: "center", fontSize: 30, flexShrink: 0,
              }}>{r.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "700 22px var(--font-display)", color: r.color, lineHeight: 1 }}>{r.zh}</div>
                <div style={{
                  font: "500 11px var(--font-body-en)", letterSpacing: ".12em",
                  textTransform: "uppercase", color: "var(--ink-60)", marginTop: 4,
                }}>{r.en}</div>
                <div style={{ font: "400 12px var(--font-body)", color: "var(--ink-80)", marginTop: 6 }}>
                  {r.id === "buddhist"  && "敲木鱼，听心经金刚经"}
                  {r.id === "christian" && "进忏悔室，对着神父说出来"}
                  {r.id === "muslim"    && "戴小帽，向真主念几句"}
                </div>
              </div>
              <span style={{ color: r.color, font: "700 24px var(--font-body)" }}>›</span>
            </button>
          ))}
        </div>

        {sinsToOffset > 0 && (
          <div style={{
            marginTop: 16, padding: 12, background: "rgba(139,94,60,.08)",
            borderRadius: 12, textAlign: "center",
          }}>
            <span style={{ font: "500 13px var(--font-body)", color: "var(--ink-80)" }}>
              本场积下 <b style={{ color: "var(--vent-vermilion)" }}>{sinsToOffset}</b> 项罪行 · 等待抵消
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Buddhist mode (wooden fish) ──────────────────────────────
function BuddhistMode({ merit, setMerit, offsetCount, sinsToOffset, onBack, onDone }) {
  const [sutra, setSutra] = useState(SUTRAS[0]);
  const [picking, setPicking] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [floats, setFloats] = useState([]);
  const fishRef = useRef(null);
  const idRef = useRef(0);

  useEffect(() => {
    window.GameAudio && window.GameAudio.startBGM("buddhist");
    return () => window.GameAudio && window.GameAudio.stopBGM();
  }, []);

  function tap() {
    const id = ++idRef.current;
    if (window.GameAudio) window.GameAudio.fishTok();
    setRipples((r) => [...r, { id }]);
    setFloats((f) => [...f, { id, x: 40 + Math.random() * 20 }]);
    setMerit((m) => m + 1);
    fishRef.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(0.94)" }, { transform: "scale(1)" }],
      { duration: 140, easing: "cubic-bezier(.2,.9,.3,1.4)" }
    );
    setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 800);
    setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 900);
  }

  return (
    <div className="screen" data-mode="merit">
      <div className="grain-layer" />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(60% 50% at 50% 45%, rgba(200,162,75,.18), transparent 70%)",
      }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <ModeHeader onBack={onBack} title="佛教 · 木鱼" merit={merit} onDone={onDone} accent="var(--merit-wood-2)" />
        {sinsToOffset > 0 && <OffsetBar offset={offsetCount} total={sinsToOffset} />}

        {/* Sutra strip */}
        <div style={{ padding: "16px 20px 8px" }}>
          <button
            onClick={() => setPicking(true)}
            style={{
              width: "100%", textAlign: "left",
              border: "1.5px solid var(--merit-wood)",
              background: "rgba(139,94,60,.06)", borderRadius: 16, padding: "10px 14px",
              display: "flex", alignItems: "center", gap: 12, cursor: "pointer",
            }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "var(--merit-wood)", color: "var(--merit-rice)",
              display: "grid", placeItems: "center", font: "400 18px var(--font-brush)",
            }}>♪</div>
            <div style={{ flex: 1 }}>
              <div style={{ font: "400 18px var(--font-brush)", color: "var(--merit-wood-2)", lineHeight: 1 }}>
                《{sutra.zh}》
              </div>
              <div style={{
                font: "500 10px var(--font-body-en)", letterSpacing: ".12em",
                color: "var(--ink-60)", textTransform: "uppercase", marginTop: 4,
              }}>{sutra.en}</div>
            </div>
            <span style={{ font: "600 12px var(--font-body)", color: "var(--merit-wood-2)" }}>换一卷 ›</span>
          </button>
          <p className="t-sutra" style={{
            color: "var(--ink-80)", fontSize: 13, opacity: .85, marginTop: 8, textAlign: "center",
          }}>{sutra.excerpt}</p>
        </div>

        <div style={{
          flex: 1, display: "flex", justifyContent: "center", alignItems: "center", position: "relative",
        }}>
          {ripples.map((r) => <div key={r.id} className="ripple" style={{ width: 220, height: 220 }} />)}
          {floats.map((f) => <div key={f.id} className="float-up" style={{ left: `${f.x}%`, top: "30%" }}>+1</div>)}
          <button
            ref={fishRef}
            onClick={tap}
            style={{ width: 240, height: 200, border: 0, background: "transparent", cursor: "pointer", padding: 0 }}
          >
            <WoodenFishArt />
          </button>
        </div>

        <div style={{ textAlign: "center", padding: "0 20px 8px" }}>
          <div style={{ font: "500 13px var(--font-body)", color: "var(--ink-60)" }}>敲一下 · tap to gain merit</div>
        </div>
        <div style={{ padding: "12px 20px 24px" }}>
          <Button variant="merit" onClick={onDone} style={{ width: "100%", height: 48, borderRadius: 12 }}>
            完成 · DONE
          </Button>
        </div>
      </div>
      {picking && (
        <SutraPickerSheet
          value={sutra}
          onPick={(s) => { setSutra(s); setPicking(false); }}
          onClose={() => setPicking(false)}
        />
      )}
    </div>
  );
}

function WoodenFishArt() {
  return (
    <svg viewBox="0 0 240 200" width="100%" height="100%">
      <defs>
        <radialGradient id="woodGrad" cx="50%" cy="40%" r="70%">
          <stop offset="0%"   stopColor="#C8884E" />
          <stop offset="60%"  stopColor="#8B5E3C" />
          <stop offset="100%" stopColor="#4C2F1A" />
        </radialGradient>
        <radialGradient id="hole" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#1A1612" />
          <stop offset="100%" stopColor="#3D2718" />
        </radialGradient>
      </defs>
      <ellipse cx="120" cy="180" rx="90"  ry="10" fill="rgba(60,30,10,.4)" />
      <ellipse cx="120" cy="105" rx="100" ry="72" fill="url(#woodGrad)" />
      <ellipse cx="120" cy="120" rx="55"  ry="14" fill="url(#hole)" />
      <circle cx="78"  cy="88"  r="6"  fill="#2A1810" />
      <circle cx="162" cy="88"  r="6"  fill="#2A1810" />
      <circle cx="120" cy="40"  r="14" fill="#6B4528" />
      <circle cx="118" cy="38"  r="4"  fill="#A07248" opacity=".6" />
      <ellipse cx="80"  cy="65" rx="22" ry="10" fill="#E8B07A" opacity=".35" />
    </svg>
  );
}

function SutraPickerSheet({ value, onPick, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0, background: "rgba(26,22,18,.4)",
          zIndex: 10, animation: "fadeIn .2s ease",
        }}
      />
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 11,
        background: "var(--paper-2)",
        borderTopLeftRadius: 20, borderTopRightRadius: 20,
        padding: "16px 0 28px", animation: "slideUp .28s var(--ease-emph)",
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: "var(--ink-20)", margin: "0 auto 12px",
        }} />
        <div style={{ padding: "0 20px 12px" }}><Bilingual zh="选一卷经" en="pick a sutra" /></div>
        {SUTRAS.map((s) => {
          const active = s.id === value.id;
          return (
            <button
              key={s.id}
              onClick={() => onPick(s)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 14,
                padding: "12px 20px", border: 0, cursor: "pointer", textAlign: "left",
                background: active ? "rgba(200,162,75,.12)" : "transparent",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: active ? "var(--merit-gold)" : "var(--merit-wood)",
                color: "var(--paper)", display: "grid", placeItems: "center",
                font: "400 22px var(--font-brush)",
              }}>{s.zh.slice(0, 1)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ font: "400 20px var(--font-brush)", color: "var(--ink-100)" }}>《{s.zh}》</div>
                <div style={{
                  font: "500 11px var(--font-body-en)", letterSpacing: ".12em",
                  textTransform: "uppercase", color: "var(--ink-60)", marginTop: 4,
                }}>{s.en}</div>
              </div>
              {active && (
                <div style={{ color: "var(--merit-gold-2)", font: "700 18px var(--font-body)" }}>✓</div>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}

// ─── Christian mode (confession) ──────────────────────────────
function ChristianMode({ merit, setMerit, offsetCount, sinsToOffset, onBack, onDone }) {
  const [bubble, setBubble] = useState(null);
  const [priestNods, setPriestNods] = useState(0);
  const [lang, setLang] = useState("zh");
  const idRef = useRef(0);

  useEffect(() => {
    window.GameAudio && window.GameAudio.startBGM("christian");
    return () => window.GameAudio && window.GameAudio.stopBGM();
  }, []);

  function confess() {
    const id = ++idRef.current;
    if (window.GameAudio) window.GameAudio.bell();
    const list = lang === "zh" ? CONFESSIONS_ZH : CONFESSIONS_EN;
    const text = list[Math.floor(Math.random() * list.length)];
    setBubble({ id, text });
    setMerit((m) => m + 1);
    setPriestNods((n) => n + 1);
    setTimeout(() => setBubble((b) => (b && b.id === id ? null : b)), 2200);
  }

  return (
    <div className="screen" style={{ background: "#EEF1F0", color: "#1A1612" }}>
      <div className="grain-layer" style={{ opacity: .04 }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <ModeHeader onBack={onBack} title="忏悔室 · Confession" merit={merit} onDone={onDone} accent="#5C7A8A" />
        {sinsToOffset > 0 && <OffsetBar offset={offsetCount} total={sinsToOffset} />}

        {/* lang toggle */}
        <div style={{ padding: "0 20px", display: "flex", justifyContent: "center", gap: 6 }}>
          <div style={{
            display: "inline-flex", background: "#fff",
            border: "1.5px solid #5C7A8A", borderRadius: 999, padding: 3,
          }}>
            {[{ v: "zh", l: "中文" }, { v: "en", l: "EN" }].map((o) => (
              <button
                key={o.v}
                onClick={() => setLang(o.v)}
                style={{
                  font: "600 12px/1 var(--font-body)", padding: "8px 14px",
                  borderRadius: 999, border: 0, cursor: "pointer",
                  background: lang === o.v ? "#5C7A8A" : "transparent",
                  color: lang === o.v ? "#fff" : "#5C7A8A",
                  whiteSpace: "nowrap",
                }}
              >{o.l}</button>
            ))}
          </div>
        </div>

        <div style={{
          flex: 1, position: "relative",
          display: "flex", justifyContent: "center", alignItems: "center",
        }}>
          <ConfessionBooth bubble={bubble} priestNods={priestNods} />
        </div>

        <div style={{ padding: "0 20px 8px", textAlign: "center" }}>
          <div style={{ font: "500 13px var(--font-body)", color: "#3D372F" }}>说点啥都行 · tap to confess</div>
        </div>
        <div style={{ padding: "12px 20px 24px", display: "flex", gap: 10 }}>
          <button
            onClick={confess}
            style={{
              flex: 1, height: 56, borderRadius: 999, border: 0, cursor: "pointer",
              background: "#5C7A8A", color: "#fff", font: "700 16px var(--font-body)",
              boxShadow: "0 4px 0 #3F5A6A",
            }}
          >父啊，我有罪 · Bless me father</button>
          <button
            onClick={onDone}
            style={{
              height: 56, padding: "0 18px", borderRadius: 12,
              border: "1.5px solid #5C7A8A", background: "transparent",
              color: "#5C7A8A", font: "600 13px var(--font-body)", cursor: "pointer",
            }}
          >完成</button>
        </div>
      </div>
    </div>
  );
}

function ConfessionBooth({ bubble, priestNods }) {
  return (
    <div style={{ position: "relative", width: 280, height: 280 }}>
      {/* booth wood frame */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 12,
        background: "linear-gradient(180deg, #6B4528 0%, #4C2F1A 100%)",
        boxShadow: "0 8px 24px rgba(0,0,0,.25), inset 0 4px 0 rgba(255,255,255,.06)",
      }} />
      {/* roof cross */}
      <div style={{
        position: "absolute", left: "50%", top: -22, transform: "translateX(-50%)",
        color: "#C8A24B", fontSize: 28,
      }}>✝</div>
      {/* lattice opening */}
      <div style={{
        position: "absolute", left: 30, top: 50, right: 30, height: 140,
        background: "#1A1612", borderRadius: 8, padding: 8,
        display: "grid", gridTemplateColumns: "repeat(5,1fr)", gridTemplateRows: "repeat(5,1fr)", gap: 3,
        overflow: "hidden",
      }}>
        {/* priest silhouette */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", justifyContent: "center", alignItems: "flex-end",
          paddingBottom: 4,
        }}>
          <div
            key={priestNods}
            style={{
              width: 60, height: 80, position: "relative",
              animation: priestNods % 2 === 0 ? "priestNod1 .4s" : "priestNod2 .4s",
            }}
          >
            {/* head */}
            <div style={{
              position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)",
              width: 28, height: 32, borderRadius: "50% 50% 45% 45%",
              background: "#E8C9A8", border: "2px solid #1A1612",
            }}>
              <div style={{ position: "absolute", top: 14, left: 6,  width: 3, height: 3, borderRadius: "50%", background: "#1A1612" }} />
              <div style={{ position: "absolute", top: 14, right: 6, width: 3, height: 3, borderRadius: "50%", background: "#1A1612" }} />
            </div>
            {/* collar */}
            <div style={{
              position: "absolute", left: "50%", top: 30, transform: "translateX(-50%)",
              width: 36, height: 8, background: "#fff", border: "2px solid #1A1612",
            }} />
            {/* robe */}
            <div style={{
              position: "absolute", left: "50%", top: 36, transform: "translateX(-50%)",
              width: 50, height: 50, background: "#1A1612", borderRadius: "10px 10px 0 0",
            }} />
            <div style={{
              position: "absolute", left: "50%", top: 48, transform: "translateX(-50%)",
              color: "#C8A24B", fontSize: 14,
            }}>✝</div>
          </div>
        </div>
        {/* lattice grid (foreground) */}
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{
            background: "transparent", border: "1.5px solid #6B4528",
            borderRadius: 2, opacity: .55, pointerEvents: "none",
          }} />
        ))}
      </div>
      {/* speech bubble */}
      {bubble && (
        <div style={{
          position: "absolute", left: -10, right: -10, bottom: 30,
          background: "#fff", border: "2px solid #1A1612", borderRadius: 16,
          padding: "10px 14px", font: "500 14px/1.4 var(--font-body)", color: "#1A1612",
          animation: "bubbleIn .22s var(--ease-snap)", boxShadow: "0 4px 0 #1A1612",
          zIndex: 5,
        }}>
          “{bubble.text}”
          <div style={{
            position: "absolute", left: "50%", bottom: -10, transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "10px solid transparent", borderRight: "10px solid transparent",
            borderTop: "10px solid #1A1612",
          }} />
          <div style={{
            position: "absolute", left: "50%", bottom: -7, transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "8px solid transparent", borderRight: "8px solid transparent",
            borderTop: "8px solid #fff",
          }} />
        </div>
      )}
    </div>
  );
}

// ─── Muslim mode (prayer) ─────────────────────────────────────
function MuslimMode({ merit, setMerit, offsetCount, sinsToOffset, onBack, onDone }) {
  const [bubble, setBubble] = useState(null);
  const [bow, setBow] = useState(0);
  const idRef = useRef(0);

  useEffect(() => {
    window.GameAudio && window.GameAudio.startBGM("muslim");
    return () => window.GameAudio && window.GameAudio.stopBGM();
  }, []);

  function pray() {
    const id = ++idRef.current;
    if (window.GameAudio) window.GameAudio.bell();
    const d = DUAS[Math.floor(Math.random() * DUAS.length)];
    setBubble({ id, ...d });
    setMerit((m) => m + 1);
    setBow((b) => b + 1);
    setTimeout(() => setBubble((b) => (b && b.id === id ? null : b)), 2200);
  }

  return (
    <div className="screen" style={{ background: "#F0EBDC", color: "#1A1612" }}>
      <div className="grain-layer" style={{ opacity: .05 }} />
      <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column" }}>
        <ModeHeader onBack={onBack} title="向真主忏悔 · Astaghfirullah" merit={merit} onDone={onDone} accent="#3A6B4E" />
        {sinsToOffset > 0 && <OffsetBar offset={offsetCount} total={sinsToOffset} />}

        <div style={{
          flex: 1, position: "relative",
          display: "flex", justifyContent: "center", alignItems: "flex-end",
          paddingBottom: 20,
        }}>
          <MosqueArch />
          <PrayingFigure bow={bow} bubble={bubble} />
        </div>

        <div style={{ padding: "0 20px 8px", textAlign: "center" }}>
          <div style={{ font: "500 13px var(--font-body)", color: "#3D372F" }}>戴上小帽，跟着念 · tap to recite</div>
        </div>
        <div style={{ padding: "12px 20px 24px", display: "flex", gap: 10 }}>
          <button
            onClick={pray}
            style={{
              flex: 1, height: 56, borderRadius: 999, border: 0, cursor: "pointer",
              background: "#3A6B4E", color: "#F0EBDC", font: "700 16px var(--font-body)",
              boxShadow: "0 4px 0 #244A33",
            }}
          >主啊，请原谅 · Forgive me</button>
          <button
            onClick={onDone}
            style={{
              height: 56, padding: "0 18px", borderRadius: 12,
              border: "1.5px solid #3A6B4E", background: "transparent",
              color: "#3A6B4E", font: "600 13px var(--font-body)", cursor: "pointer",
            }}
          >完成</button>
        </div>
      </div>
    </div>
  );
}

function MosqueArch() {
  return (
    <svg
      viewBox="0 0 320 320" width="280" height="280"
      style={{ position: "absolute", left: "50%", bottom: 80, transform: "translateX(-50%)", opacity: .25 }}
    >
      <path d="M 40 320 L 40 180 Q 40 60 160 60 Q 280 60 280 180 L 280 320 Z" fill="#3A6B4E" opacity=".3" />
      <path d="M 60 320 L 60 180 Q 60 80 160 80 Q 260 80 260 180 L 260 320 Z" fill="#F0EBDC" />
      <g transform="translate(160 32)">
        <path d="M 0 0 A 14 14 0 1 0 8 12 A 10 10 0 1 1 0 0 Z" fill="#3A6B4E" />
      </g>
      <g transform="translate(160 18)" fill="#3A6B4E">
        <path d="M 0 -4 L 1 -1 L 4 -1 L 1.5 1 L 2.5 4 L 0 2 L -2.5 4 L -1.5 1 L -4 -1 L -1 -1 Z" />
      </g>
      <line x1="40" y1="280" x2="280" y2="280" stroke="#3A6B4E" strokeWidth="1" opacity=".4" />
    </svg>
  );
}

function PrayingFigure({ bow, bubble }) {
  return (
    <div style={{
      position: "relative", display: "flex", flexDirection: "column",
      alignItems: "center", zIndex: 2,
    }}>
      {bubble && (
        <div style={{
          marginBottom: 12, background: "#fff", border: "2px solid #3A6B4E", borderRadius: 16,
          padding: "10px 14px", font: "500 14px/1.4 var(--font-body)", color: "#1A1612",
          animation: "bubbleIn .22s var(--ease-snap)", maxWidth: 240, textAlign: "center",
          boxShadow: "0 4px 0 #244A33",
        }}>
          {bubble.zh}
          <div style={{
            font: "500 11px var(--font-body-en)", color: "#3A6B4E",
            marginTop: 2, fontStyle: "italic",
          }}>{bubble.en}</div>
        </div>
      )}
      <div
        key={bow}
        style={{
          position: "relative", width: 140, height: 180,
          animation: bow % 2 === 1 ? "bow1 .6s var(--ease-emph)" : "bow2 .6s var(--ease-emph)",
          transformOrigin: "50% 100%",
        }}
      >
        {/* kufi cap */}
        <div style={{
          position: "absolute", left: "50%", top: 0, transform: "translateX(-50%)",
          width: 44, height: 22, background: "#3A6B4E",
          borderRadius: "22px 22px 4px 4px", border: "2px solid #244A33",
        }}>
          <div style={{
            position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
            width: 4, height: 4, borderRadius: "50%", background: "#C8A24B",
          }} />
        </div>
        {/* head */}
        <div style={{
          position: "absolute", left: "50%", top: 18, transform: "translateX(-50%)",
          width: 52, height: 56, borderRadius: "50% 50% 45% 45%",
          background: "#E8C9A8", border: "2px solid #1A1612",
        }}>
          <div style={{
            position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)",
            width: 30, height: 14, background: "#3D372F", borderRadius: "0 0 50% 50%",
          }} />
          <div style={{ position: "absolute", top: 22, left: 12,  width: 4, height: 4, borderRadius: "50%", background: "#1A1612" }} />
          <div style={{ position: "absolute", top: 22, right: 12, width: 4, height: 4, borderRadius: "50%", background: "#1A1612" }} />
        </div>
        {/* robe body */}
        <div style={{
          position: "absolute", left: "50%", top: 70, transform: "translateX(-50%)",
          width: 110, height: 90, background: "#F0EBDC", border: "2px solid #1A1612",
          borderRadius: "20px 20px 4px 4px",
        }}>
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 8, background: "#3A6B4E",
          }} />
          <div style={{
            position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)",
            width: 1.5, height: 60, background: "#3A6B4E", opacity: .5,
          }} />
        </div>
        {/* prayer mat */}
        <div style={{
          position: "absolute", left: "50%", bottom: -6, transform: "translateX(-50%)",
          width: 160, height: 12, background: "#9C2418", borderRadius: 4,
          border: "2px solid #1A1612",
          boxShadow: "0 -1px 0 #C8A24B inset",
        }} />
      </div>
    </div>
  );
}

// ─── Shared mode chrome ───────────────────────────────────────
function ModeHeader({ onBack, title, merit, onDone, accent }) {
  const [muted, setMuted] = useState(window.GameAudio ? window.GameAudio.isMuted() : false);
  function toggleMute() {
    const m = !muted;
    setMuted(m);
    window.GameAudio && window.GameAudio.setMuted(m);
  }
  return (
    <div style={{
      padding: "56px 20px 8px",
      display: "flex", justifyContent: "space-between", alignItems: "center",
    }}>
      <button onClick={onBack} style={{
        background: "transparent", border: 0, color: accent,
        font: "600 13px var(--font-body)", cursor: "pointer",
      }}>← 换一个</button>
      <div style={{ textAlign: "center", lineHeight: 1.1 }}>
        <div style={{ font: "700 15px var(--font-body)", color: accent }}>{title}</div>
        <div className="t-num" style={{ color: accent, fontSize: 22, marginTop: 2 }}>
          +{merit}{" "}
          <span style={{
            font: "500 10px var(--font-body-en)", letterSpacing: ".12em",
            textTransform: "uppercase", opacity: .8,
          }}>merit</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button
          onClick={toggleMute}
          title="mute"
          style={{
            background: "transparent", border: 0, color: accent,
            font: "600 16px var(--font-body)", cursor: "pointer", width: 32,
          }}
        >{muted ? "🔇" : "🔊"}</button>
        <button onClick={onDone} style={{
          background: "transparent", border: 0, color: accent,
          font: "600 13px var(--font-body)", cursor: "pointer",
        }}>完成 →</button>
      </div>
    </div>
  );
}

function OffsetBar({ offset, total }) {
  return (
    <div style={{ padding: "0 20px", marginTop: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ font: "500 12px var(--font-body)", color: "var(--ink-80)" }}>抵消罪行 · offsetting sins</span>
        <span style={{ font: "600 12px var(--font-num)", color: "var(--merit-wood-2)" }}>{offset} / {total}</span>
      </div>
      <div style={{
        height: 8, borderRadius: 999,
        background: "rgba(139,94,60,.15)", overflow: "hidden",
      }}>
        <div style={{
          width: `${(offset / total) * 100}%`, height: "100%",
          background: "linear-gradient(90deg, var(--merit-jade), var(--merit-gold))",
          transition: "width .3s var(--ease-quiet)",
        }} />
      </div>
    </div>
  );
}
