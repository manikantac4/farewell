import { useState, useEffect, useRef } from "react";

const API_URL = "https://farewell-backend-2v9n.onrender.com/api/responses";

function tallyVotes(data) {
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

// Returns the answers that THIS roll number submitted
function getMyVotes(data, roll) {
  if (!data || !roll) return null;
  const entry = data.find(e => e.studentName === roll);
  return entry ? entry.answers : null;
}

// Returns votes received by a roll number: { question: [voter1, voter2, ...] }
function getVotesReceived(data, roll) {
  if (!data || !roll) return null;
  const result = {};
  data.forEach(entry => {
    entry.answers.forEach(({ question, answer }) => {
      if (answer === roll) {
        if (!result[question]) result[question] = [];
        result[question].push(entry.studentName);
      }
    });
  });
  return Object.keys(result).length > 0 ? result : null;
}

const ROLL_OPTIONS = (() => {
  const opts = [];
  for (let i = 66; i <= 99; i++) opts.push(`238W1A12${i}`);
  ["A","B","C"].forEach(l => { for (let i = 0; i <= 9; i++) opts.push(`238W1A12${l}${i}`); });
  opts.push("238W1A12D0");
  for (let i = 7; i <= 13; i++) opts.push(`248W5A12LE${i}`);
  return opts;
})();

const QUESTION_COLORS = [
  "#f472b6","#2dd4bf","#60a5fa","#c084fc","#fbbf24",
  "#38bdf8","#fb923c","#60a5fa","#f87171","#fbbf24",
  "#34d399","#38bdf8","#94a3b8","#60a5fa","#a78bfa",
  "#fb923c","#fb923c","#c084fc","#2dd4bf","#fbbf24",
];

const MEDAL = ["🥇","🥈","🥉"];

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M23 4v6h-6M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36"/>
  </svg>
);

function VoteBar({ roll, count, max, rank, color, isHighlighted }) {
  const pct = max > 0 ? (count / max) * 100 : 0;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8, marginBottom: 7,
      background: isHighlighted ? `${color}15` : "transparent",
      borderRadius: 8, padding: "4px 8px",
      border: isHighlighted ? `1px solid ${color}40` : "1px solid transparent",
      transition: "all 0.3s",
    }}>
      <span style={{ width: 20, fontSize: 12, textAlign: "center", flexShrink: 0 }}>
        {rank < 3 ? MEDAL[rank] : ""}
      </span>
      <span style={{
        minWidth: 108, fontSize: 11, fontWeight: 700,
        color: isHighlighted ? color : "rgba(255,255,255,0.6)",
        fontFamily: "monospace", flexShrink: 0,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>{roll}</span>
      <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: 99, transition: "width 0.9s cubic-bezier(.34,1.3,.64,1)",
          boxShadow: pct === 100 ? `0 0 6px ${color}` : "none",
        }}/>
      </div>
      <span style={{
        minWidth: 22, fontSize: 12, fontWeight: 800, textAlign: "right", flexShrink: 0,
        color: isHighlighted ? color : "rgba(255,255,255,0.5)",
      }}>{count}</span>
    </div>
  );
}

function QuestionCard({ question, votes, color, idx, highlightRoll }) {
  const [open, setOpen] = useState(false);
  const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  const max = sorted[0]?.[1] || 1;
  const winner = sorted[0]?.[0];
  const total = sorted.reduce((s, [, c]) => s + c, 0);
  const visible = open ? sorted : sorted.slice(0, 3);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${color}22`,
      borderRadius: 16, padding: "18px 18px 14px",
      marginBottom: 14, position: "relative", overflow: "hidden",
      animation: `slideUp 0.35s ${idx * 0.03}s ease both`,
    }}>
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(180deg, ${color}, ${color}33)`,
        borderRadius: "16px 0 0 16px",
      }}/>
      <div style={{ paddingLeft: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
          <div style={{ flex: 1, paddingRight: 10 }}>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>
              Q{idx + 1}
            </span>
            <p style={{ color: "#fff", fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginTop: 2 }}>{question}</p>
          </div>
          <div style={{
            background: `${color}18`, border: `1px solid ${color}35`,
            borderRadius: 8, padding: "5px 10px", textAlign: "center", flexShrink: 0,
          }}>
            <p style={{ color: color, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{total}</p>
            <p style={{ color: `${color}88`, fontSize: 8, letterSpacing: 1, textTransform: "uppercase" }}>votes</p>
          </div>
        </div>

        {winner && (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: `${color}12`, border: `1px solid ${color}28`,
            borderRadius: 8, padding: "7px 12px", marginBottom: 10,
          }}>
            <span style={{ fontSize: 16 }}>🏆</span>
            <div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 8, letterSpacing: 2, textTransform: "uppercase" }}>Top vote</p>
              <p style={{ color: color, fontSize: 13, fontWeight: 800, fontFamily: "monospace" }}>{winner}</p>
            </div>
            <span style={{ marginLeft: "auto", color: `${color}99`, fontSize: 12, fontWeight: 700 }}>
              {sorted[0][1]} vote{sorted[0][1] !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        {visible.map(([roll, count], i) => (
          <VoteBar key={roll} roll={roll} count={count} max={max} rank={i}
            color={color} isHighlighted={highlightRoll === roll} />
        ))}

        {sorted.length > 3 && (
          <button onClick={() => setOpen(o => !o)} style={{
            background: "none", border: `1px solid ${color}28`,
            color: `${color}aa`, fontSize: 11, fontWeight: 700,
            borderRadius: 6, padding: "5px 12px", cursor: "pointer",
            marginTop: 4, fontFamily: "'Sora', sans-serif", transition: "all 0.2s",
          }}>
            {open ? "↑ Show less" : `+ ${sorted.length - 3} more`}
          </button>
        )}
      </div>
    </div>
  );
}

// ── My Votes Container — shows what this roll voted for each question ─────────

function MyVotesContainer({ roll, myVotes }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,215,0,0.2)",
      borderRadius: 18, overflow: "hidden",
      animation: "scaleIn 0.4s cubic-bezier(.34,1.4,.64,1) both",
    }}>
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(255,215,0,0.04)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #fbbf24, #f472b6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, flexShrink: 0,
        }}>🗳️</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Votes submitted by</p>
          <p style={{
            color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "monospace",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{roll}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ color: "#fbbf24", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{myVotes.length}</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, letterSpacing: 1 }}>answers</p>
        </div>
      </div>

      <div style={{
        height: 460, overflowY: "auto", padding: "14px 16px",
        scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}>
        {myVotes.map(({ question, answer }, i) => {
          const color = QUESTION_COLORS[i % QUESTION_COLORS.length];
          return (
            <div key={i} style={{
              display: "flex", alignItems: "stretch", gap: 0,
              background: `${color}0c`, border: `1px solid ${color}20`,
              borderRadius: 12, overflow: "hidden", marginBottom: 8,
              animation: `slideUp 0.25s ${i * 0.03}s ease both`,
            }}>
              <div style={{
                width: 36, flexShrink: 0, background: `${color}18`,
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                borderRight: `1px solid ${color}20`, gap: 2,
              }}>
                <span style={{ color: color, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>Q</span>
                <span style={{ color: color, fontSize: 14, fontWeight: 800, lineHeight: 1 }}>{i + 1}</span>
              </div>
              <div style={{ flex: 1, padding: "10px 12px" }}>
                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, lineHeight: 1.4, marginBottom: 5 }}>{question}</p>
                <p style={{ color: "#fff", fontSize: 13, fontWeight: 800, fontFamily: "monospace", letterSpacing: 0.5 }}>{answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Votes Received Container ──────────────────────────────────────────────────

function VotesReceivedContainer({ roll, votesReceived }) {
  const questions = Object.keys(votesReceived);
  const totalVotes = questions.reduce((sum, q) => sum + votesReceived[q].length, 0);

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(52,211,153,0.25)",
      borderRadius: 18, overflow: "hidden",
      animation: "scaleIn 0.4s cubic-bezier(.34,1.4,.64,1) both",
    }}>
      {/* Header */}
      <div style={{
        padding: "16px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", gap: 12,
        background: "rgba(52,211,153,0.05)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: "linear-gradient(135deg, #34d399, #38bdf8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 17, flexShrink: 0,
        }}>⭐</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Votes received by</p>
          <p style={{
            color: "#fff", fontSize: 14, fontWeight: 800, fontFamily: "monospace",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{roll}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <p style={{ color: "#34d399", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{totalVotes}</p>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 9, letterSpacing: 1 }}>total votes</p>
        </div>
      </div>

      {/* Body */}
      <div style={{
        maxHeight: 520, overflowY: "auto", padding: "14px 16px",
        scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent",
      }}>
        {questions.map((question, i) => {
          const voters = votesReceived[question];
          const color = QUESTION_COLORS[i % QUESTION_COLORS.length];
          return (
            <div key={i} style={{
              background: `${color}08`,
              border: `1px solid ${color}20`,
              borderRadius: 14, overflow: "hidden",
              marginBottom: 10,
              animation: `slideUp 0.25s ${i * 0.04}s ease both`,
            }}>
              {/* Question header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                borderBottom: `1px solid ${color}18`,
                background: `${color}10`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: `${color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ color: color, fontSize: 11, fontWeight: 800 }}>{i + 1}</span>
                </div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, flex: 1, lineHeight: 1.4 }}>{question}</p>
                <div style={{
                  background: `${color}20`, border: `1px solid ${color}35`,
                  borderRadius: 6, padding: "3px 8px", flexShrink: 0,
                }}>
                  <span style={{ color: color, fontSize: 12, fontWeight: 800 }}>{voters.length}</span>
                  <span style={{ color: `${color}77`, fontSize: 9, marginLeft: 3 }}>vote{voters.length !== 1 ? "s" : ""}</span>
                </div>
              </div>

              {/* Voters list */}
              <div style={{ padding: "10px 14px", display: "flex", flexWrap: "wrap", gap: 6 }}>
                {voters.map((voter, vi) => (
                  <div key={vi} style={{
                    display: "flex", alignItems: "center", gap: 5,
                    background: `${color}12`, border: `1px solid ${color}25`,
                    borderRadius: 8, padding: "5px 10px",
                    animation: `slideUp 0.2s ${vi * 0.02}s ease both`,
                  }}>
                    <span style={{ fontSize: 10 }}>👤</span>
                    <span style={{
                      color: "rgba(255,255,255,0.75)", fontSize: 11,
                      fontFamily: "monospace", fontWeight: 700,
                    }}>{voter}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ResultsDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // My Votes state
  const [lookupRoll, setLookupRoll] = useState("");
  const [viewingRoll, setViewingRoll] = useState("");
  const [myVotes, setMyVotes] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const personalRef = useRef(null);

  // Votes Received state
  const [receivedLookupRoll, setReceivedLookupRoll] = useState("");
  const [viewingReceivedRoll, setViewingReceivedRoll] = useState("");
  const [votesReceived, setVotesReceived] = useState(null);
  const [receivedNotFound, setReceivedNotFound] = useState(false);
  const receivedRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const tally = tallyVotes(data);
  const questions = Object.keys(tally);

  const handleLookup = () => {
    if (!lookupRoll) return;
    const votes = getMyVotes(data, lookupRoll);
    setViewingRoll(lookupRoll);
    setMyVotes(votes);
    setNotFound(!votes);
    setTimeout(() => personalRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const handleReceivedLookup = () => {
    if (!receivedLookupRoll) return;
    const received = getVotesReceived(data, receivedLookupRoll);
    setViewingReceivedRoll(receivedLookupRoll);
    setVotesReceived(received);
    setReceivedNotFound(!received);
    setTimeout(() => receivedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#06000f", color: "#fff", fontFamily: "'Sora', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        select option { background: #0e0020; color: #fff; }
      `}</style>

      <div style={{ maxWidth: 620, margin: "0 auto", padding: "24px 16px 64px" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginBottom: 28, animation: "slideUp 0.4s ease both",
        }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 }}>
              Class Farewell 2025
            </p>
            <h1 style={{
              fontSize: 24, fontWeight: 800,
              background: "linear-gradient(135deg, #f472b6, #c084fc, #60a5fa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Vote Results</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {data && (
              <span style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8, padding: "5px 10px", fontSize: 11, color: "rgba(255,255,255,0.4)",
              }}>{data.length} voters</span>
            )}
            <button onClick={fetchData} style={{
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)", borderRadius: 10, padding: "9px 12px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
              fontSize: 12, fontWeight: 600, fontFamily: "'Sora', sans-serif",
            }}>
              <RefreshIcon/> Refresh
            </button>
          </div>
        </div>

        {/* ── Question Results ── */}
        <div style={{ animation: "slideUp 0.4s 0.05s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 15 }}>📊</span>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 }}>
              Question Results
            </h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#c084fc" strokeWidth="2"
                style={{ animation: "spin 0.8s linear infinite" }}>
                <circle cx="12" cy="12" r="9" strokeOpacity="0.15"/>
                <path d="M12 3a9 9 0 019 9" strokeLinecap="round"/>
              </svg>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 10, animation: "pulse 1.5s ease infinite" }}>
                Loading…
              </p>
            </div>
          ) : questions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 36, marginBottom: 10 }}>🫙</p>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}>No responses yet</p>
            </div>
          ) : (
            questions.map((q, i) => (
              <QuestionCard
                key={q} question={q} votes={tally[q]}
                color={QUESTION_COLORS[i % QUESTION_COLORS.length]}
                idx={i} highlightRoll={viewingRoll}
              />
            ))
          )}
        </div>

        {/* ── My Votes Search ── */}
        <div ref={personalRef} style={{ marginTop: 40, animation: "slideUp 0.4s 0.1s ease both" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 15 }}>🗳️</span>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 }}>
              My Votes
            </h2>
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: viewingRoll ? 14 : 0 }}>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,215,0,0.18)",
              borderRadius: 12, overflow: "hidden",
            }}>
              <select
                value={lookupRoll}
                onChange={e => setLookupRoll(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "transparent",
                  color: lookupRoll ? "#fff" : "rgba(255,255,255,0.3)",
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
                background: lookupRoll ? "linear-gradient(135deg, #fbbf24, #f472b6)" : "rgba(255,255,255,0.05)",
                color: lookupRoll ? "#000" : "rgba(255,255,255,0.2)",
                fontWeight: 800, fontSize: 14, cursor: lookupRoll ? "pointer" : "not-allowed",
                fontFamily: "'Sora', sans-serif", transition: "all 0.25s", whiteSpace: "nowrap",
              }}>
              View →
            </button>
          </div>

          {viewingRoll && notFound && (
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,100,100,0.2)",
              borderRadius: 16, padding: "36px 20px", textAlign: "center",
              animation: "scaleIn 0.3s ease both",
            }}>
              <p style={{ fontSize: 30, marginBottom: 10 }}>🫥</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>
                No submission found for
              </p>
              <p style={{ color: "#f87171", fontSize: 13, fontFamily: "monospace", marginTop: 4 }}>{viewingRoll}</p>
            </div>
          )}

          {viewingRoll && myVotes && (
            <MyVotesContainer roll={viewingRoll} myVotes={myVotes} />
          )}
        </div>

        {/* ── Votes Received Search ── */}
        <div ref={receivedRef} style={{ marginTop: 40, animation: "slideUp 0.4s 0.15s ease both" }}>
          {/* Divider */}
          <div style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent)",
            marginBottom: 32,
          }}/>

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <span style={{ fontSize: 15 }}>⭐</span>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: "rgba(255,255,255,0.8)", letterSpacing: 0.5 }}>
              Votes Received
            </h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 14, paddingLeft: 2 }}>
            See which questions someone was nominated for & who voted for them
          </p>

          <div style={{ display: "flex", gap: 10, marginBottom: viewingReceivedRoll ? 14 : 0 }}>
            <div style={{
              flex: 1, background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(52,211,153,0.2)",
              borderRadius: 12, overflow: "hidden",
            }}>
              <select
                value={receivedLookupRoll}
                onChange={e => setReceivedLookupRoll(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: "transparent",
                  color: receivedLookupRoll ? "#fff" : "rgba(255,255,255,0.3)",
                  fontSize: 14, fontWeight: 600, fontFamily: "'Sora', sans-serif",
                  border: "none", outline: "none", cursor: "pointer",
                  appearance: "none", WebkitAppearance: "none",
                }}>
                <option value="" disabled>Select a roll number…</option>
                {ROLL_OPTIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <button
              onClick={handleReceivedLookup}
              disabled={!receivedLookupRoll}
              style={{
                padding: "12px 20px", borderRadius: 12, border: "none",
                background: receivedLookupRoll
                  ? "linear-gradient(135deg, #34d399, #38bdf8)"
                  : "rgba(255,255,255,0.05)",
                color: receivedLookupRoll ? "#000" : "rgba(255,255,255,0.2)",
                fontWeight: 800, fontSize: 14,
                cursor: receivedLookupRoll ? "pointer" : "not-allowed",
                fontFamily: "'Sora', sans-serif", transition: "all 0.25s", whiteSpace: "nowrap",
              }}>
              View →
            </button>
          </div>

          {/* Not found */}
          {viewingReceivedRoll && receivedNotFound && (
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,100,100,0.2)",
              borderRadius: 16, padding: "36px 20px", textAlign: "center",
              animation: "scaleIn 0.3s ease both",
            }}>
              <p style={{ fontSize: 30, marginBottom: 10 }}>🫥</p>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>
                No votes received by
              </p>
              <p style={{ color: "#f87171", fontSize: 13, fontFamily: "monospace", marginTop: 4 }}>{viewingReceivedRoll}</p>
            </div>
          )}

          {/* Votes received result */}
          {viewingReceivedRoll && votesReceived && (
            <VotesReceivedContainer roll={viewingReceivedRoll} votesReceived={votesReceived} />
          )}
        </div>

      </div>
    </div>
  );
}