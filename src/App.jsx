import { useEffect, useState } from "react";
import IOSDevice from "./components/IOSDevice.jsx";
import IntroScreen from "./screens/IntroScreen.jsx";
import VentScreen from "./screens/VentScreen.jsx";
import MeritScreen from "./screens/MeritScreen.jsx";

// App — Intro -> (Vent or skip) -> Merit, with ink-wipe transitions.
// Merit accumulates across sessions in localStorage so "today's merit" can
// be banked ahead of the next venting cycle.

const BANK_KEY = "egg-toss-merit-bank";

function readBank() {
  const raw = Number(localStorage.getItem(BANK_KEY));
  return Number.isFinite(raw) && raw >= 0 ? raw : 0;
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [sins, setSins] = useState(0);
  const [wiping, setWiping] = useState(false);
  const [bank, setBank] = useState(readBank);

  useEffect(() => {
    localStorage.setItem(BANK_KEY, String(bank));
  }, [bank]);

  function goto(target, sinCount) {
    setWiping(true);
    setTimeout(() => {
      if (typeof sinCount === "number") setSins(sinCount);
      setScreen(target);
      setTimeout(() => setWiping(false), 50);
    }, 360);
  }

  // MeritScreen reports its final merit total (= startingBank + earned this session).
  // Skip paths (e.g. ReligionPicker "跳过") forward the React event instead — leave the bank alone.
  function finishMerit(finalMerit) {
    if (typeof finalMerit === "number") {
      setBank(Math.max(0, finalMerit - sins));
    }
    goto("intro", 0);
  }

  const dark = screen === "vent" || screen === "intro";
  const bg =
    screen === "intro" ? "var(--vent-ink)" :
    screen === "vent"  ? "var(--vent-ink)" :
                         "var(--merit-rice)";

  return (
    <IOSDevice width={390} height={844} dark={dark}>
      <div style={{ position: "relative", height: "100%", overflow: "hidden", background: bg }}>
        {screen === "intro" && (
          <IntroScreen
            bank={bank}
            onStart={() => goto("vent")}
            onSkipToMerit={() => goto("merit", 0)}
          />
        )}
        {screen === "vent" && (
          <VentScreen onComplete={(hits) => goto("merit", hits)} />
        )}
        {screen === "merit" && (
          <MeritScreen
            sinsToOffset={sins}
            startingMerit={bank}
            onDone={finishMerit}
          />
        )}
        {wiping && <div className="ink-wipe" />}
      </div>
    </IOSDevice>
  );
}
