import { useState, useEffect, useRef } from "react";
import Background from "./globalbackground";
import img01 from "./assets/01.jpg";
import img03 from "./assets/03.jpg";
import img04 from "./assets/04.jpg";
import img14 from "./assets/14.jpg";
import img20 from "./assets/20.jpg";
import img37 from "./assets/37.jpg";
import img51 from "./assets/51.jpg";
import img61 from "./assets/61.jpg";
import img64 from "./assets/64.jpg";
import img67 from "./assets/67.jpg";
import img70 from "./assets/70.jpg";
import img75 from "./assets/75.jpg";
import img80 from "./assets/80.jpg";
import img87 from "./assets/87.jpg";

import imga8 from "./assets/a8.JPG";
import imgb8 from "./assets/b8.jpeg";

import imge9 from "./assets/e9.jpg";

import imgf2 from "./assets/f2.jpeg";
import imgf5 from "./assets/f5.png";

import imgg2 from "./assets/g2.jpg";
import imgg5 from "./assets/g5.jpg";

import imgh0 from "./assets/h0.jpg";
import imgh4 from "./assets/h4.jpg";



import imgi1 from "./assets/i1.jpg";
import imgi3 from "./assets/i3.jpg";
import img72 from "./assets/72.jpg";



const BATCHES = ["ITA", "ITB", "ITC"];

const QUESTIONS_TEMPLATE = [
  { templateId: 1, text: "Who is the most dramatic person in class?", color: "#c084fc" },
  { templateId: 2, text: "Who is the funniest person in class?", color: "#fb923c" },
  { templateId: 3, text: "Who is the friendliest person in class?", color: "#a78bfa" },
  { templateId: 4, text: "Who is the most hyperactive person in class?", color: "#22c55e" },
  { templateId: 5, text: "Who is always online 24/7?", color: "#38bdf8" },
  { templateId: 6, text: "Who is the late comer in class?", color: "#34d399" },
  { templateId: 7, text: "Who is the most aesthetic person in class?", color: "#f472b6" },
  { templateId: 8, text: "Who is the silent killer in class?", color: "#f87171" },
  { templateId: 9, text: "Who is the coder of the class?", color: "#2dd4bf" },
  { templateId: 10, text: "Who will become a CEO in the future?", color: "#fbbf24" },
];

const QUESTIONS = BATCHES.flatMap((batch, bi) =>
  QUESTIONS_TEMPLATE.map((q) => ({
    ...q,
    id: bi * 10 + q.templateId,
    batch,
  }))
);

// ─────────────────────────────────────────────
// ANSWERS — fill in name, photo URL, and tag
// tag = short award label shown on answer screen
// ─────────────────────────────────────────────
const ANSWERS = {
 
  ITA: {
    1:  { name: "Chinta Sai Praneeth",  photo: img14, tag: "Most Dramatic" },
    2:  { name: "bhuvana chandra battula",  photo: img04, tag: "Funniest" },
    3:  { name: "Pudi Rahul",  photo: img51, tag: "Friendliest" },
    4:  { name: "A hemanth Venkata Sai",   photo: img03, tag: "Most Hyperactive" },
    5:  { name: "Turimella Vasavi ",   photo: img61, tag: "Always Online 24/7" },
    6:  { name: "A hemanth Venkata Sai",  photo: img03, tag: "Late Comer" },
    7:  { name: "Gontla Venkata Sai Ketan ", photo: img20, tag: "Most Aesthetic" },
    8:  { name: "Myla Sai Saranya ", photo: img37, tag: "Silent Killer" },
    9:  { name: "Velpula Vishnu Vardhan",  photo: img64, tag: "The Coder" },
    10: { name: "Akkalreddy Vijitha Reddy", photo: img01, tag: "Future CEO" },
  },
  ITB: {
    1:  { name: "Damera Harika",     photo: img80,  tag: "Most Dramatic"    },
    2:  { name: "Chalamalasetti Abhinaya",    photo: img75,  tag: "Funniest"         },
    3:  { name: "Meesala Mohan Bala Sahith ",     photo: imga8,  tag: "Friendliest"      },
    4:  { name: "Bandlamudi Harshitha",    photo: img70,  tag: "Most Hyperactive" },
    5:  { name: "Ampa Venu",   photo: img67,  tag: "Always Online 24/7" },
    6:  { name: "Pittala Siddhartha ",   photo: imgb8,  tag: "Late Comer"       },
    7:  { name: "Bondada Haisha",     photo: img72,  tag: "Most Aesthetic"   },
    8:  { name: "Gatta Poojitha naga kiranmai",    photo: img87,  tag: "Silent Killer"    },
    9:  { name: "Damera Harika",    photo: img80,  tag: "The Coder"        },
    10: { name: "Pittala Siddhartha ",    photo: imgb8,  tag: "Future CEO"       },
  },
  ITC: {
    1:  { name: "Sarayu Guntupalli",  photo: imgf2,  tag: "Most Dramatic"    },
    2:  { name: " Gavara Teja",     photo:imge9,  tag: "Funniest"         },
    3:  { name: "Gurram Neeraja ",    photo: imgf5,  tag: "Friendliest"      },
    4:  { name: "lokesh narne",    photo: imgh4 , tag: "Most Hyperactive" },
    5:  { name: "Kola Divitha ",     photo: imgg2,  tag: "Always Online 24/7" },
    6:  { name: "Kuppala Ashritha Shyli",    photo: imgg5,  tag: "Late Comer"       },
    7:  { name: "Pilli Haneesh",     photo: imgi1,  tag: "Most Aesthetic"   },
    8:  { name: "Potluri Supraja",   photo: imgi3,  tag: "Silent Killer"    },
    9:  { name: "Matta Eleshaddai Roshan ", photo: imgh0,  tag: "The Coder"        },
    10: { name: "lokesh narne",      photo: imgh4, tag: "Future CEO"       },
  },
};

// SVG Icons
const IconFullscreen = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);

const IconExitFullscreen = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
  </svg>
);

const IconStar = ({ color, size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const IconSparkle = ({ color, size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2 L13.5 9 L20 10.5 L13.5 12 L12 19 L10.5 12 L4 10.5 L10.5 9 Z" />
  </svg>
);

const IconTrophy = ({ color, size = 52 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M6 3h12v10a6 6 0 0 1-12 0V3Z" />
    <path d="M12 19v2M8 21h8" />
  </svg>
);

const QuestionIcon = ({ templateId, color, size = 56 }) => {
  const icons = {
    1: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="8" cy="10" r="4" /><circle cx="16" cy="10" r="4" />
        <path d="M6 11.5c.4 1.2 1.1 2 2 2s1.6-.8 2-2" />
        <path d="M14 12.5c.4-1.2 1.1-1.8 2-1.8s1.6.6 2 1.8" />
        <path d="M4 20l2.5-4M20 20l-2.5-4" />
      </svg>
    ),
    2: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 14s1.5 3 4 3 4-3 4-3" />
        <circle cx="9" cy="9" r="1" fill={color} /><circle cx="15" cy="9" r="1" fill={color} />
      </svg>
    ),
    3: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    4: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    5: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <rect x="7" y="2" width="10" height="20" rx="2" />
        <circle cx="12" cy="17" r="1" fill={color} />
        <line x1="10" y1="6" x2="14" y2="6" />
      </svg>
    ),
    6: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    7: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    8: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} opacity="0.9">
        <path d="M12 2c0 0-4 5-4 10a4 4 0 0 0 8 0C16 7 12 2 12 2z" />
        <path d="M9 13c0 1.66 1.34 3 3 3s3-1.34 3-3" fill="none" stroke={color} strokeWidth="1.5" />
      </svg>
    ),
    9: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    10: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  };
  return icons[templateId] || <IconStar color={color} size={size} />;
};

export default function SuperlativesQuiz() {
  const [phase, setPhase] = useState("start");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentBatchIdx, setCurrentBatchIdx] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentQuestion = QUESTIONS[currentIndex];
  const currentAnswer = currentQuestion
    ? ANSWERS[currentQuestion.batch][currentQuestion.templateId]
    : null;

  const batchColors = { ITA: "#c084fc", ITB: "#38bdf8", ITC: "#34d399" };
  const batch = currentQuestion?.batch || BATCHES[currentBatchIdx];
  const batchColor = batchColors[batch] || "#c084fc";

  const advance = () => {
    if (phase === "start") {
      setCurrentIndex(0);
      setCurrentBatchIdx(0);
      setPhase("batchIntro");
      return;
    }
    if (phase === "batchIntro") { setPhase("question"); return; }
    if (phase === "question")   { setPhase("answer");   return; }
    if (phase === "answer") {
      const nextIdx = currentIndex + 1;
      if (nextIdx >= QUESTIONS.length) { setPhase("finale"); return; }
      const nextBatch = QUESTIONS[nextIdx].batch;
      const curBatch  = QUESTIONS[currentIndex].batch;
      setCurrentIndex(nextIdx);
      if (nextBatch !== curBatch) {
        setCurrentBatchIdx((b) => b + 1);
        setPhase("batchIntro");
      } else {
        setPhase("question");
      }
    }
  };

  const goBack = () => {
    if (phase === "answer")                           { setPhase("question"); return; }
    if (phase === "question" && currentIndex > 0)    { setCurrentIndex(currentIndex - 1); setPhase("answer"); }
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); advance(); }
      if (e.key === "ArrowLeft")                   { e.preventDefault(); goBack(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, currentIndex]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) { document.documentElement.requestFullscreen?.(); setIsFullscreen(true); }
    else                              { document.exitFullscreen?.();                    setIsFullscreen(false); }
  };
  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", h);
    return () => document.removeEventListener("fullscreenchange", h);
  }, []);

  return (
    <div
      onClick={advance}
      style={{
        position: "fixed", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Outfit','Inter',sans-serif",
        overflow: "hidden", cursor: "pointer",
      }}
    >
      <Background />

      {/* Fullscreen button */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }}
        style={{
          position: "fixed", top: "1.2rem", right: "1.2rem", zIndex: 1000,
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)",
          borderRadius: "8px", padding: "8px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        {isFullscreen ? <IconExitFullscreen /> : <IconFullscreen />}
      </button>

      {/* ── START ── */}
      {phase === "start" && (
        <div style={{ textAlign: "center", color: "#fff", zIndex: 10, animation: "fadeIn 0.8s ease-out", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "2rem" }}>
            <IconStar color="#c084fc" size={30} />
            <IconStar color="#f472b6" size={44} />
            <IconStar color="#fbbf24" size={30} />
          </div>
          <div style={{
            fontSize: "clamp(3.5rem,10vw,6rem)", fontWeight: "800", letterSpacing: "-3px", marginBottom: "0.5rem",
            background: "linear-gradient(135deg,#c084fc 0%,#f472b6 50%,#fbbf24 100%)",
            backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Farewell</div>
          <div style={{ fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: "700", color: "rgba(255,255,255,0.85)", marginBottom: "1rem", letterSpacing: "2px" }}>
            2022 — 2026 Batch
          </div>
          <div style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.5)", marginBottom: "3.5rem", lineHeight: "1.7" }}>
            Celebrating unforgettable moments and amazing personalities
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", color: "rgba(255,255,255,0.45)", fontSize: "0.95rem" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            Tap or press Space to begin
          </div>
        </div>
      )}

      {/* ── BATCH INTRO ── */}
      {phase === "batchIntro" && (
        <div key={`intro-${batch}`} style={{ textAlign: "center", color: "#fff", zIndex: 10, animation: "scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1)", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "2.5rem" }}>
            <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
              <circle cx="45" cy="45" r="40" stroke={batchColor} strokeWidth="1.5" opacity="0.25" />
              <circle cx="45" cy="45" r="32" stroke={batchColor} strokeWidth="1.5" opacity="0.45" />
              <circle cx="45" cy="45" r="22" fill={batchColor} opacity="0.12" />
              <text x="45" y="52" textAnchor="middle" fill={batchColor} fontSize="16" fontWeight="700" fontFamily="Outfit,sans-serif">{batch}</text>
            </svg>
          </div>
          <div style={{ fontSize: "1rem", color: "rgba(255,255,255,0.45)", letterSpacing: "4px", textTransform: "uppercase", marginBottom: "1rem" }}>
            Now presenting
          </div>
          <div style={{ fontSize: "clamp(3rem,10vw,5.5rem)", fontWeight: "800", letterSpacing: "-2px", color: batchColor }}>
            {batch}
          </div>
          <div style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.35)", marginTop: "1.2rem" }}>
            {QUESTIONS_TEMPLATE.length} awards to reveal
          </div>
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={batchColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.6" style={{ animation: "bounce 1.4s ease-in-out infinite" }}>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      )}

      {/* ── QUESTION ── */}
      {phase === "question" && currentQuestion && (
        <div key={`q-${currentQuestion.id}`} style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.5s ease-out", padding: "2rem", zIndex: 10,
        }}>
          <div style={{
            position: "absolute", top: "2.5rem",
            padding: "6px 20px", borderRadius: "50px",
            border: `1px solid ${batchColor}60`, color: batchColor,
            fontSize: "0.9rem", fontWeight: "700", letterSpacing: "3px",
            background: `${batchColor}15`,
          }}>{currentQuestion.batch}</div>

          <div style={{ marginBottom: "2.5rem", animation: "floatUp 0.55s ease-out" }}>
            <QuestionIcon templateId={currentQuestion.templateId} color={currentQuestion.color} size={64} />
          </div>

          <div style={{
            fontSize: "clamp(2rem,5.5vw,4rem)", fontWeight: "800",
            color: "#fff", textAlign: "center",
            maxWidth: "78vw", lineHeight: "1.15", letterSpacing: "-0.5px",
            animation: "floatUp 0.55s ease-out 0.1s both",
          }}>
            {currentQuestion.text}
          </div>

          {/* Progress dots */}
          <div style={{ position: "absolute", bottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  width: i === currentIndex ? "18px" : "5px", height: "5px", borderRadius: "3px",
                  background: i === currentIndex ? currentQuestion.color : i < currentIndex ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
                  transition: "all 0.3s ease",
                }} />
              ))}
            </div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", fontWeight: "500" }}>
              {currentIndex + 1} / {QUESTIONS.length}
            </div>
          </div>
        </div>
      )}

      {/* ── ANSWER ── */}
      {phase === "answer" && currentQuestion && currentAnswer && (
        <div key={`a-${currentQuestion.id}`} style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.5s ease-out", padding: "2rem", zIndex: 10,
        }}>
          <div style={{
            position: "absolute", top: "2.5rem",
            padding: "6px 20px", borderRadius: "50px",
            border: `1px solid ${batchColor}60`, color: batchColor,
            fontSize: "0.9rem", fontWeight: "700", letterSpacing: "3px",
            background: `${batchColor}15`,
          }}>{currentQuestion.batch}</div>

          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1.3fr",
            gap: "clamp(2rem,5vw,5rem)", alignItems: "center", maxWidth: "88vw",
          }}>
            {/* Clean circular photo */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{
                width: "clamp(150px,20vw,280px)", aspectRatio: "1",
                borderRadius: "50%", overflow: "hidden",
                animation: "scaleIn 0.65s cubic-bezier(0.34,1.56,0.64,1)",
              }}>
                <img
                  src={currentAnswer.photo}
                  alt={currentAnswer.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>

            {/* Name + Tag */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
              <div style={{
                fontSize: "clamp(2rem,4.5vw,3.8rem)", fontWeight: "800",
                color: "#fff", lineHeight: "1.1", letterSpacing: "-0.5px",
                animation: "floatUp 0.55s ease-out 0.12s both",
              }}>
                {currentAnswer.name}
              </div>

              <div style={{
                padding: "12px 24px", borderRadius: "10px",
                border: `2px solid ${currentQuestion.color}`,
                background: `${currentQuestion.color}18`,
                color: currentQuestion.color,
                fontSize: "clamp(1rem,1.8vw,1.45rem)", fontWeight: "700",
                letterSpacing: "0.3px", maxWidth: "fit-content",
                animation: "floatUp 0.55s ease-out 0.25s both",
              }}>
                {currentAnswer.tag}
              </div>

              <div style={{ display: "flex", gap: "8px", animation: "floatUp 0.55s ease-out 0.38s both" }}>
                <IconSparkle color={currentQuestion.color} size={18} />
                <IconSparkle color={currentQuestion.color} size={13} />
                <IconSparkle color={currentQuestion.color} size={18} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── FINALE ── */}
      {phase === "finale" && (
        <div style={{ textAlign: "center", color: "#fff", zIndex: 10, animation: "scaleIn 0.8s cubic-bezier(0.34,1.56,0.64,1)", padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "1rem", marginBottom: "2.5rem" }}>
            <div style={{ animation: "floatUp 0.5s ease-out 0.2s both" }}><IconStar color="#a78bfa" size={34} /></div>
            <div style={{ animation: "floatUp 0.5s ease-out both" }}><IconTrophy color="#fbbf24" size={70} /></div>
            <div style={{ animation: "floatUp 0.5s ease-out 0.2s both" }}><IconStar color="#f472b6" size={34} /></div>
          </div>
          <div style={{
            fontSize: "clamp(3rem,9vw,5.5rem)", fontWeight: "800", letterSpacing: "-2px", marginBottom: "1rem",
            background: "linear-gradient(135deg,#fbbf24 0%,#f472b6 50%,#c084fc 100%)",
            backgroundClip: "text", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Goodbye!</div>
          <div style={{ fontSize: "clamp(1.2rem,3vw,1.8rem)", fontWeight: "600", color: "rgba(255,255,255,0.7)", marginBottom: "0.75rem" }}>
            2022 — 2026 Batch
          </div>
          <div style={{ fontSize: "1.05rem", color: "rgba(255,255,255,0.45)", lineHeight: "1.8", maxWidth: "500px", margin: "0 auto 2.5rem" }}>
            Thank you for all the memories, laughter, and friendships. Wishing every one of you an incredible journey ahead.
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            {BATCHES.map((b) => (
              <div key={b} style={{
                padding: "8px 22px", borderRadius: "50px",
                border: `1.5px solid ${batchColors[b]}80`,
                color: batchColors[b], fontSize: "1rem", fontWeight: "700", letterSpacing: "2px",
                background: `${batchColors[b]}15`,
              }}>{b}</div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "14px", marginTop: "2.5rem" }}>
            {["#c084fc","#f472b6","#fbbf24","#38bdf8","#34d399"].map((c, i) => (
              <div key={i} style={{ animation: `bounce ${1.2 + i * 0.15}s ease-in-out infinite` }}>
                <IconSparkle color={c} size={20} />
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.75) } to { opacity: 1; transform: scale(1) } }
        @keyframes floatUp { from { opacity: 0; transform: translateY(22px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes bounce  { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
        * { box-sizing: border-box }
        body { margin: 0; padding: 0 }
      `}</style>
    </div>
  );
}