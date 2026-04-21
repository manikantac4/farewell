import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// ─── Responsive hook ───────────────────────────────────────────────────────────
function useWindowSize() {
  const [size, setSize] = useState({ w: 375, h: 667 });
  useEffect(() => {
    const update = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return size;
}

// ─── Particle System ───────────────────────────────────────────────────────────
function ParticleCanvas({ active }) {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const spawn = (x, y) => {
      for (let i = 0; i < 6; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        particles.current.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          life: 1,
          decay: Math.random() * 0.03 + 0.015,
          size: Math.random() * 4 + 2,
          color: Math.random() > 0.5 ? "#FFD700" : "#FF69B4",
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter(p => p.life > 0);
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.08;
        p.life -= p.decay;
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(loop);
    };

    const spawnInterval = setInterval(() => {
      if (!canvas) return;
      const x = canvas.width * 0.2 + Math.random() * canvas.width * 0.6;
      const y = canvas.height * 0.4 + Math.random() * canvas.height * 0.2;
      spawn(x, y);
    }, 80);

    loop();

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 10 }}
    />
  );
}

// ─── Point Formation Text (Batch Scene) ────────────────────────────────────────
function PointFormationText({ text, trigger, onDone }) {
  const canvasRef = useRef(null);
  const stateRef = useRef({ particles: [], phase: "idle", rafId: null });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // Use the actual rendered size
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const offscreen = document.createElement("canvas");
    offscreen.width = W;
    offscreen.height = H;
    const octx = offscreen.getContext("2d");

    // Scale font to screen — smaller on narrow viewports
    const fontSize = W < 420 ? Math.floor(W / 10) : W < 600 ? 36 : 54;
    octx.font = `900 ${fontSize}px 'Orbitron', monospace`;
    octx.fillStyle = "#fff";
    octx.textAlign = "center";
    octx.textBaseline = "middle";
    // Strip emoji for pixel sampling; draw separately for display
    const sampleText = text.replace(/\p{Emoji}/gu, "").trim();
    octx.fillText(sampleText, W / 2, H / 2);

    const imageData = octx.getImageData(0, 0, W, H);
    const data = imageData.data;
    const targets = [];
    const step = W < 420 ? 2 : 3;

    for (let y = 0; y < H; y += step) {
      for (let x = 0; x < W; x += step) {
        const idx = (y * W + x) * 4;
        if (data[idx + 3] > 128) {
          targets.push({ x, y });
        }
      }
    }

    stateRef.current.particles = targets.map(t => ({
      tx: t.x, ty: t.y,
      x: Math.random() * W,
      y: Math.random() * H,
      vx: 0, vy: 0,
      color: Math.random() > 0.6
        ? "#FF69B4"
        : Math.random() > 0.5
        ? "#FFD700"
        : "#ffffff",
      size: Math.random() * 1.8 + 0.8,
    }));

    stateRef.current.phase = "forming";
    let frame = 0;
    let holdFrames = 0;
    let disperseFrames = 0;

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      const ps = stateRef.current.particles;

      if (stateRef.current.phase === "forming") {
        frame++;
        let allArrived = true;
        ps.forEach(p => {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 1.5) {
            allArrived = false;
            p.x += dx * 0.08;
            p.y += dy * 0.08;
          } else {
            p.x = p.tx;
            p.y = p.ty;
          }
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
        if (allArrived || frame > 90) {
          stateRef.current.phase = "holding";
        }
      } else if (stateRef.current.phase === "holding") {
        holdFrames++;
        ps.forEach(p => {
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 3;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.tx, p.ty, p.size, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.shadowBlur = 0;
        if (holdFrames > 80) {
          stateRef.current.phase = "dispersing";
          ps.forEach(p => {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 1;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed - 1;
          });
        }
      } else if (stateRef.current.phase === "dispersing") {
        disperseFrames++;
        ps.forEach(p => {
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.05;
          const alpha = Math.max(0, 1 - disperseFrames / 40);
          ctx.globalAlpha = alpha;
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 4;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.shadowBlur = 0;
        });
        if (disperseFrames > 45) {
          cancelAnimationFrame(stateRef.current.rafId);
          ctx.clearRect(0, 0, W, H);
          onDone && onDone();
          return;
        }
      }

      stateRef.current.rafId = requestAnimationFrame(animate);
    };

    stateRef.current.rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(stateRef.current.rafId);
  }, [trigger]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: "clamp(100px, 22vw, 160px)" }}
    />
  );
}

// ─── Typewriter with Sparks ────────────────────────────────────────────────────
function TypewriterLine({ text, delay = 0, onDone, sparkColor1 = "#FFD700", sparkColor2 = "#FF69B4" }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [sparking, setSparking] = useState(false);

  useEffect(() => {
    let i = 0;
    const timeout = setTimeout(() => {
      setSparking(true);
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
          setTimeout(() => {
            setSparking(false);
            onDone && onDone();
          }, 400);
        }
      }, 55);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return (
    <div
      className="relative flex items-center justify-center my-3"
      style={{ overflow: "visible", width: "100%" }}
    >
      <span
        className="relative font-bold"
        style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(0.85rem, 4vw, 1.8rem)",
          color: "#fff",
          textShadow: done
            ? `0 0 20px ${sparkColor1}, 0 0 40px ${sparkColor2}`
            : "0 0 8px rgba(255,255,255,0.4)",
          transition: "text-shadow 0.4s ease",
          letterSpacing: "clamp(0.05em, 1.5vw, 0.15em)",
          display: "inline-block",
          maxWidth: "100%",
          wordBreak: "break-word",
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {displayed}
        {!done && (
          <span
            className="inline-block ml-1"
            style={{
              width: "2px",
              height: "1.1em",
              background: sparkColor1,
              verticalAlign: "middle",
              boxShadow: `0 0 8px ${sparkColor1}`,
              animation: "blink 0.6s step-end infinite",
            }}
          />
        )}
      </span>
      {sparking && (
        <SparkBurst color1={sparkColor1} color2={sparkColor2} />
      )}
    </div>
  );
}

function SparkBurst({ color1, color2 }) {
  const sparks = Array.from({ length: 8 }, (_, i) => i);
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        right: "-16px",
        top: "50%",
        transform: "translateY(-50%)",
        overflow: "visible",
      }}
    >
      {sparks.map(i => (
        <div
          key={i}
          className="absolute"
          style={{
            width: `${Math.random() * 3 + 2}px`,
            height: `${Math.random() * 3 + 2}px`,
            borderRadius: "50%",
            background: i % 2 === 0 ? color1 : color2,
            boxShadow: `0 0 6px ${i % 2 === 0 ? color1 : color2}`,
            animation: `spark${i % 4} 0.5s ease-out forwards`,
            top: `${Math.random() * 30 - 15}px`,
            left: `${Math.random() * 20 - 10}px`,
          }}
        />
      ))}
    </div>
  );
}

// ─── VRSEC 3D Zoom + Move Up ───────────────────────────────────────────────────
function VrsecScene({ onDone }) {
  const [phase, setPhase] = useState("entering");
  const { w, h } = useWindowSize();
  const isMobile = w < 640;

  // Responsive shift amounts
  const moveY = isMobile ? -55 : -90;
  const moveScale = isMobile ? 0.72 : 0.75;

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("resting"), 1400);
    const t2 = setTimeout(() => setPhase("moving"), 2600);
    const t3 = setTimeout(() => {
      setPhase("done");
      onDone && onDone();
    }, 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const styles = {
    entering: {
      transform: "scale(0.05) translateY(0px)",
      opacity: 0,
      filter: "blur(12px)",
    },
    resting: {
      transform: "scale(1) translateY(0px)",
      opacity: 1,
      filter: "blur(0px)",
    },
    moving: {
      transform: `scale(${moveScale}) translateY(${moveY}px)`,
      opacity: 1,
      filter: "blur(0px)",
    },
    done: {
      transform: `scale(${moveScale}) translateY(${moveY}px)`,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ zIndex: 20 }}
    >
      <div
        style={{
          ...styles[phase],
          transition:
            phase === "entering"
              ? "all 1.4s cubic-bezier(0.16,1,0.3,1)"
              : phase === "resting"
              ? "all 1.1s cubic-bezier(0.34,1.56,0.64,1)"
              : "all 0.9s cubic-bezier(0.4,0,0.2,1)",
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(2.8rem, 13vw, 7rem)",
          fontWeight: 900,
          color: "#fff",
          letterSpacing: "0.18em",
          textShadow:
            "0 0 30px rgba(255,105,180,0.8), 0 0 60px rgba(255,105,180,0.4), 0 0 120px rgba(255,105,180,0.2)",
          WebkitTextStroke: "1px rgba(255,180,230,0.4)",
          whiteSpace: "nowrap",
        }}
      >
        VRSEC
      </div>
    </div>
  );
}

// ─── IT Scene (slides in under VRSEC) ─────────────────────────────────────────
function ITScene({ show, onDone }) {
  const [visible, setVisible] = useState(false);
  const { w } = useWindowSize();
  const isMobile = w < 640;

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setVisible(true);
      setTimeout(() => onDone && onDone(), 1800);
    }, 100);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        zIndex: 19,
        paddingTop: isMobile ? "clamp(36px, 10vw, 60px)" : "60px",
      }}
    >
      <div
        style={{
          transform: visible ? "translateY(0px)" : "translateY(40px)",
          opacity: visible ? 1 : 0,
          transition: "all 0.8s cubic-bezier(0.34,1.56,0.64,1)",
          fontFamily: "'Orbitron', monospace",
          fontSize: isMobile ? "clamp(0.65rem, 3.8vw, 2rem)" : "clamp(1rem, 3.5vw, 2rem)",
          fontWeight: 700,
          color: "transparent",
          backgroundImage: "linear-gradient(90deg, #FF69B4, #FFD700, #FF69B4)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          letterSpacing: isMobile ? "0.12em" : "0.25em",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          maxWidth: "95vw",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        Information Technology
      </div>
    </div>
  );
}

// ─── MAIN INTRO COMPONENT ─────────────────────────────────────────────────────
export default function Intro({ onComplete }) {
  const [scene, setScene] = useState(1);
  const [showIT, setShowIT] = useState(false);
  const [fadeOut12, setFadeOut12] = useState(false);
  const [batchTrigger, setBatchTrigger] = useState(false);
  const [twLine, setTwLine] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [fadeOutAll, setFadeOutAll] = useState(false);
  const { w } = useWindowSize();
  const isMobile = w < 640;
  const navigate = useNavigate();

  const onVrsecDone = () => setShowIT(true);
  const onITDone = () => {
    setTimeout(() => {
      setFadeOut12(true);
      setTimeout(() => {
        setScene(3);
        setBatchTrigger(true);
      }, 800);
    }, 1000);
  };

  const onBatchDone = () => {
    setTimeout(() => setScene(4), 200);
  };

  const onTW1 = () => setTimeout(() => setTwLine(2), 700);
  const onTW2 = () => setTimeout(() => setTwLine(3), 700);
  const onTW3 = () => setTimeout(() => setTwLine(4), 800);
  const onTW4 = () => setTimeout(() => setTwLine(5), 600);
  const onTW5 = () => setTimeout(() => setShowCTA(true), 800);

  useEffect(() => {
    if (scene === 4 && twLine === 0) {
      setTimeout(() => setTwLine(1), 300);
    }
  }, [scene]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');

        * { box-sizing: border-box; }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spark0 {
          to { transform: translate(12px, -14px); opacity: 0; }
        }
        @keyframes spark1 {
          to { transform: translate(-10px, -16px); opacity: 0; }
        }
        @keyframes spark2 {
          to { transform: translate(16px, 8px); opacity: 0; }
        }
        @keyframes spark3 {
          to { transform: translate(-14px, 10px); opacity: 0; }
        }
        @keyframes bgPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.85; }
        }
        @keyframes floatStar {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-20px) scale(1.1); opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,105,180,0.5), 0 0 40px rgba(255,105,180,0.2); }
          50% { box-shadow: 0 0 40px rgba(255,105,180,0.9), 0 0 80px rgba(255,105,180,0.4), 0 0 120px rgba(255,215,0,0.2); }
        }
        @keyframes ctaFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes lineReveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          minHeight: "100vh",
          minHeight: "100dvh",
          background: "linear-gradient(135deg, #0a0010 0%, #1a0025 30%, #2d0040 55%, #1a0020 75%, #0d000f 100%)",
          fontFamily: "'Orbitron', monospace",
          touchAction: "manipulation",
        }}
      >
        {/* Ambient pink blobs */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <div style={{
            position: "absolute", top: "10%", left: "5%",
            width: isMobile ? "70vw" : "40vw",
            height: isMobile ? "70vw" : "40vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,20,147,0.12) 0%, transparent 70%)",
            animation: "bgPulse 4s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", bottom: "10%", right: "5%",
            width: isMobile ? "60vw" : "35vw",
            height: isMobile ? "60vw" : "35vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,105,180,0.10) 0%, transparent 70%)",
            animation: "bgPulse 5s ease-in-out infinite 1s",
          }} />
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            width: "60vw", height: "30vw",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(180,0,255,0.06) 0%, transparent 70%)",
          }} />
        </div>

        {/* Floating stars */}
        {Array.from({ length: isMobile ? 16 : 24 }).map((_, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            zIndex: 2,
            left: `${(i * 31 + 7) % 100}%`,
            top: `${(i * 47 + 13) % 100}%`,
            width: `${(i % 3) + 1}px`,
            height: `${(i % 3) + 1}px`,
            borderRadius: "50%",
            background: i % 3 === 0 ? "#FF69B4" : i % 3 === 1 ? "#FFD700" : "#fff",
            opacity: 0.35 + (i % 5) * 0.1,
            animation: `floatStar ${3 + (i % 4)}s ease-in-out infinite ${(i % 4) * 0.8}s`,
            boxShadow: `0 0 ${(i % 4) + 2}px currentColor`,
          }} />
        ))}

        {/* ── Scene 1 & 2: VRSEC + IT ── */}
        {(scene === 1 || scene === 2) && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 15,
              opacity: fadeOut12 ? 0 : 1,
              transition: "opacity 0.8s ease",
            }}
          >
            <VrsecScene onDone={onVrsecDone} />
            <ITScene show={showIT} onDone={onITDone} />

            {showIT && (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ paddingTop: isMobile ? "clamp(100px, 28vw, 180px)" : "140px" }}
              >
                <div style={{
                  width: "60vw", maxWidth: "400px", height: "1px",
                  background: "linear-gradient(90deg, transparent, rgba(255,105,180,0.5), rgba(255,215,0,0.5), transparent)",
                  marginTop: "16px",
                }} />
              </div>
            )}
          </div>
        )}

        {/* ── Scene 3: Batch Formation ── */}
        {scene === 3 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{ zIndex: 15, padding: "0 16px" }}
          >
            <div style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "clamp(0.6rem, 2.5vw, 1rem)",
              color: "rgba(255,215,0,0.6)",
              letterSpacing: "0.4em",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}>
              CLASS OF
            </div>
            <PointFormationText
              text="Batch 2022 – 2026 🎓"
              trigger={batchTrigger}
              onDone={onBatchDone}
            />
          </div>
        )}

        {/* ── Scene 4+: Typewriter Emotional Lines ── */}
        {scene === 4 && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              zIndex: 15,
              paddingLeft: isMobile ? "20px" : "32px",
              paddingRight: isMobile ? "20px" : "32px",
              paddingTop: "16px",
              paddingBottom: "16px",
            }}
          >
            <ParticleCanvas active={twLine > 0 && twLine < 6} />

            <div
              className="relative flex flex-col items-center w-full"
              style={{
                zIndex: 10,
                maxWidth: isMobile ? "100%" : "672px",
              }}
            >
              {twLine >= 1 && (
                <TypewriterLine
                  text="4 years…"
                  delay={0}
                  onDone={onTW1}
                  sparkColor1="#FFD700"
                  sparkColor2="#FF69B4"
                />
              )}
              {twLine >= 2 && (
                <TypewriterLine
                  text="Countless memories…"
                  delay={0}
                  onDone={onTW2}
                  sparkColor1="#FF69B4"
                  sparkColor2="#FFD700"
                />
              )}
              {twLine >= 3 && (
                <TypewriterLine
                  text="Endless laughs…"
                  delay={0}
                  onDone={onTW3}
                  sparkColor1="#FFD700"
                  sparkColor2="#FF69B4"
                />
              )}

              {twLine >= 4 && (
                <div style={{
                  width: "50%", height: "1px", margin: "12px auto",
                  background: "linear-gradient(90deg, transparent, rgba(255,105,180,0.6), transparent)",
                  animation: "lineReveal 0.5s ease forwards",
                }} />
              )}

              {twLine >= 4 && (
                <TypewriterLine
                  text="And now…"
                  delay={0}
                  onDone={onTW4}
                  sparkColor1="#fff"
                  sparkColor2="#FFD700"
                />
              )}

              {twLine >= 5 && (
                <div style={{ marginTop: "8px", width: "100%" }}>
                  <TypewriterLine
                    text="It's time to remember who made it unforgettable 💙"
                    delay={0}
                    onDone={onTW5}
                    sparkColor1="#FF69B4"
                    sparkColor2="#FFD700"
                  />
                </div>
              )}

              {showCTA && (
                <div
                  style={{
                    marginTop: isMobile ? "28px" : "40px",
                    animation: "lineReveal 0.7s ease forwards, ctaFloat 3s ease-in-out 0.7s infinite",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <div style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    fontSize: "clamp(0.7rem, 2.5vw, 1rem)",
                    color: "rgba(255,105,180,0.7)",
                    letterSpacing: "0.3em",
                    textAlign: "center",
                    marginBottom: "16px",
                    textTransform: "uppercase",
                  }}>
                    Ready to relive it?
                  </div>
                  <button
                    onClick={() => {
  setFadeOutAll(true);
  setTimeout(() => {
    navigate("/background"); // 🔥 THIS IS THE KEY
  }, 900);
}}
                    style={{
                      fontFamily: "'Orbitron', monospace",
                      fontWeight: 700,
                      fontSize: "clamp(0.75rem, 3vw, 1.1rem)",
                      letterSpacing: "0.2em",
                      color: "#fff",
                      padding: isMobile ? "12px 28px" : "14px 44px",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      background: "linear-gradient(135deg, #c2185b, #e91e8c, #ff69b4)",
                      boxShadow: "0 0 20px rgba(255,105,180,0.5), 0 0 40px rgba(255,105,180,0.2)",
                      animation: "glowPulse 2s ease-in-out infinite",
                      position: "relative",
                      overflow: "hidden",
                      textTransform: "uppercase",
                      minWidth: isMobile ? "200px" : "auto",
                      maxWidth: "90vw",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "scale(1.05)";
                      e.currentTarget.style.boxShadow = "0 0 40px rgba(255,105,180,0.9), 0 0 80px rgba(255,215,0,0.3)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  >
                    ✦ Start Experience ✦
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Global fade out overlay */}
        {fadeOutAll && (
          <div
            className="absolute inset-0"
            style={{
              zIndex: 100,
              background: "#000",
              opacity: fadeOutAll ? 1 : 0,
              transition: "opacity 0.9s ease",
            }}
          />
        )}
      </div>
    </>
  );
}

// ─── App wrapper ───────────────────────────────────────────────────────────────
function NextComponent() {
  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: "linear-gradient(135deg, #0a0010, #1a0025)",
        fontFamily: "'Orbitron', monospace",
      }}
    >
      <div className="text-center" style={{ padding: "0 20px" }}>
        <div style={{
          fontSize: "clamp(1.5rem, 5vw, 3rem)",
          color: "#FF69B4",
          fontWeight: 900,
          textShadow: "0 0 30px rgba(255,105,180,0.6)",
          letterSpacing: "0.15em",
          marginBottom: "16px",
        }}>
          🎬 YOUR NEXT COMPONENT
        </div>
        <div style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
          letterSpacing: "0.3em",
          fontFamily: "'Rajdhani', sans-serif",
        }}>
          PLUG YOUR GALLERY / SLIDESHOW / MEMORIES HERE
        </div>
      </div>
    </div>
  );
}

export function App() {
  const [introComplete, setIntroComplete] = useState(false);
  return introComplete ? <NextComponent /> : <Intro onComplete={() => setIntroComplete(true)} />;
}