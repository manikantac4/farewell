import { useEffect, useRef } from "react";

const CSS = `
  @keyframes fogPulse { 0%,100%{opacity:.5} 50%{opacity:.85} }
  @keyframes ring0 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes ring1 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(-360deg)} }
  @keyframes ring2 { from{transform:translate(-50%,-50%) rotate(0deg)} to{transform:translate(-50%,-50%) rotate(360deg)} }
  @keyframes beam0 { 0%,100%{transform:translateX(-50%) rotate(-7deg);opacity:.5} 50%{transform:translateX(-50%) rotate(7deg);opacity:.9} }
  @keyframes beam1 { 0%,100%{transform:translateX(-50%) rotate(5deg);opacity:.45} 50%{transform:translateX(-50%) rotate(-5deg);opacity:.9} }
  @keyframes beam2 { 0%,100%{transform:translateX(-50%) rotate(-9deg);opacity:.5} 50%{transform:translateX(-50%) rotate(9deg);opacity:.9} }
  @keyframes sideBeamL { 0%,100%{transform:rotate(30deg);opacity:.35} 50%{transform:rotate(38deg);opacity:.75} }
  @keyframes sideBeamR { 0%,100%{transform:rotate(-30deg);opacity:.35} 50%{transform:rotate(-38deg);opacity:.75} }
  @keyframes halo { 0%,100%{opacity:.5;transform:translate(-50%,-50%) scale(1)} 50%{opacity:.9;transform:translate(-50%,-50%) scale(1.12)} }
  @keyframes risePEven { 0%{transform:translateY(0) translateX(0);opacity:0} 15%{opacity:.9} 85%{opacity:.9} 100%{transform:translateY(-110vh) translateX(25px);opacity:0} }
  @keyframes risePOdd  { 0%{transform:translateY(0) translateX(0);opacity:0} 15%{opacity:.9} 85%{opacity:.9} 100%{transform:translateY(-110vh) translateX(-25px);opacity:0} }
  @keyframes stageShine { 0%,100%{opacity:.18} 50%{opacity:.38} }
  @keyframes circlePulse {
    0%,100%{ box-shadow: 0 0 22px rgba(255,78,205,.6), 0 0 50px rgba(108,43,217,.4), inset 0 0 18px rgba(255,255,255,.18); }
    50%{ box-shadow: 0 0 45px rgba(255,78,205,.95), 0 0 90px rgba(108,43,217,.7), 0 0 130px rgba(255,217,61,.3), inset 0 0 35px rgba(255,255,255,.30); }
  }
  @keyframes ringPulse { 0%,100%{opacity:.4} 50%{opacity:.9} }
  @keyframes rimGlow { 0%,100%{opacity:.4} 50%{opacity:.9} }
`;

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left:  `${(i * 53) % 100}%`,
  delay: `${(i % 6) * 1.2}s`,
  dur:   `${12 + (i % 5) * 3}s`,
  size:  2 + (i % 3),
  color: i % 3 === 0 ? "#ff4ecd" : i % 3 === 1 ? "#ffd93d" : "#c9a8ff",
  even:  i % 2 === 0,
}));

const TOP_BEAMS = [
  { left: "28%", color: "rgba(255,78,205,0.6)",  delay: "0s",   anim: "beam0", dur: "10s" },
  { left: "50%", color: "rgba(255,217,61,0.5)",  delay: "1.5s", anim: "beam1", dur: "12s" },
  { left: "72%", color: "rgba(108,43,217,0.6)",  delay: "3s",   anim: "beam2", dur: "14s" },
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
    return () => { styleRef.current?.remove(); styleRef.current = null; };
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
        background: "radial-gradient(ellipse at 50% 110%,#1a0533 0%,#0a0118 55%,#000 100%)",
      }}
    >
      {/* Fog layers */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 50% 85%,rgba(108,43,217,.22) 0%,transparent 65%)" }} />
      <div style={{ position:"absolute", left:0, right:0, bottom:0, height:"55%", background:"radial-gradient(ellipse at center,rgba(255,78,205,.10) 0%,transparent 70%)", filter:"blur(18px)", animation:"fogPulse 9s ease-in-out infinite" }} />

      {/* Orbital rings */}
      <div style={{ position:"absolute", left:"50%", top:"44%" }}>
        {[
          { w:"50vmin", border:"rgba(255,78,205,.38)", shadow:"0 0 50px rgba(255,78,205,.38),inset 0 0 36px rgba(255,78,205,.2)", anim:"ring0", dur:"60s" },
          { w:"68vmin", border:"rgba(108,43,217,.32)", shadow:"0 0 60px rgba(108,43,217,.32),inset 0 0 46px rgba(108,43,217,.2)", anim:"ring1", dur:"82s" },
          { w:"86vmin", border:"rgba(255,217,61,.20)", shadow:"0 0 70px rgba(255,217,61,.16),inset 0 0 46px rgba(255,217,61,.10)", anim:"ring2", dur:"105s" },
        ].map((r, i) => (
          <div key={i} style={{ position:"absolute", left:"50%", top:"50%", width:r.w, height:r.w, transform:"translate(-50%,-50%)", borderRadius:"50%", border:`1.5px solid ${r.border}`, boxShadow:r.shadow, animation:`${r.anim} ${r.dur} linear infinite` }} />
        ))}
        <div style={{ position:"absolute", left:"50%", top:"50%", width:"88vmin", height:"88vmin", transform:"translate(-50%,-50%)", borderRadius:"50%", filter:"blur(48px)", background:"radial-gradient(circle,rgba(108,43,217,.28) 0%,rgba(255,78,205,.10) 42%,transparent 70%)" }} />
      </div>

      {/* Top spotlights */}
      {TOP_BEAMS.map((b, i) => (
        <div key={i} style={{ position:"absolute", top:"-8%", left:b.left, width:"clamp(14px,16vmin,100px)", height:"125vh", background:`linear-gradient(to bottom,${b.color} 0%,${b.color.replace(/[\d.]+\)$/,"0.13)")} 35%,transparent 75%)`, filter:"blur(24px)", clipPath:"polygon(44% 0%,56% 0%,97% 100%,3% 100%)", transformOrigin:"top center", animation:`${b.anim} ${b.dur} ease-in-out infinite`, animationDelay:b.delay }} />
      ))}

      {/* Side beams */}
      <div style={{ position:"absolute", top:"3%", left:"-8%", width:"clamp(12px,16vmin,100px)", height:"110vh", background:"linear-gradient(to bottom,rgba(255,78,205,.38) 0%,transparent 80%)", filter:"blur(32px)", transformOrigin:"top left", clipPath:"polygon(40% 0%,60% 0%,100% 100%,0% 100%)", animation:"sideBeamL 12s ease-in-out infinite" }} />
      <div style={{ position:"absolute", top:"3%", right:"-8%", width:"clamp(12px,16vmin,100px)", height:"110vh", background:"linear-gradient(to bottom,rgba(108,43,217,.42) 0%,transparent 80%)", filter:"blur(32px)", transformOrigin:"top right", clipPath:"polygon(40% 0%,60% 0%,100% 100%,0% 100%)", animation:"sideBeamR 14s ease-in-out infinite", animationDelay:"2s" }} />

      {/* Halo */}
      <div style={{ position:"absolute", left:"50%", top:"55%", width:"clamp(110px,50vmin,320px)", height:"clamp(110px,50vmin,320px)", transform:"translate(-50%,-50%)", borderRadius:"50%", background:"radial-gradient(circle,rgba(255,255,255,.18) 0%,rgba(255,217,61,.10) 35%,transparent 70%)", filter:"blur(20px)", animation:"halo 7s ease-in-out infinite" }} />

      {/* ══════════════════════════════════
          3-D STAGE PLATFORM
          perspective container + rotateX disc
      ══════════════════════════════════ */}
      <div style={{
        position: "absolute",
        bottom: "4%",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "clamp(220px,88vw,560px)",
      }}>
        {/* Ground shadow */}
        <div style={{
          width: "85%",
          height: "clamp(20px,7vmin,50px)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse,rgba(255,78,205,.38) 0%,rgba(108,43,217,.20) 45%,transparent 75%)",
          filter: "blur(16px)",
          marginBottom: "-8px",
          zIndex: 0,
          position: "relative",
        }} />

        {/* Perspective wrapper for 3-D effect */}
        <div style={{
          perspective: "550px",
          perspectiveOrigin: "50% 0%",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}>
          {/* ── Top face of stage disc ── */}
          <div style={{
            width: "100%",
            paddingBottom: "30%",
            borderRadius: "50%",
            transform: "rotateX(66deg)",
            transformOrigin: "center bottom",
            transformStyle: "preserve-3d",
            position: "relative",
            background: "radial-gradient(ellipse at 50% 25%, #3d0e65 0%, #1c0340 50%, #0c0020 100%)",
            boxShadow: [
              "0 0 0 1.5px rgba(255,255,255,.14)",
              "0 0 55px rgba(255,78,205,.55)",
              "0 0 110px rgba(108,43,217,.40)",
              "inset 0 0 45px rgba(255,217,61,.16)",
              "inset 0 0 90px rgba(108,43,217,.28)",
            ].join(","),
          }}>
            {/* Shine sweep */}
            <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"radial-gradient(ellipse at 50% 16%,rgba(255,255,255,.24) 0%,transparent 52%)", animation:"stageShine 6s ease-in-out infinite" }} />

            {/* Floor concentric rings */}
            {["60%","74%","88%"].map((s, i) => (
              <div key={i} style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:s, height:s, borderRadius:"50%", border:`0.8px solid rgba(${i===1?"255,217,61":"255,78,205"},${0.16-i*0.04})`, animation:`ringPulse ${5+i*1.5}s ease-in-out infinite`, animationDelay:`${i*0.7}s` }} />
            ))}

            {/* ── Centre spotlight circle ── */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              width: "36%",
              height: "36%",
              borderRadius: "50%",
              background: [
                "radial-gradient(circle at 46% 36%,",
                "#ffffff 0%,",
                "#ffe566 15%,",
                "#ffaaf5 38%,",
                "#a855f7 66%,",
                "#1a0338 100%)",
              ].join(""),
              boxShadow: [
                "0 0 0 2px rgba(255,255,255,.28)",
                "0 0 28px rgba(255,78,205,.7)",
                "0 0 55px rgba(108,43,217,.6)",
                "inset 0 0 16px rgba(255,255,255,.22)",
              ].join(","),
              animation: "circlePulse 4s ease-in-out infinite",
            }}>
              {/* Glare dot */}
              <div style={{ position:"absolute", top:"15%", left:"20%", width:"20%", height:"20%", borderRadius:"50%", background:"rgba(255,255,255,.60)", filter:"blur(2.5px)" }} />
            </div>
          </div>

          {/* ── Stage side wall (extruded edge) ── */}
          <div style={{
            width: "91%",
            height: "clamp(10px,4vmin,26px)",
            margin: "0 auto",
            marginTop: "-3px",
            borderRadius: "0 0 50% 50% / 0 0 100% 100%",
            background: "linear-gradient(180deg,#2a0a4a 0%,#0c0020 100%)",
            boxShadow: "0 10px 32px rgba(0,0,0,.75), 0 0 38px rgba(255,78,205,.18)",
            position: "relative",
            overflow: "hidden",
          }}>
            {/* Rim glow stripe */}
            <div style={{ position:"absolute", top:0, left:"8%", right:"8%", height:"2px", borderRadius:"2px", background:"linear-gradient(to right,transparent,rgba(255,78,205,.75) 28%,rgba(255,217,61,.95) 50%,rgba(108,43,217,.75) 72%,transparent)", animation:"rimGlow 4s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <span key={i} style={{ position:"absolute", left:p.left, bottom:"-5%", width:p.size, height:p.size, borderRadius:"50%", background:p.color, boxShadow:`0 0 ${p.size*5}px ${p.color}`, animation:`${p.even?"risePEven":"risePOdd"} ${p.dur} ease-in-out infinite`, animationDelay:p.delay }} />
      ))}

      {/* Vignette */}
      <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at center,transparent 48%,rgba(0,0,0,.68) 100%)" }} />
    </div>
  );
}