import { useState, useEffect } from "react";

const API_URL = "https://farewell-backend-2v9n.onrender.com/api/responses";

// Icons
const RefreshIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36" />
  </svg>
);

const LoadingIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 3a9 9 0 0 1 0 18" strokeDasharray="14" />
  </svg>
);

// ─── Simple Response List ───────────────────────────────────────────────────

function QuestionList({ question, answers }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 14,
      padding: "20px",
      marginBottom: 20,
      animation: "slideIn 0.4s ease forwards",
    }}>
      <h3 style={{
        color: "#FF69B4",
        fontSize: "16px",
        fontWeight: 700,
        marginBottom: 15,
        borderLeft: "4px solid #FF69B4",
        paddingLeft: "12px"
      }}>
        {question}
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {answers.map((ans, idx) => (
          <div key={idx} style={{
            background: "rgba(255,255,255,0.05)",
            padding: "10px 15px",
            borderRadius: 8,
            color: "#fff",
            fontSize: "14px",
            fontFamily: "monospace",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span>{ans || "Empty Response"}</span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>#{idx + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function ResultsDashboard() {
  const [activeSection, setActiveSection] = useState("ITA");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async (section) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}?section=${section}`);
      const json = await response.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(activeSection); }, [activeSection]);

  // Grouping raw responses by question
  const questionGroups = {};
  if (data) {
    data.forEach(entry => {
      entry.answers.forEach(a => {
        if (!questionGroups[a.question]) questionGroups[a.question] = [];
        questionGroups[a.question].push(a.answer);
      });
    });
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#0a0010",
      color: "#fff",
      padding: "20px",
      fontFamily: "'Sora', sans-serif"
    }}>
      <style>{`
        @keyframes slideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
          <h1 style={{ fontSize: "24px", fontWeight: 800, background: "linear-gradient(to right, #FF69B4, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Raw Responses
          </h1>
          <button onClick={() => fetchData(activeSection)} style={{ background: "none", border: "1px solid #FF69B4", color: "#FF69B4", borderRadius: "50%", padding: "10px", cursor: "pointer" }}>
            <RefreshIcon />
          </button>
        </header>

        <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
          {["ITA", "ITB", "ITC"].map(sec => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "8px",
                border: "none",
                background: activeSection === sec ? "#FF69B4" : "rgba(255,255,255,0.05)",
                color: activeSection === sec ? "#000" : "#fff",
                fontWeight: 700,
                cursor: "pointer",
                transition: "0.3s"
              }}
            >
              {sec}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}><LoadingIcon /></div>
        ) : (
          Object.entries(questionGroups).map(([q, ans], i) => (
            <QuestionList key={i} question={q} answers={ans} />
          ))
        )}
      </div>
    </div>
  );
}