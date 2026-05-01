import { useState, useEffect, useRef } from "react";

const API_URL = "https://farewell-backend-2v9n.onrender.com/api/responses";

// ── Helpers ─────────────────────────────────────────────────────────────────

function tallyVotes(data) {
  // { question: { roll: count } }
  const tally = {};
  if (!data) return tally;
  data.forEach(entry => {
    entry.answers.forEach(({ question, answer }) => {
      if (!tally[question]) tally[question] = {};
      tally[question][answer] = (tally[question][answer] || 0) + 1;
    });
  });
  return tally;
}

function getPersonalResults(data, roll) {
  if (!data || !roll) return {};
  // { question: [voter1, voter2, ...] }
  const res = {};
  data.forEach(entry => {
    entry.answers.forEach(({ question, answer }) => {
      if (answer === roll) {
        if (!res[question]) res[question] = [];
        res[question].push(entry.studentName || "Anonymous");
      }
    });
  });
  return res;
}

const ROLL_OPTIONS = (() => {
  const opts = [];
  for (let i = 66; i <= 99; i++) opts.push(`238W1A12${i}`);
  ["A","B","C"].forEach(l => { for (let i = 0; i <= 9; i++) opts.push(`238W1A12${l}${i}`); });
  opts.push("238W1A12D0");
  for (let i = 7; i <= 13; i++) opts.push(`248W5A12LE${i}`);
  return opts;
})();

const MEDAL = ["🥇","🥈","🥉"];
const QUESTION_COLORS = [
  "#f472b6","#2dd4bf","#60a5fa","#c084fc","#fbbf24",
  "#38bdf8","#fb923c","#60a5fa","#f87171","#fbbf24",
  "#34d399","#38bdf8","#94a3b8","#60a5fa","#a78bfa",
  "#fb923c","#fb923c","#c084fc","#2dd4bf","#fbbf24",
];

// ── Icons ────────────────────────────────────────────────────────────────────

const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36"/>
  </svg>
);

const TrophyIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={color} opacity="0.9">
    <path d="M6 2h12v8a6 6 0 01-12 0V2z"/><path d="M4 4H2a2 2 0 000 4h2M20 4h2a2 2 0 010 4h-2M9 18v2H7v2h10v-2h-2v-2"/>
    <rect x="9" y="18" width="6" height="1" rx="0.5"/>
  </svg>
);

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

// ── Vote Bar ─────────────────────────────────────────────────────────────────

function VoteBar({ roll, count, max, rank, color, isHighlighted }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, marginBottom: 8,
      background: isHighlighted ? `${color}18` : "transparent",
      borderRadius: 10, padding: isHighlighted ? "6px 10px" : "4px 10px",
      border: isHighlighted ? `1px solid ${color}44` : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <span style={{ width: 28, fontSize: 14, textAlign: "center" }}>
        {rank <= 2 ? MEDAL[rank] : ""}
      </span>
      <span style={{
        minWidth: 110, fontSize: 12, fontWeight: 700,
        color: isHighlighted ? color : "rgba(255,255,255,0.7)",
        fontFamily: "monospace", letterSpacing: 0.5,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {roll}
      </span>
      <div style={{ flex: 1, height: 7, background: "rgba(255,255,255,0.07)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          borderRadius: 99,
          transition: "width 0.8s cubic-bezier(.34,1.3,.64,1)",
          boxShadow: pct === 100 ? `0 0 8px ${color}` : "none",
        }}/>
      </div>
      <span style={{
        minWidth: 28, fontSize: 13, fontWeight: 800,
        color: isHighlighted ? color : "rgba(255,255,255,0.55)",
        textAlign: "right",
      }}>{count}</span>
    </div>
  );
}

// ── Question Card ─────────────────────────────────────────────────────────────

function QuestionCard({ question, votes, color, idx, highlightRoll }) {
  const [open, setOpen] = useState(false);
  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const winner = sorted[0]?.[0];
  const totalVotes = sorted.reduce((s, [, c]) => s + c, 0);
  const showAll = open || sorted.length <= 3;
  const visible = showAll ? sorted : sorted.slice(0, 3);
  const isPersonalWinner = highlightRoll && winner === highlightRoll;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}28`,
      borderRadius: 18,
      padding: "20px 20px 16px",
      marginBottom: 16,
      animation: `slideUp 0.4s ${idx * 0.04}s ease both`,
      position: "relative", overflow: "hidden",
    }}>
      {/* accent stripe */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 4,
        background: `linear-gradient(180deg, ${color}, ${color}44)`,
        borderRadius: "18px 0 0 18px",
      }}/>

      <div style={{ paddingLeft: 12 }}>
        {/* Question header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <p style={{
              color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 700,
              letterSpacing: 2, textTransform: "uppercase", marginBottom: 4,
            }}>Q{idx + 1}</p>
            <p style={{ color: "#fff", fontSize: 15, fontWeight: 700, lineHeight: 1.4 }}>
              {question}
            </p>
          </div>
          <div style={{
            background: `${color}22`, border: `1px solid ${color}44`,
            borderRadius: 10, padding: "6px 12px", textAlign: "center", flexShrink: 0,
          }}>
            <p style={{ color: color, fontSize: 18, fontWeight: 800, lineHeight: 1 }}>{totalVotes}</p>
            <p style={{ color: `${color}99`, fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}>votes</p>
          </div>
        </div>

        {/* Winner badge */}
        {winner && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${color}15`, border: `1px solid ${color}33`,
            borderRadius: 10, padding: "8px 14px", marginBottom: 14,
          }}>
            <TrophyIcon color={color}/>
            <div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Winner</p>
              <p style={{
                color: color, fontSize: 14, fontWeight: 800,
                fontFamily: "monospace", letterSpacing: 0.5,
              }}>{winner}</p>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 22 }}>🏆</span>
          </div>
        )}

        {/* Vote bars */}
        <div>
          {visible.map(([roll, count], i) => (
            <VoteBar
              key={roll}
              roll={roll} count={count} max={max} rank={i}
              color={color}
              isHighlighted={highlightRoll && roll === highlightRoll}
            />
          ))}
        </div>

        {sorted.length > 3 && (
          <button onClick={() => setOpen(o => !o)} style={{
            background: "none", border: `1px solid ${color}33`, color: `${color}cc`,
            fontSize: 12, fontWeight: 700, borderRadius: 8, padding: "6px 14px",
            cursor: "pointer", marginTop: 4, display: "flex", alignItems: "center", gap: 4,
            transition: "all 0.2s",
          }}>
            {open ? "Show less ↑" : `+${sorted.length - 3} more`}
            <span style={{ transform: open ? "rotate(180deg)" : "none", transition: "0.2s", display: "flex" }}><ChevronDown/></span>
          </button>
        )}
      </div>
    </div>
  );
}

// ── Personal Card ─────────────────────────────────────────────────────────────

function PersonalCard({ roll, personalResults, totalQuestions }) {
  const wins = Object.keys(personalResults).length;
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,215,0,0.25)",
      borderRadius: 20, padding: "24px",
      marginBottom: 28,
      boxShadow: "0 0 40px rgba(255,215,0,0.05)",
      animation: "scaleIn 0.4s cubic-bezier(.34,1.4,.64,1) both",
    }}>
      {/* Identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: "linear-gradient(135deg, #fbbf24, #f472b6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>👤</div>
        <div>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Viewing results for</p>
          <p style={{ color: "#fff", fontSize: 17, fontWeight: 800, fontFamily: "monospace", letterSpacing: 0.5 }}>{roll}</p>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <p style={{ color: "#fbbf24", fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{wins}</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: 1 }}>categories won</p>
        </div>
      </div>

      {wins === 0 ? (
        <div style={{
          textAlign: "center", padding: "24px 16px",
          background: "rgba(255,255,255,0.03)", borderRadius: 12,
        }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🫥</p>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>No votes received yet</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(personalResults).map(([q, voters], i) => {
            const color = QUESTION_COLORS[i % QUESTION_COLORS.length];
            return (
              <div key={q} style={{
                background: `${color}10`, border: `1px solid ${color}30`,
                borderRadius: 14, padding: "14px 16px",
                animation: `slideUp 0.3s ${i * 0.06}s ease both`,
              }}>
                <p style={{
                  color: color, fontSize: 13, fontWeight: 700,
                  marginBottom: 8, lineHeight: 1.4,
                }}>{q}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {voters.map((v, vi) => (
                    <span key={vi} style={{
                      background: `${color}20`, border: `1px solid ${color}40`,
                      color: "rgba(255,255,255,0.85)", fontSize: 11,
                      padding: "3px 10px", borderRadius: 99,
                      fontFamily: "monospace", fontWeight: 600,
                    }}>{v}</span>
                  ))}
                </div>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginTop: 6 }}>
                  {voters.length} vote{voters.length !== 1 ? "s" : ""}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────

export default function ResultsDashboard() {
  const [activeSection, setActiveSection] = useState("ITA");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lookupRoll, setLookupRoll] = useState("");
  const [viewingRoll, setViewingRoll] = useState("");
  const personalRef = useRef(null);

  const fetchData = async (section) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?section=${section}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(activeSection); }, [activeSection]);

  const tally = tallyVotes(data);
  const questions = Object.keys(tally);
  const personalResults = getPersonalResults(data, viewingRoll);

  const handleLookup = () => {
    if (!lookupRoll) return;
    setViewingRoll(lookupRoll);
    setTimeout(() => personalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#06000f",
      color: "#fff",
      fontFamily: "'Sora', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.93); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%,100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        select option { background: #0e0020; color: #fff; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
      `}</style>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "24px 16px 60px" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28, animation: "slideUp 0.4s ease both",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Class Farewell
            </p>
            <h1 style={{
              fontSize: 26, fontWeight: 800, lineHeight: 1,
              background: "linear-gradient(135deg, #f472b6, #c084fc, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Vote Results</h1>
          </div>
          <button
            onClick={() => fetchData(activeSection)}
            title="Refresh"
            style={{
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)", borderRadius: 12, padding: "10px 14px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 600,
              transition: "all 0.2s",
            }}>
            <RefreshIcon/> Refresh
          </button>
        </div>

        {/* ── Section Tabs ── */}
        <div style={{
          display: "flex", gap: 8, marginBottom: 28,
          animation: "slideUp 0.4s 0.05s ease both",
        }}>
          {["ITA","ITB","ITC"].map(sec => (
            <button key={sec} onClick={() => { setActiveSection(sec); setViewingRoll(""); }} style={{
              flex: 1, padding: "12px 0", borderRadius: 12, border: "none",
              background: activeSection === sec
                ? "linear-gradient(135deg, #c084fc, #f472b6)"
                : "rgba(255,255,255,0.05)",
              color: activeSection === sec ? "#fff" : "rgba(255,255,255,0.5)",
              fontWeight: 800, fontSize: 14, cursor: "pointer",
              fontFamily: "'Sora', sans-serif",
              transition: "all 0.25s ease",
              boxShadow: activeSection === sec ? "0 4px 20px #c084fc44" : "none",
            }}>{sec}</button>
          ))}
        </div>

        {/* ── Personal Lookup ── */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,215,0,0.2)",
          borderRadius: 18, padding: "20px",
          marginBottom: 28,
          animation: "slideUp 0.4s 0.1s ease both",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <UserIcon/>
            <p style={{ fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.85)" }}>
              Check your personal results
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{
              flex: 1,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,215,0,0.2)",
              borderRadius: 12, overflow: "hidden",
            }}>
              <select
                value={lookupRoll}
                onChange={e => setLookupRoll(e.target.value)}
                style={{
                  width: "100%", padding: "12px 16px",
                  background: "transparent",
                  color: lookupRoll ? "#fff" : "rgba(255,255,255,0.35)",
                  fontSize: 14, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                  border: "none", outline: "none", cursor: "pointer",
                  appearance: "none", WebkitAppearance: "none",
                }}>
                <option value="" disabled>Select your roll number…</option>
                {ROLL_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleLookup}
              disabled={!lookupRoll}
              style={{
                padding: "12px 20px", borderRadius: 12, border: "none",
                background: lookupRoll ? "linear-gradient(135deg, #fbbf24, #f472b6)" : "rgba(255,255,255,0.06)",
                color: lookupRoll ? "#000" : "rgba(255,255,255,0.25)",
                fontWeight: 800, fontSize: 14, cursor: lookupRoll ? "pointer" : "not-allowed",
                fontFamily: "'Sora', sans-serif",
                transition: "all 0.25s",
                whiteSpace: "nowrap",
              }}>
              View →
            </button>
          </div>
        </div>

        {/* ── Personal Results ── */}
        {viewingRoll && (
          <div ref={personalRef}>
            <PersonalCard
              roll={viewingRoll}
              personalResults={personalResults}
              totalQuestions={questions.length}
            />
          </div>
        )}

        {/* ── Vote Tallies ── */}
        <div style={{ animation: "slideUp 0.4s 0.15s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 18 }}>📊</span>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "rgba(255,255,255,0.9)" }}>
              All Question Results
            </h2>
            {data && (
              <span style={{
                marginLeft: "auto", background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, padding: "4px 10px",
                fontSize: 12, color: "rgba(255,255,255,0.4)",
              }}>
                {data.length} voters
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2" style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="9" strokeOpacity="0.2"/>
                <path d="M12 3a9 9 0 019 9" strokeLinecap="round"/>
              </svg>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 12, animation: "pulse 1.5s ease infinite" }}>
                Loading results…
              </p>
            </div>
          ) : questions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🫙</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>No responses yet for {activeSection}</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionCard
                key={q} question={q}
                votes={tally[q]}
                color={QUESTION_COLORS[i % QUESTION_COLORS.length]}
                idx={i}
                highlightRoll={viewingRoll}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}