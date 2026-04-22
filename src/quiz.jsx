import { useState, useEffect, useRef } from "react";
import Background from "./globalbackground";

const BACKEND_URL = "https://farewell-backend-2v9n.onrender.com/api/responses/submit"; // 🔗 Replace with your backend URL

const SECTIONS = ["ITA", "ITB", "ITC"];

const QUESTIONS = [
  { id: 1, text: "Who is the best dancer in class?", emoji: "💃🕺", color: "#c084fc" },
  { id: 2, text: "Who is the cutest girl in class?", emoji: "🌸💖", color: "#f472b6" },
  { id: 3, text: "Who is the most stylish boy in class?", emoji: "👑✨", color: "#fbbf24" },
  { id: 4, text: "Who has the best smile in class?", emoji: "😊🌟", color: "#34d399" },
  { id: 5, text: "Who is the most friendly person?", emoji: "🤝💛", color: "#60a5fa" },
  { id: 6, text: "Who is the funniest person in class?", emoji: "😂🎭", color: "#fb923c" },
  { id: 7, text: "Who has the best dressing sense?", emoji: "👗👔", color: "#a78bfa" },
  { id: 8, text: "Who is the silent killer in class?", emoji: "🔥😈", color: "#f87171" },
  { id: 9, text: "Who is the most talented person?", emoji: "🎯🏆", color: "#2dd4bf" },
  { id: 10, text: "Who is the best duo in class?", emoji: "👫💞", color: "#e879f9" },
];

// SVG Icons
const DanceIcon = ({ color }) => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="8" r="4" fill={color} opacity="0.9"/>
    <path d="M12 14c0 0 2-2 6-2s6 2 6 2l2 8-4 1-2-5-2 5-4-1 2-8z" fill={color} opacity="0.8"/>
    <path d="M10 22l4 8M26 22l-4 8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="8" r="3" fill="none" stroke={color} strokeWidth="1" opacity="0.4"/>
  </svg>
);

const StarIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 2l3.5 7.5L28 11l-6 5.5 1.5 8.5L16 21l-7.5 4 1.5-8.5L4 11l8.5-1.5L16 2z" fill={color} opacity="0.85"/>
    <path d="M16 6l2.5 5 5.5 1-4 3.5 1 5.5L16 18l-5 3 1-5.5L8 12l5.5-1L16 6z" fill="white" opacity="0.2"/>
  </svg>
);

const HeartIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 28s-14-9-14-18a8 8 0 0116 0 8 8 0 0116 0c0 9-14 18-14 18z" fill={color} opacity="0.9"/>
    <path d="M16 24s-9-6-9-12a5 5 0 0110 0 5 5 0 0110 0c0 6-9 12-9 12z" fill="white" opacity="0.15"/>
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

const SmileIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill={color} opacity="0.85"/>
    <circle cx="11" cy="13" r="2" fill="white"/>
    <circle cx="21" cy="13" r="2" fill="white"/>
    <path d="M10 19c2 4 10 4 12 0" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const FriendIcon = ({ color }) => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
    <circle cx="12" cy="10" r="5" fill={color} opacity="0.8"/>
    <circle cx="22" cy="10" r="5" fill={color} opacity="0.6"/>
    <path d="M2 28c0-6 4-10 10-10h10c6 0 10 4 10 10" fill={color} opacity="0.5"/>
    <path d="M6 28c0-4 3-8 8-8h8c5 0 8 4 8 8" fill={color} opacity="0.8"/>
  </svg>
);

const LaughIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="14" fill={color} opacity="0.85"/>
    <path d="M9 18c2 6 12 6 14 0" fill="white" opacity="0.9"/>
    <circle cx="11" cy="13" r="2.5" fill="white"/>
    <circle cx="21" cy="13" r="2.5" fill="white"/>
    <path d="M11 10l-3-3M21 10l3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const FashionIcon = ({ color }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 4l4 6h8l4-6" stroke={color} strokeWidth="2" fill="none"/>
    <path d="M6 8l2 4 8 2 8-2 2-4-4-2-2 4-4-1-4 1-2-4z" fill={color} opacity="0.8"/>
    <rect x="10" y="14" width="12" height="14" rx="2" fill={color} opacity="0.7"/>
    <path d="M13 14v14M19 14v14" stroke="white" strokeWidth="1" opacity="0.4"/>
  </svg>
);

const FireIcon = ({ color }) => (
  <svg width="30" height="34" viewBox="0 0 30 34" fill="none">
    <path d="M15 2c0 0-10 8-10 16a10 10 0 0020 0c0-4-2-8-4-10 0 4-2 6-4 6-2 0-4-2-4-6 0 0 2 2 2 4z" fill={color} opacity="0.9"/>
    <path d="M15 16c0 0-4 2-4 6a4 4 0 008 0c0-3-2-5-4-6z" fill="white" opacity="0.3"/>
  </svg>
);

const TrophyIcon = ({ color }) => (
  <svg width="32" height="34" viewBox="0 0 32 34" fill="none">
    <path d="M8 4h16v14a8 8 0 01-16 0V4z" fill={color} opacity="0.85"/>
    <path d="M4 6H8v8c-3 0-4-2-4-4V6zM28 6h-4v8c3 0 4-2 4-4V6z" fill={color} opacity="0.6"/>
    <rect x="12" y="22" width="8" height="6" fill={color} opacity="0.7"/>
    <rect x="8" y="28" width="16" height="4" rx="2" fill={color} opacity="0.8"/>
  </svg>
);

const DuoIcon = ({ color }) => (
  <svg width="36" height="32" viewBox="0 0 36 32" fill="none">
    <circle cx="12" cy="8" r="5" fill={color} opacity="0.85"/>
    <circle cx="24" cy="8" r="5" fill={color} opacity="0.85"/>
    <path d="M2 30c0-6 4-10 10-10h12c6 0 10 4 10 10" fill={color} opacity="0.7"/>
    <path d="M17 13l1 3-2 2-2-2 1-3z" fill="white" opacity="0.6"/>
  </svg>
);

const QUESTION_ICONS = [DanceIcon, HeartIcon, CrownIcon, SmileIcon, FriendIcon, LaughIcon, FashionIcon, FireIcon, TrophyIcon, DuoIcon];

// Numeric Keyboard component
const NumericKeyboard = ({ onKey, onDelete, onEnter, accentColor }) => {
  const rows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["0"],
  ];

  const btnBase = {
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 16,
    transition: "all 0.12s",
    fontFamily: "inherit",
    userSelect: "none",
    WebkitUserSelect: "none",
  };

  const numKeyStyle = {
    ...btnBase,
    background: `rgba(255,255,255,0.08)`,
    color: "#fff",
    width: 60,
    height: 60,
    margin: 6,
    backdropFilter: "blur(8px)",
    boxShadow: `0 0 8px ${accentColor}33`,
    border: `1px solid ${accentColor}30`,
  };

  const specialStyle = {
    ...btnBase,
    background: `${accentColor}33`,
    color: accentColor,
    height: 60,
    margin: 6,
    padding: "0 14px",
    border: `1px solid ${accentColor}55`,
    fontSize: 14,
    minWidth: 100,
  };

  return (
    <div style={{
      width: "100%",
      maxWidth: 280,
      margin: "0 auto",
      padding: "16px 8px 12px",
      borderRadius: 16,
      background: "rgba(0,0,0,0.35)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${accentColor}22`,
    }}>
      {rows.map((row, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>
          {row.map(k => (
            <button
              key={k}
              style={numKeyStyle}
              onPointerDown={e => { e.preventDefault(); onKey(k); }}
            >
              {k}
            </button>
          ))}
        </div>
      ))}

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
        <button
          style={{ ...specialStyle, flex: 1, maxWidth: 140 }}
          onPointerDown={e => { e.preventDefault(); onDelete(); }}
        >
          ⌫ DEL
        </button>
        <button
          style={{ ...specialStyle, flex: 1, maxWidth: 140 }}
          onPointerDown={e => { e.preventDefault(); onEnter(); }}
        >
          NEXT →
        </button>
      </div>
    </div>
  );
};

// Floating particles
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

export default function Quiz() {
  const [phase, setPhase] = useState("privacy"); // privacy | section | quiz | submit | done
  const [section, setSection] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [inputVal, setInputVal] = useState("");
  const [animDir, setAnimDir] = useState("in"); // in | out
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const getSessionId = () => {
    let id = localStorage.getItem("sessionId");
    if (!id) {
      id = "anon_" + crypto.randomUUID();
      localStorage.setItem("sessionId", id);
    }
    return id;
  };

  const sessionId = useRef(getSessionId());
  const q = QUESTIONS[currentQ];
  const Icon = QUESTION_ICONS[currentQ];
  const accentColor = q?.color || "#c084fc";

  const handleDelete = () => setInputVal(v => v.slice(0, -1));

  const goNext = async () => {
    if (!inputVal.trim()) return;
    const newAnswers = { ...answers, [q.id]: inputVal.trim() };
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setAnimDir("out");
      setTimeout(() => {
        setCurrentQ(c => c + 1);
        setInputVal("");
        setAnimDir("in");
      }, 400);
    } else {
      // Submit
      setPhase("submit");
      setSubmitting(true);
      const payload = {
        sessionId: sessionId.current,
        section,
        answers: QUESTIONS.map(q2 => ({
          question: q2.text,
          answer: newAnswers[q2.id] || "",
        })),
      };
      try {
        const res = await fetch(BACKEND_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Submission failed");
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
        setPhase("quiz"); // go back if failed
        return;
      }
      setSubmitting(false);
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
        @keyframes sectionHover {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
        }
        @keyframes inputUnderline {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes emojiPop {
          0% { transform: scale(0) rotate(-20deg); }
          60% { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0); }
        }
        .section-btn:hover { transform: translateY(-6px) scale(1.04) !important; }
        .section-btn:active { transform: scale(0.97) !important; }
      `}</style>

      <Background />
      <div style={{
        minHeight: "100vh",
        width: "100%",
        background: "transparent",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Sora', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "20px 16px",
      }}>

        {/* Ambient glow */}
        <div style={{
          position: "fixed",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 60%, ${accentColor}15 0%, transparent 70%)`,
          pointerEvents: "none",
          transition: "background 0.8s ease",
          zIndex: 0,
        }}/>

        {/* === PRIVACY NOTICE === */}
        {phase === "privacy" && (
          <div style={{
            animation: "scaleIn 0.5s ease",
            textAlign: "center",
            zIndex: 1,
            width: "100%",
            maxWidth: 420,
            padding: "20px",
          }}>
            <div style={{
              fontSize: 56,
              marginBottom: 16,
              animation: "iconFloat 3s ease-in-out infinite",
              display: "inline-block",
            }}>🔒</div>

            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              background: "linear-gradient(135deg, #e879f9, #c084fc, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 12,
              letterSpacing: -1,
            }}>Privacy & Anonymity</h1>

            <p style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 15,
              lineHeight: 1.8,
              marginBottom: 24,
              textAlign: "left",
            }}>
              ✓ <strong>Your Anonymous ID has been saved.</strong><br/>
              ✓ This ID is <strong>NOT revealed</strong> to anyone.<br/>
              ✓ Your votes are <strong>completely confidential.</strong><br/>
              ✓ Data is <strong>never shared</strong> with third parties.<br/>
              ✓ Your privacy and anonymity are guaranteed.
            </p>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 16,
              padding: "16px",
              marginBottom: 24,
              fontSize: 13,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.6,
            }}>
              <p>📋 By voting, you agree that your responses are anonymous and will only be used for creating class superlatives.</p>
            </div>

            <button
              onClick={() => setPhase("section")}
              style={{
                background: "linear-gradient(135deg, #e879f9, #c084fc)",
                border: "none",
                borderRadius: 12,
                padding: "14px 40px",
                color: "#fff",
                fontSize: 16,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: 1,
                transition: "all 0.3s ease",
                boxShadow: "0 8px 24px rgba(232, 121, 249, 0.4)",
                fontFamily: "'Sora', sans-serif",
              }}
              onMouseEnter={e => e.target.style.transform = "translateY(-2px)"}
              onMouseLeave={e => e.target.style.transform = "translateY(0)"}
            >
              I UNDERSTAND ✓
            </button>
          </div>
        )}

        {/* === SECTION SELECTION === */}
        {phase === "section" && (
          <div style={{
            animation: "scaleIn 0.5s ease",
            textAlign: "center",
            zIndex: 1,
            width: "100%",
            maxWidth: 400,
          }}>
            <div style={{
              fontSize: 52,
              marginBottom: 8,
              animation: "iconFloat 3s ease-in-out infinite",
              display: "inline-block",
            }}>🎓</div>
            <h1 style={{
              fontSize: 28,
              fontWeight: 800,
              background: "linear-gradient(135deg, #e879f9, #c084fc, #60a5fa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 6,
              letterSpacing: -1,
            }}>Class Poll 2024</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 36 }}>
              Choose your section to begin
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SECTIONS.map((sec, i) => {
                const colors = ["#c084fc", "#f472b6", "#60a5fa"];
                const c = colors[i];
                return (
                  <button key={sec} className="section-btn"
                    onClick={() => { setSection(sec); setPhase("quiz"); }}
                    style={{
                      background: `linear-gradient(135deg, ${c}22, ${c}11)`,
                      border: `2px solid ${c}55`,
                      borderRadius: 18,
                      padding: "20px 32px",
                      color: "#fff",
                      fontSize: 22,
                      fontWeight: 800,
                      cursor: "pointer",
                      letterSpacing: 4,
                      transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
                      backdropFilter: "blur(12px)",
                      boxShadow: `0 8px 32px ${c}22`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: "'Sora', sans-serif",
                    }}>
                    <span style={{ fontSize: 28 }}>
                      {["🔴", "🔵", "🟢"][i]}
                    </span>
                    <span>{sec}</span>
                    <span style={{ color: c, fontSize: 20 }}>→</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* === QUIZ === */}
        {phase === "quiz" && (
          <div style={{
            width: "100%",
            maxWidth: 420,
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}>
            <Particles color={accentColor} />

            {/* Progress bar */}
            <div style={{
              width: "100%",
              height: 3,
              background: "rgba(255,255,255,0.08)",
              borderRadius: 99,
              marginBottom: 20,
              overflow: "hidden",
            }}>
              <div style={{
                height: "100%",
                width: `${((currentQ + 1) / QUESTIONS.length) * 100}%`,
                background: `linear-gradient(90deg, ${accentColor}, #e879f9)`,
                borderRadius: 99,
                transition: "width 0.5s ease",
                boxShadow: `0 0 10px ${accentColor}`,
              }}/>
            </div>

            {/* Section badge + counter */}
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              marginBottom: 12,
              alignItems: "center",
            }}>
              <span style={{
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}44`,
                color: accentColor,
                fontSize: 12,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 99,
                letterSpacing: 2,
              }}>{section}</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, fontWeight: 600 }}>
                {currentQ + 1} / {QUESTIONS.length}
              </span>
            </div>

            {/* Question Card */}
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
                borderRadius: 24,
                padding: "28px 24px 24px",
                backdropFilter: "blur(16px)",
                marginBottom: 20,
                position: "relative",
                overflow: "hidden",
              }}>
                {/* Glow corner */}
                <div style={{
                  position: "absolute",
                  top: -30,
                  right: -30,
                  width: 120,
                  height: 120,
                  background: `radial-gradient(circle, ${accentColor}30, transparent 70%)`,
                  pointerEvents: "none",
                }}/>

                {/* Emoji icons */}
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 18,
                  animation: "emojiPop 0.5s cubic-bezier(.34,1.56,.64,1)",
                }}>
                  {q.emoji.split("").map((e, i) => (
                    <div key={i} style={{
                      fontSize: 38,
                      filter: `drop-shadow(0 0 12px ${accentColor})`,
                      animation: `iconFloat ${2.5 + i * 0.3}s ease-in-out infinite`,
                      display: "inline-block",
                    }}>{e}</div>
                  ))}
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 6,
                    animation: `iconFloat 3.2s ease-in-out infinite`,
                  }}>
                    <Icon color={accentColor} />
                  </div>
                </div>

                {/* Question text */}
                <h2 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#fff",
                  textAlign: "center",
                  lineHeight: 1.4,
                  marginBottom: 0,
                  textShadow: `0 0 30px ${accentColor}66`,
                }}>{q.text}</h2>
              </div>

              {/* Input area */}
              <div style={{
                width: "100%",
                padding: "0 4px",
                marginBottom: 16,
              }}>
                <div style={{
                  position: "relative",
                  width: "100%",
                }}>
                  {/* The displayed text - not an actual input */}
                  <div style={{
                    minHeight: 52,
                    padding: "14px 16px",
                    fontSize: 24,
                    fontWeight: 700,
                    color: inputVal ? "#fff" : "rgba(255,255,255,0.3)",
                    letterSpacing: 2,
                    fontFamily: "'Sora', sans-serif",
                    position: "relative",
                  }}>
                    {inputVal || "Enter Roll Number..."}
                    {/* Cursor */}
                    {inputVal && (
                      <span style={{
                        display: "inline-block",
                        width: 2,
                        height: 24,
                        background: accentColor,
                        marginLeft: 4,
                        verticalAlign: "middle",
                        animation: "pulseGlow 1s ease-in-out infinite",
                        boxShadow: `0 0 8px ${accentColor}`,
                      }}/>
                    )}
                  </div>
                  {/* Animated underline */}
                  <div style={{
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${accentColor}, #e879f9, transparent)`,
                    borderRadius: 2,
                    backgroundSize: "200% 100%",
                    animation: "shimmer 2s linear infinite",
                  }}/>
                </div>
              </div>
            </div>

            {/* Numeric Keyboard */}
            <NumericKeyboard
              accentColor={accentColor}
              onKey={(k) => setInputVal(v => v + k)}
              onDelete={handleDelete}
              onEnter={goNext}
            />

            {error && (
              <p style={{ color: "#f87171", fontSize: 13, marginTop: 12 }}>{error}</p>
            )}
          </div>
        )}

        {/* === SUBMITTING === */}
        {phase === "submit" && (
          <div style={{
            textAlign: "center",
            animation: "scaleIn 0.5s ease",
            zIndex: 1,
          }}>
            <div style={{ fontSize: 60, marginBottom: 16, animation: "iconFloat 2s ease-in-out infinite" }}>⏳</div>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16 }}>Submitting your votes...</p>
          </div>
        )}

        {/* === DONE === */}
        {phase === "done" && (
          <div style={{
            textAlign: "center",
            animation: "scaleIn 0.6s cubic-bezier(.34,1.56,.64,1)",
            zIndex: 1,
            maxWidth: 360,
            padding: "0 20px",
          }}>
            {/* Confetti dots */}
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                position: "fixed",
                top: "30%",
                left: `${10 + i * 5.5}%`,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: ["#e879f9","#60a5fa","#fbbf24","#34d399","#f472b6"][i % 5],
                animation: `confetti ${1.5 + Math.random()}s ${Math.random() * 0.5}s ease-out forwards`,
                pointerEvents: "none",
                zIndex: 999,
              }}/>
            ))}

            <div style={{
              fontSize: 72,
              marginBottom: 16,
              animation: "iconFloat 2.5s ease-in-out infinite",
              filter: "drop-shadow(0 0 30px #e879f9)",
            }}>🎉</div>

            <h2 style={{
              fontSize: 28,
              fontWeight: 800,
              background: "linear-gradient(135deg, #e879f9, #c084fc, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 12,
              letterSpacing: -0.5,
            }}>Votes Submitted!</h2>

            <p style={{
              color: "rgba(255,255,255,0.65)",
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 24,
            }}>
              Thank you for voting, <strong style={{ color: "#fff" }}>{section}</strong>! 🌟<br/>
              Stay tuned for the exciting results!
            </p>

            <div style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "20px 24px",
              backdropFilter: "blur(12px)",
            }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📅</div>
              <p style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 4,
              }}>Results Announce On</p>
              <p style={{
                fontSize: 26,
                fontWeight: 800,
                background: "linear-gradient(90deg, #fbbf24, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1,
              }}>April 24, 2025</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginTop: 6 }}>
                Wait for the surprise! ✨
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}