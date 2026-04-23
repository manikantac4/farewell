import { useState, useEffect } from "react";

const API_URL = "https://farewell-backend-2v9n.onrender.com/api/responses";
const COLORS = ["#FF69B4", "#FFD700", "#60a5fa", "#34d399", "#f472b6", "#fbbf24", "#a78bfa", "#f87171", "#2dd4bf", "#e879f9"];

// SVG Icons
const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36" />
  </svg>
);

const TrendIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 17" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const AlertIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const LoadingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="14" />
  </svg>
);

// Normalize roll number
function normalizeRollNumber(rollNo) {
  if (!rollNo) return null;
  const cleaned = String(rollNo).toUpperCase().trim();
  
  if (/^[0-9]{3}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{2}$/.test(cleaned)) {
    return cleaned;
  }
  
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length >= 2) {
    return `228W1A1${digits.slice(-2)}`;
  }
  
  return null;
}

// Vote Flow Card - Shows roll number and their votes
function VoteFlowCard({ rollNumber, voteCount, questionCount, colors }) {
  const isValid = normalizeRollNumber(rollNumber) !== null;
  const colorIndex = Math.abs(rollNumber.charCodeAt(0)) % colors.length;
  const bgColor = colors[colorIndex];
  
  return (
    <div
      style={{
        background: isValid
          ? `linear-gradient(135deg, ${bgColor}33, ${bgColor}11)`
          : "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
        border: `2px solid ${isValid ? bgColor : "rgba(255,255,255,0.2)"}`,
        borderRadius: 12,
        padding: "clamp(14px, 3vw, 18px)",
        transition: "all 0.3s ease",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = `0 8px 20px ${bgColor}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Invalid badge */}
      {!isValid && (
        <div style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "rgba(248, 113, 113, 0.8)",
          color: "#fff",
          padding: "4px 8px",
          borderRadius: 4,
          fontSize: "10px",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}>
          <AlertIcon />
          Unknown
        </div>
      )}

      {/* Roll Number */}
      <div style={{
        fontSize: "clamp(13px, 2.5vw, 14px)",
        color: isValid ? bgColor : "rgba(255,255,255,0.4)",
        fontWeight: 700,
        fontFamily: "monospace",
        letterSpacing: "1px",
        marginBottom: 10,
        textTransform: "uppercase",
      }}>
        {rollNumber}
      </div>

      {/* Vote Stats */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}>
        {/* Total Votes */}
        <div style={{
          background: isValid ? "rgba(255,255,255,0.05)" : "transparent",
          padding: "8px 10px",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "clamp(18px, 4vw, 22px)",
            fontWeight: 900,
            color: isValid ? bgColor : "rgba(255,255,255,0.3)",
            marginBottom: 4,
          }}>
            {voteCount}
          </div>
          <div style={{
            fontSize: "clamp(10px, 2vw, 11px)",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 600,
          }}>
            Votes
          </div>
        </div>

        {/* Questions */}
        <div style={{
          background: isValid ? "rgba(255,255,255,0.05)" : "transparent",
          padding: "8px 10px",
          borderRadius: 8,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: "clamp(18px, 4vw, 22px)",
            fontWeight: 900,
            color: isValid ? bgColor : "rgba(255,255,255,0.3)",
            marginBottom: 4,
          }}>
            {questionCount}
          </div>
          <div style={{
            fontSize: "clamp(10px, 2vw, 11px)",
            color: "rgba(255,255,255,0.4)",
            fontWeight: 600,
          }}>
            Questions
          </div>
        </div>
      </div>

      {/* Validation indicator */}
      <div style={{
        marginTop: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: "clamp(10px, 2vw, 11px)",
        color: isValid ? "#34d399" : "#f87171",
      }}>
        {isValid ? (
          <>
            <CheckIcon />
            <span>Valid Roll Number</span>
          </>
        ) : (
          <>
            <AlertIcon />
            <span>Could not verify</span>
          </>
        )}
      </div>
    </div>
  );
}

// Question Results Section
function QuestionResults({ question, votes, colors }) {
  const voteCounts = {};
  const validVotes = [];
  const invalidVotes = [];

  votes.forEach(v => {
    const normalized = normalizeRollNumber(v);
    if (normalized) {
      validVotes.push(normalized);
      voteCounts[normalized] = (voteCounts[normalized] || 0) + 1;
    } else {
      invalidVotes.push(v);
      voteCounts[`UNKNOWN: ${v}`] = (voteCounts[`UNKNOWN: ${v}`] || 0) + 1;
    }
  });

  const sortedVotes = Object.entries(voteCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count, isValid: !name.startsWith("UNKNOWN") }));

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      padding: "clamp(14px, 3vw, 20px)",
      marginBottom: 16,
      animation: "slideIn 0.5s ease forwards",
    }}>
      <h3 style={{
        color: "#fff",
        fontSize: "clamp(13px, 3vw, 15px)",
        fontWeight: 700,
        marginBottom: 14,
        textShadow: "0 0 10px rgba(255,105,180,0.4)",
        lineHeight: 1.4,
      }}>
        {question}
      </h3>

      {/* Vote Flow - Horizontal bars */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}>
        {sortedVotes.map((item, idx) => {
          const maxVotes = Math.max(...sortedVotes.map(v => v.count), 1);
          const percentage = (item.count / maxVotes) * 100;
          const color = item.isValid ? colors[idx % colors.length] : "rgba(255,255,255,0.2)";

          return (
            <div key={idx} style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}>
              {/* Vote Count Badge */}
              <div style={{
                minWidth: "40px",
                textAlign: "center",
                fontSize: "clamp(13px, 2.5vw, 15px)",
                fontWeight: 900,
                color: color,
              }}>
                {item.count}
              </div>

              {/* Progress Bar */}
              <div style={{
                flex: 1,
                height: "clamp(20px, 4vw, 28px)",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 8,
                overflow: "hidden",
                position: "relative",
              }}>
                <div
                  style={{
                    height: "100%",
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    transition: "width 0.5s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    paddingRight: 8,
                  }}
                >
                  {percentage > 20 && (
                    <span style={{
                      fontSize: "clamp(10px, 2vw, 12px)",
                      fontWeight: 700,
                      color: "#000",
                      mixBlendMode: "lighten",
                    }}>
                      {Math.round(percentage)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Roll Number */}
              <div style={{
                minWidth: "120px",
                fontSize: "clamp(10px, 2.5vw, 12px)",
                fontFamily: "monospace",
                fontWeight: 700,
                letterSpacing: "0.5px",
                color: item.isValid ? color : "#f87171",
                textAlign: "right",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}>
                {item.isValid ? item.name : `⚠️ ${item.name.replace("UNKNOWN: ", "")}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats line */}
      {invalidVotes.length > 0 && (
        <div style={{
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.1)",
          fontSize: "clamp(10px, 2vw, 11px)",
          color: "#f87171",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}>
          <AlertIcon />
          <span>{invalidVotes.length} invalid responses</span>
        </div>
      )}
    </div>
  );
}

// Section Dashboard
function SectionDashboard({ section, data, loading, error }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "clamp(30px, 10vw, 50px) 20px" }}>
        <div style={{ marginBottom: 16, color: "#FF69B4" }}>
          <LoadingIcon />
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px, 3vw, 16px)" }}>
          Loading {section} data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "clamp(30px, 10vw, 50px) 20px" }}>
        <div style={{ marginBottom: 16, color: "#f87171" }}>
          <AlertIcon />
        </div>
        <p style={{ color: "#f87171", fontSize: "clamp(14px, 3vw, 16px)" }}>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "clamp(30px, 10vw, 50px) 20px" }}>
        <div style={{ marginBottom: 16, color: "rgba(255,255,255,0.3)", fontSize: "60px" }}>
          📭
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(14px, 3vw, 16px)" }}>
          No responses yet for {section}
        </p>
      </div>
    );
  }

  // Group answers by question
  const questionMap = {};
  data.forEach(response => {
    response.answers.forEach(ans => {
      if (!questionMap[ans.question]) {
        questionMap[ans.question] = [];
      }
      questionMap[ans.question].push(ans.answer);
    });
  });

  // Aggregate all votes
  const allVotes = {};
  Object.values(questionMap).forEach(votes => {
    votes.forEach(v => {
      const normalized = normalizeRollNumber(v);
      if (normalized) {
        if (!allVotes[normalized]) {
          allVotes[normalized] = { valid: 0, questions: new Set() };
        }
        allVotes[normalized].valid++;
      }
    });
  });

  // Calculate questions per roll number
  Object.values(questionMap).forEach((votes, qIdx) => {
    votes.forEach(v => {
      const normalized = normalizeRollNumber(v);
      if (normalized && allVotes[normalized]) {
        allVotes[normalized].questions.add(qIdx);
      }
    });
  });

  const totalResponses = data.length;
  const totalValidVotes = Object.values(allVotes).reduce((acc, v) => acc + v.valid, 0);
  const totalContenders = Object.keys(allVotes).length;

  return (
    <div>
      {/* Stats Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(clamp(100px, 25vw, 140px), 1fr))",
        gap: "clamp(10px, 2vw, 16px)",
        marginBottom: "clamp(20px, 4vw, 32px)",
      }}>
        {/* Total Responses */}
        <div style={{
          background: "linear-gradient(135deg, #FF69B433, #FF69B411)",
          border: "1px solid #FF69B455",
          borderRadius: 12,
          padding: "clamp(12px, 2.5vw, 18px)",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "#FF69B4" }}>
            <TrendIcon />
          </div>
          <div style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 900, color: "#FF69B4" }}>
            {totalResponses}
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(10px, 2.2vw, 11px)", marginTop: 4 }}>
            Total Responses
          </div>
        </div>

        {/* Valid Votes */}
        <div style={{
          background: "linear-gradient(135deg, #34d39933, #34d39911)",
          border: "1px solid #34d39955",
          borderRadius: 12,
          padding: "clamp(12px, 2.5vw, 18px)",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "#34d399" }}>
            <CheckIcon />
          </div>
          <div style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 900, color: "#34d399" }}>
            {totalValidVotes}
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(10px, 2.2vw, 11px)", marginTop: 4 }}>
            Valid Votes
          </div>
        </div>

        {/* Unique Contenders */}
        <div style={{
          background: "linear-gradient(135deg, #60a5fa33, #60a5fa11)",
          border: "1px solid #60a5fa55",
          borderRadius: 12,
          padding: "clamp(12px, 2.5vw, 18px)",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8, color: "#60a5fa" }}>
            <UsersIcon />
          </div>
          <div style={{ fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 900, color: "#60a5fa" }}>
            {totalContenders}
          </div>
          <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "clamp(10px, 2.2vw, 11px)", marginTop: 4 }}>
            Unique Contenders
          </div>
        </div>
      </div>

      {/* Contenders Overview */}
      <div style={{ marginBottom: "clamp(20px, 4vw, 32px)" }}>
        <h2 style={{
          color: "#fff",
          fontSize: "clamp(13px, 3vw, 15px)",
          fontWeight: 700,
          marginBottom: 14,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          👥 Contenders Overview
        </h2>
        
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(clamp(80px, 20vw, 130px), 1fr))",
          gap: "clamp(10px, 2.5vw, 14px)",
        }}>
          {Object.entries(allVotes)
            .sort(([, a], [, b]) => b.valid - a.valid)
            .map(([rollNo, data]) => (
              <VoteFlowCard
                key={rollNo}
                rollNumber={rollNo}
                voteCount={data.valid}
                questionCount={data.questions.size}
                colors={COLORS}
              />
            ))}
        </div>
      </div>

      {/* Questions Results */}
      <div>
        <h2 style={{
          color: "#fff",
          fontSize: "clamp(13px, 3vw, 15px)",
          fontWeight: 700,
          marginBottom: 14,
          letterSpacing: "0.5px",
          textTransform: "uppercase",
        }}>
          📊 Question Results
        </h2>
        
        {Object.entries(questionMap).map(([question, votes], idx) => (
          <QuestionResults key={idx} question={question} votes={votes} colors={COLORS} />
        ))}
      </div>
    </div>
  );
}

// Main Dashboard
export default function ResultsDashboard() {
  const [activeSection, setActiveSection] = useState("ITA");
  const [sectionData, setSectionData] = useState({ ITA: null, ITB: null, ITC: null });
  const [loading, setLoading] = useState({ ITA: false, ITB: false, ITC: false });
  const [error, setError] = useState({ ITA: null, ITB: null, ITC: null });

  const fetchSectionData = async (section) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    setError(prev => ({ ...prev, [section]: null }));
    
    try {
      const response = await fetch(`${API_URL}?section=${section}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const data = await response.json();
      setSectionData(prev => ({ ...prev, [section]: data }));
    } catch (err) {
      setError(prev => ({ ...prev, [section]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  useEffect(() => {
    fetchSectionData(activeSection);
  }, [activeSection]);

  useEffect(() => {
    ["ITA", "ITB", "ITC"].forEach(section => {
      if (!sectionData[section]) fetchSectionData(section);
    });
  }, []);

  const handleRefresh = () => {
    ["ITA", "ITB", "ITC"].forEach(section => fetchSectionData(section));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'Sora', sans-serif; width: 100%; height: 100%; }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        minHeight: "100dvh",
        background: "linear-gradient(135deg, #0a0010 0%, #1a0025 30%, #2d0040 55%, #1a0020 75%, #0d000f 100%)",
        padding: "clamp(12px, 3vw, 20px)",
        fontFamily: "'Sora', sans-serif",
        width: "100%",
      }}>
        {/* Header */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", marginBottom: "clamp(24px, 5vw, 40px)" }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "clamp(12px, 3vw, 20px)",
            marginBottom: "clamp(20px, 4vw, 32px)",
          }}>
            <div>
              <h1 style={{
                fontSize: "clamp(1.8rem, 5vw, 3rem)",
                fontWeight: 900,
                background: "linear-gradient(135deg, #FF69B4, #FFD700, #60a5fa)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                marginBottom: 6,
                letterSpacing: -1,
              }}>
                Class Poll Results
              </h1>
              <p style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: "clamp(12px, 2.5vw, 14px)",
              }}>
                Vote analysis and contender insights
              </p>
            </div>
            
            <button
              onClick={handleRefresh}
              style={{
                fontFamily: "'Sora', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(12px, 2.5vw, 14px)",
                letterSpacing: "0.5px",
                color: "#fff",
                padding: "clamp(10px, 2.5vw, 12px) clamp(14px, 3vw, 24px)",
                border: "2px solid #FF69B4",
                borderRadius: 8,
                cursor: "pointer",
                background: "linear-gradient(135deg, rgba(255,105,180,0.1), rgba(255,215,0,0.05))",
                boxShadow: "0 0 20px rgba(255,105,180,0.3)",
                transition: "all 0.3s ease",
                textTransform: "uppercase",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(255,105,180,0.6)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(255,105,180,0.3)";
              }}
            >
              <RefreshIcon />
              <span>Refresh</span>
            </button>
          </div>

          {/* Section Tabs */}
          <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexWrap: "wrap" }}>
            {["ITA", "ITB", "ITC"].map((section, idx) => {
              const colors = ["#c084fc", "#f472b6", "#60a5fa"];
              const color = colors[idx];
              const isActive = activeSection === section;
              
              return (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  style={{
                    fontFamily: "'Sora', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(12px, 3vw, 16px)",
                    letterSpacing: "1px",
                    color: "#fff",
                    padding: "clamp(10px, 2vw, 12px) clamp(14px, 3vw, 28px)",
                    border: `2px solid ${color}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    background: isActive ? `linear-gradient(135deg, ${color}33, ${color}11)` : "rgba(255,255,255,0.03)",
                    boxShadow: isActive ? `0 0 20px ${color}44, inset 0 0 20px ${color}22` : "none",
                    transition: "all 0.3s ease",
                    textTransform: "uppercase",
                    backdropFilter: "blur(8px)",
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = `linear-gradient(135deg, ${color}22, ${color}11)`;
                      e.currentTarget.style.boxShadow = `0 0 15px ${color}33`;
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {section}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: "1400px", margin: "0 auto", animation: "slideIn 0.5s ease", width: "100%" }}>
          <SectionDashboard
            section={activeSection}
            data={sectionData[activeSection]}
            loading={loading[activeSection]}
            error={error[activeSection]}
          />
        </div>
      </div>
    </>
  );
}