import { useState, useRef } from "react";
import Background from "./globalbackground";
import music from "./assets/music.mp3";
const BACKEND_URL = "https://farewell-backend-2v9n.onrender.com/api/submit";

const QUESTIONS = [
  
  { id: 1,  text: "Who is the most beautiful person in the class?",           emoji: "🌟💫",  color: "#f472b6" },
  
  { id: 2,  text: "Who is the best coder in the class?",                      emoji: "💻⚡",  color: "#2dd4bf" },
  
  { id: 3,  text: "Who is the most responsible student?",                     emoji: "📌✅",  color: "#60a5fa" },
  
  { id: 4,  text: "Who is the most stylish person in the class?",             emoji: "😎✨",  color: "#c084fc" },
  { id: 5,  text: "Who is most likely to become a CEO?",                      emoji: "🏢👔",  color: "#fbbf24" },
  { id: 6, text: "Who is best at logical thinking?",                         emoji: "🧠💡",  color: "#38bdf8" },
  { id: 7, text: "Who is the class entertainer?",                            emoji: "🎭🎪",  color: "#fb923c" },
  { id: 8, text: "Who is the most disciplined?",                             emoji: "📚⏱️",  color: "#60a5fa" },
 
  { id: 9, text: "Who studies only before exams but still scores?",          emoji: "📖😅",  color: "#f87171" },
 
  { id: 10, text: "Who is most likely to crack placements easily?",           emoji: "🎯🏆",  color: "#fbbf24" },
  { id: 11, text: "Who is the most confident speaker?",                       emoji: "🎤💬",  color: "#34d399" },
  { id: 12, text: "Who is always on their phone?",                            emoji: "📱🌙",  color: "#38bdf8" },

  

  { id: 13, text: "Who is the most silent but observes everything?",          emoji: "👀🤫",  color: "#94a3b8" },
  { id: 14, text: "Who is best at presentations?",                            emoji: "📊🎯",  color: "#60a5fa" },
 

  { id: 15, text: "Who pretends like doing nothing but does everything?",     emoji: "👻🤫",  color: "#a78bfa" },
  { id: 16, text: "Who sleeps in class but still scores well?",               emoji: "😴📈",  color: "#fb923c" },

  { id: 17, text: "Who is the comedian of the class?",                        emoji: "🤡😂",  color: "#fb923c" },
  { id: 18, text: "Who is the best frontend developer?",                      emoji: "🎨💻",  color: "#c084fc" },
  { id: 19, text: "Who is the best backend developer?",                       emoji: "⚙️💻",  color: "#2dd4bf" },
  { id: 20, text: "Who is the best Class Representative?",                   emoji: "🏅👑",  color: "#fbbf24" },
];

// Build roll number options
const ROLL_OPTIONS = (() => {
  const opts = [];
  for (let i = 66; i <= 99; i++) {
    const suffix = String(i);
    opts.push({ label: `238W1A12${suffix}`, value: `238W1A12${suffix}`, group: "Numeric (66–99)" });
  }
  ["A","B","C"].forEach(letter => {
    for (let i = 0; i <= 9; i++) {
      const suffix = `${letter}${i}`;
      opts.push({ label: `238W1A12${suffix}`, value: `238W1A12${suffix}`, group: `${letter} Series` });
    }
  });
  opts.push({ label: "238W1A12D0", value: "238W1A12D0", group: "D Series" });
  for (let i = 7; i <= 13; i++) {
    opts.push({ label: `248W5A12LE${i}`, value: `248W5A12LE${i}`, group: "Lateral Entry" });
  }
  return opts;
})();

const GROUP_ORDER = ["Numeric (66–99)", "A Series", "B Series", "C Series", "D Series", "Lateral Entry"];

const DanceIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="8" r="4" fill={color} opacity="0.9"/>
    <path d="M12 14c0 0 2-2 6-2s6 2 6 2l2 8-4 1-2-5-2 5-4-1 2-8z" fill={color} opacity="0.8"/>
    <path d="M10 22l4 8M26 22l-4 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const StarIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 2l3.5 7.5L28 11l-6 5.5 1.5 8.5L16 21l-7.5 4 1.5-8.5L4 11l8.5-1.5L16 2z" fill={color} opacity="0.85"/>
  </svg>
);
const RocketIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 2c0 0 8 4 8 14l-4 2-4-2-4 2-4-2C8 6 16 2 16 2z" fill={color} opacity="0.85"/>
    <path d="M12 18l-4 8 8-4 8 4-4-8" fill={color} opacity="0.5"/>
    <circle cx="16" cy="12" r="3" fill="white" opacity="0.4"/>
  </svg>
);
const CodeIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="2" y="4" width="28" height="24" rx="4" fill={color} opacity="0.2"/>
    <path d="M10 12l-5 4 5 4M22 12l5 4-5 4" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M13 22l6-12" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);
const LaughIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill={color} opacity="0.85"/>
    <path d="M9 18c2 6 12 6 14 0" fill="white" opacity="0.9"/>
    <circle cx="11" cy="13" r="2.5" fill="white"/>
    <circle cx="21" cy="13" r="2.5" fill="white"/>
  </svg>
);
const ShieldIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 2l12 5v9c0 8-12 14-12 14S4 24 4 16V7z" fill={color} opacity="0.8"/>
    <path d="M10 16l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const ClockIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill={color} opacity="0.2"/>
    <circle cx="16" cy="16" r="14" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M16 8v8l5 5" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);
const FashionIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 4l4 6h8l4-6" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M6 8l2 4 8 2 8-2 2-4-4-2-2 4-4-1-4 1-2-4z" fill={color} opacity="0.8"/>
    <rect x="10" y="14" width="12" height="14" rx="2" fill={color} opacity="0.7"/>
  </svg>
);
const CrownIcon = ({ color }) => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <path d="M4 24l4-14 7 8 4-10 4 10 7-8 4 14H4z" fill={color} opacity="0.9"/>
    <rect x="3" y="24" width="28" height="4" rx="2" fill={color} opacity="0.7"/>
    <circle cx="4" cy="10" r="2.5" fill={color}/>
    <circle cx="17" cy="6" r="2.5" fill={color}/>
    <circle cx="30" cy="10" r="2.5" fill={color}/>
  </svg>
);
const BrainIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 20c-3-2-4-6-2-9 1-2 3-3 5-3 0-3 2-5 5-5s5 2 5 5c2 0 4 1 5 3 2 3 1 7-2 9" fill={color} opacity="0.7"/>
    <path d="M8 20c0 4 3 7 8 7s8-3 8-7" fill={color} opacity="0.5"/>
    <path d="M12 16c0 2 1.5 4 4 4s4-2 4-4" stroke="white" strokeWidth="1.5" fill="none"/>
  </svg>
);

const QUESTION_ICONS = [
  DanceIcon, StarIcon, RocketIcon, CodeIcon, LaughIcon,
  ShieldIcon, ClockIcon, FashionIcon, CrownIcon, BrainIcon,
  LaughIcon, ShieldIcon, RocketIcon, ClockIcon, FashionIcon,
  CrownIcon, StarIcon, DanceIcon, BrainIcon, DanceIcon,
  CrownIcon, BrainIcon, ShieldIcon, StarIcon, ClockIcon,
  BrainIcon, ClockIcon, StarIcon, CrownIcon, LaughIcon,
  CodeIcon, CodeIcon, CrownIcon,
];

const Particles = ({ color }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 3,
    size: 3 + Math.random() * 5,
    dur: 4 + Math.random() * 6,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          bottom: "-10px",
          width: p.size,
          height: p.size,
          borderRadius: "50%",
          background: color,
          opacity: 0.6,
          animation: `floatUp ${p.dur}s ${p.delay}s infinite linear`,
        }}/>
      ))}
    </div>
  );
};

const CustomKeyboard = ({ onKey, onDelete, onEnter, accentColor }) => {
  const rows = [
    ["1","2","3","4","5","6","7","8","9","0"],
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["Z","X","C","V","B","N","M"],
  ];
  const btnBase = {
    borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700,
    fontSize: 14, transition: "all 0.12s", fontFamily: "inherit",
    userSelect: "none", WebkitUserSelect: "none",
  };
  const keyStyle = {
    ...btnBase,
    background: `rgba(255,255,255,0.08)`, color: "#fff",
    width: 32, height: 40, margin: 2,
    backdropFilter: "blur(8px)",
    boxShadow: `0 0 8px ${accentColor}33`,
    border: `1px solid ${accentColor}30`,
  };
  const specialStyle = {
    ...btnBase,
    background: `${accentColor}33`, color: accentColor,
    height: 40, margin: 2, padding: "0 10px",
    border: `1px solid ${accentColor}55`, fontSize: 13,
  };
  return (
    <div style={{
      width: "100%", maxWidth: 420, margin: "0 auto",
      padding: "10px 4px 4px", borderRadius: 16,
      background: "rgba(0,0,0,0.35)", backdropFilter: "blur(20px)",
      border: `1px solid ${accentColor}22`,
    }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
          {row.map(k => (
            <button key={k} style={keyStyle}
              onPointerDown={e => { e.preventDefault(); onKey(k); }}>
              {k}
            </button>
          ))}
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "center", gap: 4 }}>
        <button style={{ ...specialStyle, width: 70 }}
          onPointerDown={e => { e.preventDefault(); onKey(" "); }}>
          SPACE
        </button>
        <button style={{ ...specialStyle, minWidth: 60 }}
          onPointerDown={e => { e.preventDefault(); onDelete(); }}>
          ⌫
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <button style={{ ...specialStyle, flex: 1, maxWidth: 260, height: 42, fontSize: 15, letterSpacing: 2 }}
          onPointerDown={e => { e.preventDefault(); onEnter(); }}>
          NEXT →
        </button>
      </div>
    </div>
  );
};

export default function Quiz() {
  const [phase, setPhase] = useState("name");
  const [studentName, setStudentName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [nameError, setNameError] = useState("");
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedRoll, setSelectedRoll] = useState("");
  const [animDir, setAnimDir] = useState("in");
  const [error, setError] = useState("");
  const audioRef = useRef(null);

  const getSessionId = () => {
    let id = localStorage.getItem("sessionId");
    if (!id) { id = "sess_" + crypto.randomUUID(); localStorage.setItem("sessionId", id); }
    return id;
  };
  const sessionId = useRef(getSessionId());

  const q = QUESTIONS[currentQ];
  const Icon = QUESTION_ICONS[currentQ];
  const accentColor = q?.color || "#c084fc";

  const handleNameKey = (k) => setNameInput(v => v + k);
  const handleNameDelete = () => setNameInput(v => v.slice(0, -1));
  const handleNameEnter = () => {
    if (!nameInput.trim()) { setNameError("Please enter your name"); return; }
    setStudentName(nameInput.trim());
    setPhase("quiz");

    // 🎵 START MUSIC HERE
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
  };

  const goNext = async () => {
    if (!selectedRoll) { setError("Please select a roll number"); return; }
    setError("");
    const newAnswers = { ...answers, [q.id]: selectedRoll };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setAnimDir("out");
      setTimeout(() => {
        setCurrentQ(c => c + 1);
        setSelectedRoll("");
        setAnimDir("in");
      }, 400);
    } else {
      const allFilled = QUESTIONS.every(q2 => newAnswers[q2.id]?.trim());
      if (!allFilled) { setError("Something went wrong. Please try again."); return; }

      setPhase("submit");
      const payload = {
        sessionId: sessionId.current,
        studentName: studentName.trim(),
        answers: QUESTIONS.map(q2 => ({
          question: q2.text,
          answer: newAnswers[q2.id],
        })),
      };
      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Submission failed");
      } catch (err) {
        console.error(err);
        setError(err.message);
        setPhase("quiz");
        return;
      }
      setPhase("done");
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }
        @keyframes floatUp {
          0% { transform: translateY(0) scale(1); opacity: 0.7; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-100vh) scale(0.3); opacity: 0; }
        }
        @keyframes slideInUp {
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideOutUp {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px currentColor; }
          50% { box-shadow: 0 0 40px currentColor, 0 0 80px currentColor; }
        }
        @keyframes iconFloat {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
        }
        @keyframes emojiPop {
          0% { transform: scale(0) rotate(-20deg); }
          60% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }
      `}</style>

      {/* 🎵 AUDIO TAG */}
      <audio ref={audioRef} loop>
        <source src={music} type="audio/mpeg" />
      </audio>

      <Background />
      <div style={{
        minHeight: "100vh", width: "100%", background: "transparent",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", fontFamily: "'Sora', sans-serif",
        position: "relative", overflow: "hidden", padding: "20px 16px",
      }}>

        {/* Ambient glow */}
        <div style={{
          position: "fixed", inset: 0,
          background: `radial-gradient(ellipse at 50% 60%, ${accentColor}15 0%, transparent 70%)`,
          pointerEvents: "none", transition: "background 0.8s ease", zIndex: 0,
        }}/>

        {/* === NAME ENTRY === */}
        {phase === "name" && (
          <div style={{
            animation: "scaleIn 0.5s ease", textAlign: "center",
            zIndex: 1, width: "100%", maxWidth: 420,
          }}>
            <div style={{
              fontSize: 52, marginBottom: 12,
              animation: "iconFloat 3s ease-in-out infinite", display: "inline-block",
            }}>✨</div>
            <h1 style={{
              fontSize: 28, fontWeight: 800,
              background: "linear-gradient(135deg, #e879f9, #c084fc, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 8, letterSpacing: -1,
            }}>Class Poll</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 32 }}>
              Enter your name to begin
            </p>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid #c084fc44`,
              borderRadius: 20, padding: "20px 24px",
              backdropFilter: "blur(16px)", marginBottom: 16,
            }}>
              <div style={{
                minHeight: 52, padding: "14px 16px",
                fontSize: 20, fontWeight: 600,
                color: nameInput ? "#fff" : "rgba(255,255,255,0.3)",
                letterSpacing: 0.5, fontFamily: "'Sora', sans-serif",
                textAlign: "left",
              }}>
                {nameInput || "Your name…"}
                <span style={{
                  display: "inline-block", width: 2, height: 22,
                  background: "#c084fc", marginLeft: 2, verticalAlign: "middle",
                  animation: "pulseGlow 1s ease-in-out infinite",
                  boxShadow: "0 0 8px #c084fc",
                }}/>
              </div>
              <div style={{
                height: 2,
                background: "linear-gradient(90deg, transparent, #c084fc, #e879f9, transparent)",
                borderRadius: 2, backgroundSize: "200% 100%",
                animation: "shimmer 2s linear infinite",
              }}/>
            </div>

            {nameError && (
              <p style={{ color: "#f87171", fontSize: 13, marginBottom: 8 }}>{nameError}</p>
            )}

            <CustomKeyboard
              accentColor="#c084fc"
              onKey={handleNameKey}
              onDelete={handleNameDelete}
              onEnter={handleNameEnter}
            />
            <button
              onPointerDown={(e) => { e.preventDefault(); setNameInput(v => v + " "); }}
              style={{
                marginTop: 6,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid #c084fc33",
                borderRadius: 10, color: "rgba(255,255,255,0.5)",
                fontSize: 13, fontWeight: 600, padding: "8px 60px",
                cursor: "pointer", fontFamily: "'Sora', sans-serif",
              }}>
              SPACE
            </button>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16, padding: "16px 20px", marginTop: 20, textAlign: "left",
            }}>
              <p style={{
                color: "rgba(255,255,255,0.4)", fontSize: 12,
                fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8,
              }}>Instructions</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }}>
                ✓ Answer every question with a roll number<br/>
                ✓ Select from the dropdown provided<br/>
                ✓ Your responses are anonymous
              </p>
            </div>
          </div>
        )}

        {/* === QUIZ === */}
        {phase === "quiz" && (
          <div style={{
            width: "100%", maxWidth: 420, zIndex: 1,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 0,
          }}>
            <Particles color={accentColor} />

            <div style={{
              width: "100%", height: 3,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 99, marginBottom: 20, overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`,
                background: `linear-gradient(90deg, ${accentColor}, #e879f9)`,
                borderRadius: 99, transition: "width 0.5s ease",
                boxShadow: `0 0 10px ${accentColor}`,
              }}/>
            </div>

            <div style={{
              display: "flex", justifyContent: "space-between",
              width: "100%", marginBottom: 12, alignItems: "center",
            }}>
              <span style={{
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
                color: accentColor, fontSize: 12, fontWeight: 700,
                padding: "4px 12px", borderRadius: 99, letterSpacing: 1,
                maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>👤 {studentName}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600 }}>
                {currentQ + 1} / {QUESTIONS.length}
              </span>
            </div>

            <div key={currentQ} style={{
              width: "100%",
              animation: animDir === "in"
                ? "slideInUp 0.45s cubic-bezier(.34,1.56,.64,1)"
                : "slideOutUp 0.35s ease forwards",
              willChange: "transform, opacity",
            }}>
              <div style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${accentColor}33`,
                borderRadius: 24, padding: "28px 24px 24px",
                backdropFilter: "blur(16px)", marginBottom: 16,
                position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", top: -30, right: -30, width: 120, height: 120,
                  background: `radial-gradient(circle, ${accentColor}30, transparent 70%)`,
                  pointerEvents: "none",
                }}/>

                <div style={{
                  display: "flex", justifyContent: "center", gap: 10,
                  marginBottom: 18, animation: "emojiPop 0.5s cubic-bezier(.34,1.56,.64,1)",
                }}>
                  {q.emoji.split("").map((e, i) => (
                    <div key={i} style={{
                      fontSize: 38,
                      filter: `drop-shadow(0 0 12px ${accentColor})`,
                      animation: `iconFloat ${2.5 + i * 0.3}s ease-in-out infinite`,
                      display: "inline-block",
                    }}>{e}</div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", marginLeft: 6, animation: "iconFloat 3.2s ease-in-out infinite" }}>
                    <Icon color={accentColor} />
                  </div>
                </div>

                <h2 style={{
                  fontSize: 20, fontWeight: 700, color: "#fff",
                  textAlign: "center", lineHeight: 1.4, marginBottom: 0,
                  textShadow: `0 0 30px ${accentColor}66`,
                }}>{q.text}</h2>
              </div>

              <div style={{ width: "100%", padding: "0 4px", marginBottom: 16 }}>
                <div style={{
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${accentColor}44`,
                  borderRadius: 16, overflow: "hidden",
                }}>
                  <select
                    value={selectedRoll}
                    onChange={e => setSelectedRoll(e.target.value)}
                    style={{
                      width: "100%", padding: "16px 20px",
                      background: "transparent", color: selectedRoll ? "#fff" : "rgba(255,255,255,0.4)",
                      fontSize: 17, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                      border: "none", outline: "none", cursor: "pointer",
                      appearance: "none", WebkitAppearance: "none",
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M5 7l5 5 5-5' stroke='${encodeURIComponent(accentColor)}' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`,
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 16px center",
                      backgroundSize: "20px",
                    }}>
                    <option value="" disabled style={{ background: "#1a1a2e", color: "rgba(255,255,255,0.5)" }}>
                      Select Roll Number…
                    </option>
                    {GROUP_ORDER.map(group => {
                      const groupOpts = ROLL_OPTIONS.filter(o => o.group === group);
                      if (!groupOpts.length) return null;
                      return (
                        <optgroup key={group} label={group} style={{ background: "#1a1a2e", color: accentColor }}>
                          {groupOpts.map(opt => (
                            <option key={opt.value} value={opt.value}
                              style={{ background: "#1a1a2e", color: "#fff", fontSize: 15 }}>
                              {opt.label}
                            </option>
                          ))}
                        </optgroup>
                      );
                    })}
                  </select>
                </div>

                <div style={{
                  height: 2, marginTop: 2,
                  background: `linear-gradient(90deg, transparent, ${accentColor}, #e879f9, transparent)`,
                  borderRadius: 2, backgroundSize: "200% 100%",
                  animation: "shimmer 2s linear infinite",
                }}/>
              </div>

              <button
                onClick={goNext}
                style={{
                  width: "100%",
                  background: selectedRoll
                    ? `linear-gradient(135deg, ${accentColor}, #e879f9)`
                    : "rgba(255,255,255,0.08)",
                  border: `1px solid ${selectedRoll ? "transparent" : accentColor + "33"}`,
                  borderRadius: 16, padding: "16px",
                  color: selectedRoll ? "#fff" : "rgba(255,255,255,0.4)",
                  fontSize: 16, fontWeight: 800, cursor: "pointer",
                  letterSpacing: 2, fontFamily: "'Sora', sans-serif",
                  transition: "all 0.3s ease",
                  boxShadow: selectedRoll ? `0 8px 32px ${accentColor}44` : "none",
                }}>
                {currentQ < QUESTIONS.length - 1 ? "NEXT →" : "SUBMIT ✓"}
              </button>
            </div>

            {error && (
              <p style={{ color: "#f87171", fontSize: 13, marginTop: 8 }}>{error}</p>
            )}
          </div>
        )}

        {/* === SUBMITTING === */}
        {phase === "submit" && (
          <div style={{ textAlign: "center", animation: "scaleIn 0.5s ease", zIndex: 1 }}>
            <div style={{ fontSize: 60, marginBottom: 16, animation: "iconFloat 2s ease-in-out infinite" }}>⏳</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Submitting your votes…</p>
          </div>
        )}

        {/* === DONE === */}
        {phase === "done" && (
          <div style={{
            textAlign: "center",
            animation: "scaleIn 0.6s cubic-bezier(.34,1.56,.64,1)",
            zIndex: 1, maxWidth: 360, padding: "0 20px",
          }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                position: "fixed", top: "30%", left: `${10 + i * 5.5}%`,
                width: 8, height: 8, borderRadius: "50%",
                background: ["#e879f9","#60a5fa","#fbbf24","#34d399","#f472b6"][i % 5],
                animation: `confetti ${1.5 + Math.random()}s ${Math.random() * 0.5}s ease-out forwards`,
                pointerEvents: "none", zIndex: 999,
              }}/>
            ))}

            <div style={{
              fontSize: 72, marginBottom: 16,
              animation: "iconFloat 2.5s ease-in-out infinite",
              filter: "drop-shadow(0 0 30px #e879f9)",
            }}>🎉</div>

            <h2 style={{
              fontSize: 28, fontWeight: 800,
              background: "linear-gradient(135deg, #e879f9, #c084fc, #fbbf24)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              marginBottom: 12, letterSpacing: -0.5,
            }}>Votes Submitted!</h2>

            <p style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 16, lineHeight: 1.7, marginBottom: 24,
            }}>
              Thank you for participating, <strong style={{ color: "#fff" }}>{studentName}</strong>! 🌟
            </p>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: "24px",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>✨</div>
              <p style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 15, lineHeight: 1.7,
              }}>
                Your responses have been recorded.<br/>
                Stay tuned for the exciting results!
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}