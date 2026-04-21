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

  /* Mobile overrides */
  @media (max-width: 600px) {
    .cs-stage-ellipse {
      width: 88vmin !important;
      height: 22vmin !important;
    }
    .cs-stage-glow-shadow {
      width: 100vmin !important;
      height: 22vmin !important;
    }
    .cs-stage-inner-glow {
      width: 88vmin !important;
      height: 88vmin !important;
    }
    .cs-halo {
      width: 82vmin !important;
      height: 82vmin !important;
    }
    .cs-ring-0 { width: 72vmin !important; height: 72vmin !important; }
    .cs-ring-1 { width: 96vmin !important; height: 96vmin !important; }
    .cs-ring-2 { width: 116vmin !important; height: 116vmin !important; }
    .cs-beam { height: 130vh !important; width: 28vmin !important; filter: blur(22px) !important; }
    .cs-side-beam { width: 26vmin !important; }
    .cs-orb-blur { width: 110vmin !important; height: 110vmin !important; filter: blur(52px) !important; }
  }
`;

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left:  `${(i * 53) % 100}%`,
  delay: `${(i % 6) * 1.2}s`,
  dur:   `${12 + (i % 5) * 3}s`,
  size:  2 + (i % 4),
  color: i % 3 === 0 ? "#ff4ecd" : i % 3 === 1 ? "#ffd93d" : "#c9a8ff",
  even:  i % 2 === 0,
}));

const TOP_BEAMS = [
  { left: "25%", color: "rgba(255,78,205,0.65)",  delay: "0s",   anim: "beam0", dur: "10s" },
  { left: "50%", color: "rgba(255,217,61,0.55)",  delay: "1.5s", anim: "beam1", dur: "12s" },
  { left: "75%", color: "rgba(108,43,217,0.65)",  delay: "3s",   anim: "beam2", dur: "14s" },
];

// Ring sizes increased — desktop values; mobile overridden via CSS classes
const RINGS = [
  { idx: 0, cls: "cs-ring-0", size: 58,  anim: "ring0", dur: "60s",  border: "rgba(255,78,205,0.40)", shadow: "0 0 70px rgba(255,78,205,0.40),inset 0 0 50px rgba(255,78,205,0.25)" },
  { idx: 1, cls: "cs-ring-1", size: 80,  anim: "ring1", dur: "80s",  border: "rgba(108,43,217,0.35)", shadow: "0 0 80px rgba(108,43,217,0.35),inset 0 0 60px rgba(108,43,217,0.25)" },
  { idx: 2, cls: "cs-ring-2", size: 100, anim: "ring2", dur: "100s", border: "rgba(255,217,61,0.22)", shadow: "0 0 90px rgba(255,217,61,0.18),inset 0 0 60px rgba(255,217,61,0.12)" },
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
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 85%,rgba(108,43,217,.28) 0%,transparent 60%)" }} />
      <div style={{ position:"absolute", left:0, right:0, bottom:0, height:"60%", background:"radial-gradient(ellipse at center,rgba(255,78,205,.13) 0%,transparent 70%)", filter:"blur(20px)", animation:"fogPulse 9s ease-in-out infinite" }} />

      {/* Rings — centred at stage level */}
      <div style={{ position:"absolute", left:"50%", top:"42%" }}>
        {RINGS.map(({ idx, cls, size, anim, dur, border, shadow }) => (
          <div
            key={idx}
            className={cls}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: `${size}vmin`,
              height: `${size}vmin`,
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              border: `1.5px solid ${border}`,
              boxShadow: shadow,
              animation: `${anim} ${dur} linear infinite`,
            }}
          />
        ))}

        {/* Central orb blur */}
        <div
          className="cs-orb-blur"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "100vmin",
            height: "100vmin",
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            filter: "blur(56px)",
            background: "radial-gradient(circle,rgba(108,43,217,.35) 0%,rgba(255,78,205,.15) 40%,transparent 70%)",
          }}
        />
      </div>

      {/* Top spotlights */}
      {TOP_BEAMS.map((b, i) => (
        <div
          key={i}
          className="cs-beam"
          style={{
            position: "absolute",
            top: "-10%",
            left: b.left,
            width: "22vmin",
            height: "130vh",
            background: `linear-gradient(to bottom,${b.color} 0%,${b.color.replace(/[\d.]+\)$/, "0.18)")} 35%,transparent 75%)`,
            filter: "blur(30px)",
            clipPath: "polygon(44% 0%,56% 0%,96% 100%,4% 100%)",
            transformOrigin: "top center",
            animation: `${b.anim} ${b.dur} ease-in-out infinite`,
            animationDelay: b.delay,
          }}
        />
      ))}

      {/* Side beams */}
      <div
        className="cs-side-beam"
        style={{ position:"absolute", top:"3%", left:"-10%", width:"22vmin", height:"115vh", background:"linear-gradient(to bottom,rgba(255,78,205,.40) 0%,transparent 80%)", filter:"blur(38px)", transformOrigin:"top left", clipPath:"polygon(40% 0%,60% 0%,100% 100%,0% 100%)", animation:"sideBeamL 12s ease-in-out infinite" }}
      />
      <div
        className="cs-side-beam"
        style={{ position:"absolute", top:"3%", right:"-10%", width:"22vmin", height:"115vh", background:"linear-gradient(to bottom,rgba(108,43,217,.45) 0%,transparent 80%)", filter:"blur(38px)", transformOrigin:"top right", clipPath:"polygon(40% 0%,60% 0%,100% 100%,0% 100%)", animation:"sideBeamR 14s ease-in-out infinite", animationDelay:"2s" }}
      />

      {/* Halo */}
      <div
        className="cs-halo"
        style={{
          position: "absolute",
          left: "50%",
          top: "54%",
          width: "70vmin",
          height: "70vmin",
          transform: "translate(-50%,-50%)",
          borderRadius: "50%",
          background: "radial-gradient(circle,rgba(255,255,255,.20) 0%,rgba(255,217,61,.12) 35%,transparent 70%)",
          filter: "blur(22px)",
          animation: "halo 7s ease-in-out infinite",
        }}
      />

      {/* Stage */}
      <div style={{ position:"absolute", bottom:"6%", left:"50%", transform:"translateX(-50%)" }}>
        {/* Ground glow */}
        <div
          className="cs-stage-glow-shadow"
          style={{
            position: "absolute",
            left: "50%",
            top: "60%",
            transform: "translateX(-50%)",
            width: "90vmin",
            height: "18vmin",
            borderRadius: "50%",
            filter: "blur(20px)",
            background: "radial-gradient(ellipse,rgba(255,78,205,.42) 0%,rgba(108,43,217,.25) 40%,transparent 75%)",
          }}
        />
        {/* Inner centre glow */}
        <div
          className="cs-stage-inner-glow"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%,-50%)",
            width: "72vmin",
            height: "72vmin",
            borderRadius: "50%",
            filter: "blur(14px)",
            background: "radial-gradient(circle,rgba(255,217,61,.22) 0%,rgba(255,78,205,.14) 50%,transparent 75%)",
          }}
        />

        {/* Stage ellipse */}
        <div
          className="cs-stage-ellipse"
          style={{
            position: "relative",
            width: "68vmin",
            height: "18vmin",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 30%,#2a0a4a 0%,#14021f 60%,#050009 100%)",
            boxShadow: "0 30px 80px -10px rgba(0,0,0,.85),0 0 100px rgba(108,43,217,.40),inset 0 2px 8px rgba(255,255,255,.12)",
            transform: "perspective(900px) rotateX(60deg)",
          }}
        >
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"radial-gradient(ellipse at 50% 20%,rgba(255,217,61,.30) 0%,transparent 50%)" }} />
          <div style={{ position:"absolute", inset:0, borderRadius:"50%", boxShadow:"inset 0 0 36px rgba(255,78,205,.45),inset 0 0 70px rgba(108,43,217,.35)" }} />
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
            boxShadow: `0 0 ${p.size * 5}px ${p.color}`,
            animation: `${p.even ? "risePEven" : "risePOdd"} ${p.dur} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 50%,rgba(0,0,0,.70) 100%)" }} />
    </div>
  );
}