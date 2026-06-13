import React, { useEffect, useRef, useState } from "react";
import landingVideo from "../assets/landingsectionvideo.mp4";
import "../styles/landing.css";

const STORY_LINES = [
  "every design has a story.",
  "every pixel, a decision.",
  "every brand, a feeling.",
  "we build the impossible.",
];

// ── Lerp hook — drives ALL animation, card + text ─────────────
function useLerp(target, k = 0.072) {
  const [val, setVal] = useState(target);
  const cur = useRef(target);
  const tgt = useRef(target);
  const raf = useRef(null);

  useEffect(() => { tgt.current = target; }, [target]);

  useEffect(() => {
    const loop = () => {
      const d = tgt.current - cur.current;
      if (Math.abs(d) > 0.000008) {
        cur.current += d * k;
        setVal(cur.current);
      } else {
        cur.current = tgt.current;
        setVal(tgt.current);
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [k]);

  return val;
}

function eio(t) {
  t = Math.min(Math.max(t, 0), 1);
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2;
}
function clamp(v, lo=0, hi=1) { return Math.min(Math.max(v, lo), hi); }
function map(v, a, b) { return clamp((v - a) / (b - a)); }

export default function Landing() {
  const [rawP, setRawP] = useState(0);

  useEffect(() => {
    // Total scroll space:
    //   desktop → 560vh  (460vh travel)
    //   mobile  → 460vh  (360vh travel)
    // Lots of room = text never rushes even on fast swipe
    const getTotalScroll = () => {
      const isMobile = window.innerWidth <= 820;
      return window.innerHeight * (isMobile ? 4.6 : 5.6);
    };

    const onScroll = () => {
      setRawP(clamp(window.scrollY / getTotalScroll()));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Single lerped progress drives everything — fast scroll just
  // makes the lerp chase harder, never skips animation frames
  const p = useLerp(rawP, 0.072);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 820;
  const vw = typeof window !== "undefined" ? window.innerWidth  : 1440;
  const vh = typeof window !== "undefined" ? window.innerHeight : 900;

  // ── Phase map (all 0→1) ───────────────────────────────────────
  //
  //  0.00 – 0.14   hero fades out
  //  0.10 – 0.36   card shrinks to pill
  //  0.34 – 0.38   story container fades in   ← appears almost immediately
  //  0.36 – 0.86   4 story lines cycle         ← each line owns 0.125 of progress
  //  0.86 – 1.00   everything exits
  //
  // Each line slot (0.125 wide) splits as:
  //   0.00 – 0.28   words rocket in  (staggered)
  //   0.28 – 0.72   HOLD (text just sits — this is the long dwell)
  //   0.72 – 1.00   words rocket out

  const heroFade   = eio(map(p, 0.00, 0.14));
  const cardShrink = eio(map(p, 0.10, 0.36));
  const storyIn    =     map(p, 0.34, 0.38);   // fast fade-in, no delay
  const storyProg  =     map(p, 0.36, 0.82);
const exitFade   = eio(map(p, 0.82, 0.96));

  // ── Card pill geometry ────────────────────────────────────────
  const pillW  = isMobile ? vw * 0.88 : Math.min(vw * 0.50, 700);
  const pillH  = isMobile ? vh * 0.44 : vh * 0.50;
  const pTop   = (vh - pillH) / 2;
  const pLeft  = (vw - pillW) / 2;
  const pBot   = vh - pTop - pillH;
  const pRight = vw - pLeft - pillW;

  const mediaStyle = {
    position    : "absolute",
    top         : `${cardShrink * pTop}px`,
    left        : `${cardShrink * pLeft}px`,
    right       : `${cardShrink * pRight}px`,
    bottom      : `${cardShrink * pBot}px`,
    borderRadius: `${cardShrink * (isMobile ? 28 : 40)}px`,
    opacity     : 1 - exitFade,
    overflow    : "hidden",
    zIndex      : 1,
    willChange  : "top,left,right,bottom,border-radius,opacity",
  };

  const heroStyle = {
    opacity     : 1 - heroFade,
    transform   : `translateY(${-heroFade * 40}px) scale(${1 - heroFade * 0.03})`,
    pointerEvents: heroFade > 0.9 ? "none" : "auto",
    willChange  : "opacity,transform",
  };

  // ── Story lines ───────────────────────────────────────────────
  const N        = STORY_LINES.length;          // 4
  const slotSize = 1 / N;                       // 0.25 each

  // Active line index — clamp so last line stays visible until exit
  const rawIdx = storyProg * N;
  const idx    = clamp(Math.floor(rawIdx), 0, N - 1);

  // Progress within the current slot (0→1)
  const slot = map(storyProg, idx * slotSize, (idx + 1) * slotSize);

  // Word animation — pure function of `slot`, so reversing scroll
  // plays it perfectly backwards
  function wordStyle(wi, total) {
    const stagger = (wi / total) * 0.20;   // tight left-to-right stagger
    const inEnd   = stagger + 0.22;
    const inP     = eio(map(slot, stagger, inEnd));

    // All words exit together (no stagger on exit = rocket feel)
    const outP    = eio(map(slot, 0.72, 1.00));

    return {
      display   : "inline-block",
      opacity   : inP * (1 - outP),
      transform : `translateY(${(1 - inP) * 60 + outP * -72}px)`,
      willChange: "opacity,transform",
    };
  }

  // Dots appear after text is in (slot > 0.30), disappear with exit
  const dotsOpacity = clamp(map(slot, 0.28, 0.40)) * (1 - eio(map(slot, 0.72, 1.00)));

  const storyContainerStyle = {
    opacity     : storyIn * (1 - exitFade),
    pointerEvents: storyIn > 0.5 ? "auto" : "none",
    willChange  : "opacity",
  };

  const dotsStyle = {
    opacity  : dotsOpacity,
    transform: `translateY(${(1 - clamp(map(slot, 0.28, 0.40))) * 10}px)`,
    transition: "none",   // driven by scroll, no CSS transition
  };

  return (
    <section className="landing-scroll">
     <div className="landing-sticky" style={{ opacity: 1 - exitFade }}>

        {/* Video card */}
        <div className="landing-media-card" style={mediaStyle}>
          <video className="landing-video" src={landingVideo}
            autoPlay muted loop playsInline />
          <div className="landing-shade" />
        </div>

        {/* Hero copy */}
        <div className="landing-content" style={heroStyle}>
          <p className="landing-kicker">Websites for brands with taste</p>
          <h1>relieve the ordinary<br />indulge in design</h1>
          <p className="landing-copy">
            Premium websites, visual systems, and digital experiences built
            for brands that want to feel impossible to ignore.
          </p>
        </div>

        {/* Story lines */}
        <div className="landing-story" style={storyContainerStyle}>
          <div className="landing-story-line" key={idx}>
            {STORY_LINES[idx].split(" ").map((word, i, arr) => (
              <span key={i} className="landing-story-word" style={wordStyle(i, arr.length)}>
                {word}{i < arr.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </div>
          {/* Dots trail in after the text line */}
          <div className="landing-story-dots" style={dotsStyle}>
            {STORY_LINES.map((_, i) => (
              <span key={i} className={`landing-story-dot${i === idx ? " active" : ""}`} />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}