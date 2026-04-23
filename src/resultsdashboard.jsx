import { useState, useEffect } from "react";

const API_URL = "https://farewell-backend-2v9n.onrender.com/api/responses";
const SECTIONS = ["ITA", "ITB", "ITC"];
const COLORS = ["#FF69B4", "#FFD700", "#60a5fa", "#34d399", "#f472b6", "#fbbf24", "#a78bfa", "#f87171", "#2dd4bf", "#e879f9"];

// SVG Icons
const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36" />
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h.5M6 19h12M6 9h3M13 15h2" />
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

const LoadingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="14" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

const EmptyIcon = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="3" y1="15" x2="21" y2="15" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

// Normalize roll number to format 228W1A1__ (last 2 digits)
function normalizeRollNumber(rollNo) {
  if (!rollNo) return "Unknown";
  const cleaned = String(rollNo).toUpperCase().trim();
  
  // If already in correct format, return as is
  if (/^[0-9]{3}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9]{2}$/.test(cleaned)) {
    return cleaned;
  }
  
  // Extract last 2-3 digits for matching
  const digits = cleaned.replace(/\D/g, "");
  if (digits.length >= 2) {
    return `228W1A1${digits.slice(-2)}`;
  }
  
  return cleaned;
}

// Vote Counter Component
function VoteCounter({ votes, question }) {
  const voteCounts = {};
  
  votes.forEach(v => {
    const normalized = normalizeRollNumber(v.answer);
    voteCounts[normalized] = (voteCounts[normalized] || 0) + 1;
  });

  const sortedVotes = Object.entries(voteCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }));

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "clamp(12px, 4vw, 20px)",
      marginBottom: 16,
      animation: "slideIn 0.5s ease forwards",
    }}>
      <h3 style={{
        color: "#fff",
        fontSize: "clamp(14px, 3vw, 16px)",
        fontWeight: 700,
        marginBottom: 12,
        textShadow: "0 0 10px rgba(255,105,180,0.4)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      }}>
        {question}
      </h3>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(clamp(80px, 20vw, 120px), 1fr))",
        gap: "clamp(8px, 2vw, 12px)",
      }}>
        {sortedVotes.map((item, idx) => (
          <div
            key={idx}
            style={{
              background: `linear-gradient(135deg, ${COLORS[idx % COLORS.length]}33, ${COLORS[idx % COLORS.length]}11)`,
              border: `1px solid ${COLORS[idx % COLORS.length]}55`,
              borderRadius: 10,
              padding: "clamp(10px, 2vw, 12px)",
              textAlign: "center",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = `0 0 15px ${COLORS[idx % COLORS.length]}44`;
              e.currentTarget.style.borderColor = `${COLORS[idx % COLORS.length]}99`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = `${COLORS[idx % COLORS.length]}55`;
            }}
          >
            <div style={{
              color: COLORS[idx % COLORS.length],
              fontSize: "clamp(20px, 5vw, 24px)",
              fontWeight: 900,
              marginBottom: 6,
              textShadow: `0 0 8px ${COLORS[idx % COLORS.length]}66`,
            }}>
              {item.count}
            </div>
            <div style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "clamp(10px, 2.5vw, 12px)",
              fontFamily: "monospace",
              letterSpacing: "0.5px",
              wordBreak: "break-all",
              lineHeight: 1.2,
              textOverflow: "ellipsis",
            }}>
              {item.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Section Dashboard Component
function SectionDashboard({ section, data, loading, error }) {
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "clamp(30px, 10vw, 50px) 20px" }}>
        <div style={{ 
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
          color: "#FF69B4"
        }}>
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
        <div style={{ 
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
          color: "#f87171"
        }}>
          <ErrorIcon />
        </div>
        <p style={{ color: "#f87171", fontSize: "clamp(14px, 3vw, 16px)" }}>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "clamp(30px, 10vw, 50px) 20px" }}>
        <div style={{ 
          display: "flex",
          justifyContent: "center",
          marginBottom: 16,
          color: "rgba(255,255,255,0.3)"
        }}>
          <EmptyIcon />
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

  const totalResponses = data.length;
  const totalQuestions = Object.keys(questionMap).length;
  const uniqueContenders = new Set();
  
  Object.values(questionMap).forEach(votes => {
    votes.forEach(v => {
      uniqueContenders.add(normalizeRollNumber(v));
    });
  });

  return (
    <div>
      {/* Stats Header */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(clamp(100px, 30vw, 150px), 1fr))",
        gap: "clamp(12px, 3vw, 16px)",
        marginBottom: "clamp(24px, 5vw, 32px)",
      }}>
        {/* Total Responses Card */}
        <div style={{
          background: "linear-gradient(135deg, #FF69B433, #FF69B411)",
          border: "1px solid #FF69B455",
          borderRadius: 12,
          padding: "clamp(14px, 3vw, 20px)",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#FF69B477";
          e.currentTarget.style.boxShadow = "0 0 15px #FF69B444";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#FF69B455";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 8,
            color: "#FF69B4",
          }}>
            <TrendIcon />
          </div>
          <div style={{
            fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: 900,
            color: "#FF69B4",
            marginBottom: 6,
          }}>
            {totalResponses}
          </div>
          <div style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "clamp(10px, 2.5vw, 12px)",
            letterSpacing: "0.5px",
            fontWeight: 600,
          }}>
            Responses
          </div>
        </div>

        {/* Questions Answered Card */}
        <div style={{
          background: "linear-gradient(135deg, #FFD70033, #FFD70011)",
          border: "1px solid #FFD70055",
          borderRadius: 12,
          padding: "clamp(14px, 3vw, 20px)",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#FFD70077";
          e.currentTarget.style.boxShadow = "0 0 15px #FFD70044";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#FFD70055";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 8,
            color: "#FFD700",
          }}>
            <ChartIcon />
          </div>
          <div style={{
            fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: 900,
            color: "#FFD700",
            marginBottom: 6,
          }}>
            {totalQuestions}
          </div>
          <div style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "clamp(10px, 2.5vw, 12px)",
            letterSpacing: "0.5px",
            fontWeight: 600,
          }}>
            Questions
          </div>
        </div>

        {/* Unique Contenders Card */}
        <div style={{
          background: "linear-gradient(135deg, #60a5fa33, #60a5fa11)",
          border: "1px solid #60a5fa55",
          borderRadius: 12,
          padding: "clamp(14px, 3vw, 20px)",
          textAlign: "center",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#60a5fa77";
          e.currentTarget.style.boxShadow = "0 0 15px #60a5fa44";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#60a5fa55";
          e.currentTarget.style.boxShadow = "none";
        }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 8,
            color: "#60a5fa",
          }}>
            <UsersIcon />
          </div>
          <div style={{
            fontSize: "clamp(24px, 6vw, 32px)",
            fontWeight: 900,
            color: "#60a5fa",
            marginBottom: 6,
          }}>
            {uniqueContenders.size}
          </div>
          <div style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "clamp(10px, 2.5vw, 12px)",
            letterSpacing: "0.5px",
            fontWeight: 600,
          }}>
            Contenders
          </div>
        </div>
      </div>

      {/* Questions and Votes */}
      <div>
        {Object.entries(questionMap).map(([question, votes], idx) => (
          <VoteCounter key={idx} question={question} votes={votes} />
        ))}
      </div>
    </div>
  );
}

// Main Dashboard Component
export default function ResultsDashboard() {
  const [activeSection, setActiveSection] = useState("ITA");
  const [sectionData, setSectionData] = useState({
    ITA: null,
    ITB: null,
    ITC: null,
  });
  const [loading, setLoading] = useState({
    ITA: false,
    ITB: false,
    ITC: false,
  });
  const [error, setError] = useState({
    ITA: null,
    ITB: null,
    ITC: null,
  });

  // Fetch data for a section
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

  // Load initial section
  useEffect(() => {
    fetchSectionData(activeSection);
  }, [activeSection]);

  // Load all sections on mount
  useEffect(() => {
    SECTIONS.forEach(section => {
      if (!sectionData[section]) {
        fetchSectionData(section);
      }
    });
  }, []);

  const handleRefresh = () => {
    SECTIONS.forEach(section => fetchSectionData(section));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');
        
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { font-family: 'Sora', sans-serif; width: 100%; height: 100%; }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,105,180,0.4);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,105,180,0.6);
        }

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
        overflow: "hidden",
        width: "100%",
      }}>
        {/* Header */}
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          marginBottom: "clamp(24px, 5vw, 40px)",
        }}>
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "clamp(12px, 3vw, 20px)",
            marginBottom: "clamp(20px, 4vw, 32px)",
          }}>
            <div style={{ flex: 1, minWidth: "200px" }}>
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
                Vote counts and analysis for all sections
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
                padding: "clamp(10px, 2.5vw, 12px) clamp(16px, 4vw, 24px)",
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
              <span style={{ display: "inline" }}>Refresh</span>
            </button>
          </div>

          {/* Section Tabs */}
          <div style={{
            display: "flex",
            gap: "clamp(8px, 2vw, 12px)",
            flexWrap: "wrap",
          }}>
            {SECTIONS.map((section, idx) => {
              const sectionColors = ["#c084fc", "#f472b6", "#60a5fa"];
              const color = sectionColors[idx];
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
                    padding: "clamp(10px, 2vw, 12px) clamp(16px, 4vw, 28px)",
                    border: `2px solid ${color}`,
                    borderRadius: 10,
                    cursor: "pointer",
                    background: isActive
                      ? `linear-gradient(135deg, ${color}33, ${color}11)`
                      : "rgba(255,255,255,0.03)",
                    boxShadow: isActive
                      ? `0 0 20px ${color}44, inset 0 0 20px ${color}22`
                      : "none",
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

        {/* Content Area */}
        <div style={{
          maxWidth: "1400px",
          margin: "0 auto",
          animation: "slideIn 0.5s ease",
          width: "100%",
        }}>
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