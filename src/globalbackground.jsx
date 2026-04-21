import { useEffect, useRef } from "react";

const CSS = `
  @keyframes fogPulse { 0%,100%{opacity:.55} 50%{opacity:.85} }
  @keyframes ring0 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes ring1 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
  @keyframes ring2 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes beam0 { 0%,100%{transform:translateX(-50%) rotate(-8deg);opacity:.55} 50%{transform:translateX(-50%) rotate(8deg);opacity:.95} }
  @keyframes beam1 { 0%,100%{transform:translateX(-50%) rotate(6deg);opacity:.55} 50%{transform:translateX(-50%) rotate(-6deg);opacity:.95} }
  @keyframes beam2 { 0%,100%{transform:translateX(-50%) rotate(-10deg);opacity:.55} 50%{transform:translateX(-50%) rotate(10deg);opacity:.95} }
  @keyframes sideBeamL { 0%,100%{transform:rotate(31deg);opacity:.4} 50%{transform:rotate(39deg);opacity:.8} }
  @keyframes sideBeamR { 0%,100%{transform:rotate(-31deg);opacity:.4} 50%{transform:rotate(-39deg);opacity:.8} }
  @keyframes halo { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5} 50%{transform:translate(-50%,-50%) scale(1.15);opacity:.9} }
  @keyframes risePEven { 0%{transform:translateY(0) translateX(0);opacity:0} 15%{opacity:.9} 85%{opacity:.9} 100%{transform:translateY(-110vh) translateX(30px);opacity:0} }
  @keyframes risePOdd  { 0%{transform:translateY(0) translateX(0);opacity:0} 15%{opacity:.9} 85%{opacity:.9} 100%{transform:translateY(-110vh) translateX(-30px);opacity:0} }
`;

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  left:  `${(i * 53) % 100}%`,
  delay: `${(i % 6) * 1.2}s`,
  dur:   `${12 + (i % 5) * 3}s`,
  size:  2 + (i % 3),
  color: i % 3 === 0 ? "#ff4ecd" : i % 3 === 1 ? "#ffd93d" : "#c9a8ff",
  even:  i % 2 === 0,
}));

const TOP_BEAMS = [
  { left: "30%", color: "rgba(255,78,205,0.55)",  delay: "0s",   anim: "beam0", dur: "10s" },
  { left: "50%", color: "rgba(255,217,61,0.45)",  delay: "1.5s", anim: "beam1", dur: "12s" },
  { left: "70%", color: "rgba(108,43,217,0.55)",  delay: "3s",   anim: "beam2", dur: "14s" },
];

const RINGS = [
  { idx: 0, anim: "ring0", dur: "60s",  border: "rgba(255,78,205,0.35)", shadow: "0 0 60px rgba(255,78,205,0.35),inset 0 0 40px rgba(255,78,205,0.20)" },
  { idx: 1, anim: "ring1", dur: "80s",  border: "rgba(108,43,217,0.30)", shadow: "0 0 70px rgba(108,43,217,0.30),inset 0 0 50px rgba(108,43,217,0.20)" },
  { idx: 2, anim: "ring2", dur: "100s", border: "rgba(255,217,61,0.18)", shadow: "0 0 80px rgba(255,217,61,0.15),inset 0 0 50px rgba(255,217,61,0.10)" },
];

export default function CinematicStage() {
  const styleRef = useRef(null);

  useEffect(() => {
    if (!styleRef.current) {
      const el = document.createElement("style");
      el.textContent = CSS;
      document.head.appendChild(el);
      styleRef.current = el;
    }
    return () => {
      styleRef.current?.remove();
      styleRef.current = null;
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        pointerEvents: "none",
        position: "fixed",
        inset: 0,
        zIndex: -10,
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 120%,#1a0533 0%,#0a0118 55%,#000 100%)",
      }}
    >
      {/* Fog */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 85%,rgba(108,43,217,.25) 0%,transparent 60%)" }} />
      <div style={{ position:"absolute", left:0, right:0, bottom:0, height:"55%", background:"radial-gradient(ellipse at center,rgba(255,78,205,.10) 0%,transparent 70%)", filter:"blur(16px)", animation:"fogPulse 9s ease-in-out infinite" }} />

      {/* Rings */}
      <div style={{ position:"absolute", left:"50%", top:"42%" }}>
        {RINGS.map(({ idx, anim, dur, border, shadow }) => {
          const size = 40 + idx * 18;
          return (
            <div
              key={idx}
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: `${size}vmin`,
                height: `${size}vmin`,
                transform: "translate(-50%,-50%)",
                borderRadius: "50%",
                border: `1px solid ${border}`,
                boxShadow: shadow,
                animation: `${anim} ${dur} linear infinite`,
              }}
            />
          );
        })}
        <div style={{ position:"absolute", left:"50%", top:"50%", width:"80vmin", height:"80vmin", transform:"translate(-50%,-50%)", borderRadius:"50%", filter:"blur(48px)", background:"radial-gradient(circle,rgba(108,43,217,.30) 0%,rgba(255,78,205,.12) 40%,transparent 70%)" }} />
      </div>

      {/* Top spotlights */}
      {TOP_BEAMS.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: "-10%",
            left: b.left,
            width: "20vmin",
            height: "120vh",
            background: `linear-gradient(to bottom,${b.color} 0%,${b.color.replace(/[\d.]+\)$/, "0.15)")} 35%,transparent 75%)`,
            filter: "blur(28px)",
            clipPath: "polygon(45% 0%,55% 0%,95% 100%,5% 100%)",
            transformOrigin: "top center",
            animation: `${b.anim} ${b.dur} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        />
      ))}

      {/* Side beams */}
      <div style={{ position:"absolute", top:"5%", left:"-10%", width:"18vmin", height:"110vh", background:"linear-gradient(to bottom,rgba(255,78,205,.35) 0%,transparent 80%)", filter:"blur(36px)", transformOrigin:"top left", clipPath:"polygon(40% 0%,60% 0%,100% 100%,0% 100%)", animation:"sideBeamL 12s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"5%", right:"-10%", width:"18vmin", height:"110vh", background:"linear-gradient(to bottom,rgba(108,43,217,.40) 0%,transparent 80%)", filter:"blur(36px)", transformOrigin:"top right", clipPath:"polygon(40% 0%,60% 0%,100% 100%,0% 100%)", animation:"sideBeamR 14s ease-in-out infinite", animationDelay:"2s" }} />

      {/* Halo */}
      <div style={{ position:"absolute", left:"50%", top:"58%", width:"55vmin", height:"55vmin", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,.18) 0%,rgba(255,217,61,.10) 35%,transparent 70%)", filter:"blur(20px)", animation:"halo 7s ease-in-out infinite" }} />

      {/* Stage */}
      <div style={{ position:"absolute", bottom:"8%", left:"50%", transform:"translateX(-50%)" }}>
        <div style={{ position:"absolute", left:"50%", top:"55%", transform:"translateX(-50%)", width:"70vmin", height:"12vmin", borderRadius:"50%", filter:"blur(16px)", background:"radial-gradient(ellipse,rgba(255,78,205,.35) 0%,rgba(108,43,217,.20) 40%,transparent 75%)" }} />
        <div style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:"60vmin", height:"60vmin", borderRadius:"50%", filter:"blur(12px)", background:"radial-gradient(circle,rgba(255,217,61,.18) 0%,rgba(255,78,205,.10) 50%,transparent 75%)" }} />
        <div style={{ position:"relative", width:"50vmin", height:"12vmin", borderRadius:"50%", background:"radial-gradient(ellipse at 50% 30%,#2a0a4a 0%,#14021f 60%,#050009 100%)", boxShadow:"0 30px 60px -10px rgba(0,0,0,.8),0 0 80px rgba(108,43,217,.35),inset 0 2px 6px rgba(255,255,255,.10)", transform:"perspective(800px) rotateX(60deg)" }}>
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"radial-gradient(ellipse at 50% 20%,rgba(255,217,61,.25) 0%,transparent 50%)" }} />
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", boxShadow:"inset 0 0 30px rgba(255,78,205,.40),inset 0 0 60px rgba(108,43,217,.30)" }} />
        </div>
      </div>

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            left: p.left,
            bottom: "-5%",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: p.color,
            boxShadow: `0 0 ${p.size * 4}px ${p.color}`,
            animation: `${p.even ? "risePEven" : "risePOdd"} ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 55%,rgba(0,0,0,.65) 100%)" }} />
    </div>
  );
}