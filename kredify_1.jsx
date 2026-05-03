import { useState, useEffect, useRef } from "react";

const COLORS = {
  navy: "#0A1628",
  teal: "#00C9A7",
  tealDark: "#009E84",
  tealLight: "#E0FAF5",
  gold: "#F5A623",
  goldLight: "#FEF4E0",
  white: "#FFFFFF",
  offWhite: "#F8FAFB",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  // FIX 1: Added missing gray300, gray400, gray500, gray600, gray800 — gray300 and gray500 were used but undefined
  gray300: "#CBD5E1",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#64748B",
  gray800: "#1E293B",
  bronze: "#CD7F32",
  silver: "#9BA4B5",
  goldTier: "#F5A623",
  platinum: "#8B5CF6",
};

const TIERS = [
  { name: "Bronze", min: 0, max: 30, color: "#CD7F32", bg: "#FFF7ED", loans: ["₹5,000 – ₹15,000", "7-day microloans"] },
  { name: "Silver", min: 30, max: 55, color: "#64748B", bg: "#F8FAFC", loans: ["₹20,000 – ₹75,000", "30-day personal loans"] },
  { name: "Gold", min: 55, max: 80, color: "#F5A623", bg: "#FFFBEB", loans: ["₹1L – ₹5L", "Business starter loans"] },
  { name: "Platinum", min: 80, max: 100, color: "#8B5CF6", bg: "#F5F3FF", loans: ["₹5L – ₹25L", "Premium credit lines"] },
];

const DATA_SOURCES = [
  { id: "upi", label: "UPI History", icon: "📱", desc: "3 years of consistent payments", points: 28 },
  { id: "rent", label: "Rent Receipts", icon: "🏠", desc: "On-time for 24 months", points: 22 },
  { id: "utility", label: "Utility Bills", icon: "⚡", desc: "Electricity & water paid", points: 18 },
  { id: "chit", label: "Chit Fund", icon: "🤝", desc: "Community savings participation", points: 20 },
  { id: "salary", label: "Salary Slips", icon: "💼", desc: "Regular monthly income", points: 12 },
];

// Max total points = 28+22+18+20+12 = 100, so scaledScore maps naturally to 0–100

const LENDER_OFFERS = [
  { name: "Navi Finance", rate: "10.5%", amount: "₹2L", tier: "Gold", logo: "N", color: "#00C9A7" },
  { name: "Stashfin", rate: "12%", amount: "₹1.5L", tier: "Silver", logo: "S", color: "#F5A623" },
  { name: "KreditBee", rate: "9.8%", amount: "₹5L", tier: "Platinum", logo: "K", color: "#8B5CF6" },
  { name: "MoneyTap", rate: "13%", amount: "₹75K", tier: "Silver", logo: "M", color: "#64748B" },
  { name: "LazyPay", rate: "11.5%", amount: "₹3L", tier: "Gold", logo: "L", color: "#CD7F32" },
];

const PAGES = ["intro", "onboard", "score", "splitview", "market"];

function GaugeChart({ score, tier }) {
  const radius = 90;
  const stroke = 14;
  const cx = 110;
  const cy = 110;
  const startAngle = -210;
  const totalAngle = 240;
  const pct = Math.min(score / 100, 1);
  const angle = startAngle + pct * totalAngle;

  function polar(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  }

  function arcPath(cx, cy, r, a1, a2) {
    const [x1, y1] = polar(cx, cy, r, a1);
    const [x2, y2] = polar(cx, cy, r, a2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const [nx, ny] = polar(cx, cy, radius - stroke / 2, angle);

  return (
    <svg viewBox="0 0 220 180" width="220" height="180">
      <path d={arcPath(cx, cy, radius, startAngle, startAngle + totalAngle)} fill="none" stroke="#E2E8F0" strokeWidth={stroke} strokeLinecap="round" />
      {score > 0 && (
        <path d={arcPath(cx, cy, radius, startAngle, angle)} fill="none" stroke={tier?.color || COLORS.teal} strokeWidth={stroke} strokeLinecap="round" style={{ transition: "all 0.8s ease" }} />
      )}
      <circle cx={nx} cy={ny} r={8} fill={tier?.color || COLORS.teal} />
      <text x={cx} y={cy + 8} textAnchor="middle" fontSize="36" fontWeight="700" fill={tier?.color || COLORS.navy}>{score}</text>
      <text x={cx} y={cy + 28} textAnchor="middle" fontSize="13" fill={COLORS.gray400}>TrustScore™</text>
      {tier && <text x={cx} y={cy + 50} textAnchor="middle" fontSize="14" fontWeight="600" fill={tier.color}>{tier.name}</text>}
    </svg>
  );
}

function TierBadge({ tier }) {
  if (!tier) return null;
  return (
    <span style={{ background: tier.bg, color: tier.color, border: `1.5px solid ${tier.color}40`, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600, letterSpacing: 0.5 }}>{tier.name}</span>
  );
}

function Page({ children, center }) {
  return (
    <div style={{ minHeight: "100vh", background: COLORS.offWhite, display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start", justifyContent: center ? "center" : "flex-start", padding: "0 0 40px" }}>
      {children}
    </div>
  );
}

function NavBar({ page, setPage }) {
  const idx = PAGES.indexOf(page);
  const labels = ["Intro", "Add Data", "TrustScore", "What Banks See", "Lenders"];
  return (
    <div style={{ width: "100%", background: COLORS.navy, padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100, boxSizing: "border-box" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, background: COLORS.teal, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: COLORS.navy, fontSize: 14 }}>K</div>
        <span style={{ color: COLORS.white, fontWeight: 700, fontSize: 18, letterSpacing: -0.5 }}>Kredify</span>
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        {labels.map((l, i) => (
          <button
            key={i}
            onClick={() => setPage(PAGES[i])}
            // FIX 2: Added hover styling via onMouseEnter/onMouseLeave for non-active nav buttons
            style={{
              background: i === idx ? COLORS.teal : "transparent",
              color: i === idx ? COLORS.navy : COLORS.gray400,
              border: "none",
              borderRadius: 6,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (i !== idx) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = COLORS.white; } }}
            onMouseLeave={e => { if (i !== idx) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = COLORS.gray400; } }}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Kredify() {
  const [page, setPage] = useState("intro");
  const [connected, setConnected] = useState([]);
  // FIX 3: Removed unused `score` state — it was declared but never read or set anywhere
  const [animScore, setAnimScore] = useState(0);
  const scoreRef = useRef(0);

  // FIX 4: Corrected scaledScore formula — previous formula was (totalScore/100)*100 which is just totalScore.
  // Since max total points across all sources = 100, totalScore IS the scaled score (0–100). Made explicit.
  const totalScore = connected.reduce((s, id) => {
    const src = DATA_SOURCES.find(d => d.id === id);
    return s + (src?.points || 0);
  }, 0);

  const scaledScore = Math.min(totalScore, 100);

  const currentTier = TIERS.slice().reverse().find(t => scaledScore >= t.min) || TIERS[0];

  useEffect(() => {
    const target = scaledScore;
    const start = scoreRef.current;
    let frame;
    let t = 0;
    const duration = 60;
    function animate() {
      t++;
      const progress = Math.min(t / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (target - start) * ease);
      setAnimScore(current);
      scoreRef.current = current;
      if (progress < 1) frame = requestAnimationFrame(animate);
    }
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [scaledScore]);

  function toggleSource(id) {
    setConnected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // FIX 5: unlockedOffers filter logic is correct (tier-rank comparison), keeping as-is.
  // locked is now computed by tier name comparison too, for clarity and correctness.
  const tierOrder = ["Bronze", "Silver", "Gold", "Platinum"];
  const unlockedOffers = LENDER_OFFERS.filter(o =>
    tierOrder.indexOf(o.tier) <= tierOrder.indexOf(currentTier.name)
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: COLORS.offWhite, minHeight: "100vh" }}>
      <NavBar page={page} setPage={setPage} />

      {page === "intro" && <IntroPage setPage={setPage} />}
      {page === "onboard" && <OnboardPage connected={connected} toggleSource={toggleSource} setPage={setPage} currentTier={currentTier} animScore={animScore} scaledScore={scaledScore} />}
      {page === "score" && <ScorePage animScore={animScore} currentTier={currentTier} connected={connected} setPage={setPage} />}
      {page === "splitview" && <SplitPage connected={connected} animScore={animScore} currentTier={currentTier} setPage={setPage} />}
      {page === "market" && <MarketPage unlockedOffers={unlockedOffers} currentTier={currentTier} animScore={animScore} setPage={setPage} />}
    </div>
  );
}

function IntroPage({ setPage }) {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 32px" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: COLORS.tealLight, color: COLORS.tealDark, borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, marginBottom: 24 }}>
          🏆 Dolphin Fund — Nexus 2026
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, color: COLORS.navy, margin: "0 0 16px", lineHeight: 1.1, letterSpacing: -1.5 }}>
          Credit for <span style={{ color: COLORS.teal }}>who you are</span>,<br />not just what's on file.
        </h1>
        <p style={{ fontSize: 18, color: COLORS.gray600, maxWidth: 540, margin: "0 auto 32px", lineHeight: 1.7 }}>
          1.4 billion people worldwide are invisible to banks — not because they can't pay, but because banks can't see their real financial story.
        </p>
        <button onClick={() => setPage("onboard")} style={{ background: COLORS.teal, color: COLORS.navy, border: "none", borderRadius: 12, padding: "16px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
          Try Kredify →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginBottom: 48 }}>
        {[
          { icon: "🙈", title: "The Problem", desc: "Banks only see loan history. They're blind to 10 years of on-time rent, UPI payments, and chit fund savings." },
          { icon: "🔐", title: "Our Solution", desc: "Kredify reads your real financial behavior — UPI, rent, utilities — and turns it into a verified TrustScore™." },
          { icon: "🚀", title: "The Privacy Magic", desc: "Zero-Knowledge Proofs let you prove you're creditworthy without ever sharing your raw transaction data." },
        ].map((c, i) => (
          <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: "28px 24px", border: `1px solid ${COLORS.gray200}` }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, fontSize: 16, color: COLORS.navy, marginBottom: 8 }}>{c.title}</div>
            <div style={{ fontSize: 14, color: COLORS.gray600, lineHeight: 1.6 }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <div style={{ background: COLORS.navy, borderRadius: 20, padding: "36px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, marginBottom: 8, letterSpacing: 1 }}>WHAT IS A ZK PROOF?</div>
          <div style={{ color: COLORS.white, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Prove it without showing it.</div>
          <div style={{ color: COLORS.gray400, fontSize: 15, maxWidth: 400, lineHeight: 1.6 }}>
            Imagine proving you have ₹1 lakh in savings without showing your bank statement. ZK proofs do exactly that — mathematically. Lenders get a "YES, this person pays on time" without ever seeing your data.
          </div>
        </div>
        <div style={{ textAlign: "center", minWidth: 140 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔒</div>
          <div style={{ color: COLORS.teal, fontWeight: 600, fontSize: 13 }}>Privacy-first credit</div>
        </div>
      </div>
    </div>
  );
}

// FIX 6: Added scaledScore prop so OnboardPage can compute accurate "points to next tier" message
function OnboardPage({ connected, toggleSource, setPage, currentTier, animScore, scaledScore }) {
  // FIX 7: "points to next tier" — previously showed (100 - animScore) which is points to MAX (100),
  // not to the next tier threshold. Now correctly computes points needed to reach next tier.
  const tierOrder = ["Bronze", "Silver", "Gold", "Platinum"];
  const currentTierIdx = tierOrder.indexOf(currentTier.name);
  const nextTier = currentTierIdx < TIERS.length - 1 ? TIERS[currentTierIdx + 1] : null;
  const pointsToNextTier = nextTier ? Math.max(nextTier.min - scaledScore, 0) : 0;

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ marginBottom: 8, color: COLORS.teal, fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>STEP 1 OF 3</div>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px" }}>Connect your financial story</h2>
      <p style={{ color: COLORS.gray600, fontSize: 15, margin: "0 0 36px" }}>Each source you add is encrypted with a ZK proof — we only extract a verified score, never your raw data.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        {DATA_SOURCES.map(src => {
          const on = connected.includes(src.id);
          return (
            <div key={src.id} onClick={() => toggleSource(src.id)} style={{ background: on ? COLORS.tealLight : COLORS.white, border: `2px solid ${on ? COLORS.teal : COLORS.gray200}`, borderRadius: 14, padding: "20px 22px", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ fontSize: 28, lineHeight: 1 }}>{src.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: on ? COLORS.tealDark : COLORS.navy, fontSize: 15, marginBottom: 4 }}>{src.label}</div>
                <div style={{ fontSize: 13, color: COLORS.gray600 }}>{src.desc}</div>
                <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600, color: COLORS.teal }}>+{src.points} score points</div>
              </div>
              <div style={{ width: 22, height: 22, borderRadius: "50%", border: `2px solid ${on ? COLORS.teal : COLORS.gray300}`, background: on ? COLORS.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {on && <span style={{ color: COLORS.navy, fontSize: 12, fontWeight: 800 }}>✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: COLORS.white, borderRadius: 16, border: `1px solid ${COLORS.gray200}`, padding: "24px 28px", display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
        <div>
          <GaugeChart score={animScore} tier={currentTier} />
        </div>
        <div>
          <div style={{ fontSize: 13, color: COLORS.gray400, marginBottom: 4 }}>Current tier</div>
          <TierBadge tier={currentTier} />
          <div style={{ marginTop: 12, fontSize: 13, color: COLORS.gray600 }}>
            {connected.length === 0
              ? "Connect at least one source to generate your TrustScore™"
              : nextTier
                // FIX 7 continued: show actual points to next tier, not (100 - score)
                ? `${connected.length} source${connected.length > 1 ? "s" : ""} connected — ${pointsToNextTier} points to ${nextTier.name}`
                : `${connected.length} source${connected.length > 1 ? "s" : ""} connected — You've reached Platinum! 🎉`
            }
          </div>
          {connected.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.gray400, marginBottom: 6 }}>Score progress</div>
              <div style={{ background: COLORS.gray100, borderRadius: 8, height: 8, width: 220 }}>
                <div style={{ background: currentTier.color, borderRadius: 8, height: 8, width: `${animScore}%`, transition: "width 0.6s ease" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setPage("score")} disabled={connected.length === 0} style={{ background: connected.length > 0 ? COLORS.teal : COLORS.gray200, color: connected.length > 0 ? COLORS.navy : COLORS.gray400, border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: connected.length > 0 ? "pointer" : "not-allowed" }}>
        Generate my TrustScore™ →
      </button>
    </div>
  );
}

function ScorePage({ animScore, currentTier, connected, setPage }) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ marginBottom: 8, color: COLORS.teal, fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>STEP 2 OF 3</div>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px" }}>Your TrustScore™ is ready</h2>
      <p style={{ color: COLORS.gray600, marginBottom: 36, fontSize: 15 }}>Verified using Zero-Knowledge cryptography. No raw data was shared with Kredify.</p>

      <div style={{ background: COLORS.white, borderRadius: 20, border: `1px solid ${COLORS.gray200}`, padding: "36px", textAlign: "center", marginBottom: 28 }}>
        <GaugeChart score={animScore} tier={currentTier} />
        <div style={{ marginTop: 8, marginBottom: 20 }}>
          <TierBadge tier={currentTier} />
        </div>
        <div style={{ background: COLORS.tealLight, borderRadius: 12, padding: "16px 24px", display: "inline-block", marginBottom: 20 }}>
          <div style={{ fontSize: 13, color: COLORS.tealDark, fontWeight: 600 }}>🔒 ZK-Verified Certificate Generated</div>
          <div style={{ fontSize: 12, color: COLORS.gray600, marginTop: 4 }}>Hash: 0x7f3a...c9e2 · {new Date().toLocaleDateString()}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { label: "Sources verified", value: connected.length },
            { label: "Data exposed", value: "0%" },
            { label: "Tier unlocked", value: currentTier.name },
          ].map((s, i) => (
            <div key={i} style={{ background: COLORS.gray100, borderRadius: 10, padding: "14px 12px" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.navy }}>{s.value}</div>
              {/* FIX 8: Was using COLORS.gray500 (undefined) — now uses defined COLORS.gray500 */}
              <div style={{ fontSize: 12, color: COLORS.gray500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 12, fontSize: 15 }}>Score tier breakdown</div>
        <div style={{ display: "flex", gap: 0, borderRadius: 10, overflow: "hidden", border: `1px solid ${COLORS.gray200}` }}>
          {TIERS.map((t, i) => (
            <div key={i} style={{ flex: 1, background: t.name === currentTier.name ? t.bg : COLORS.white, borderRight: i < 3 ? `1px solid ${COLORS.gray200}` : "none", padding: "14px 8px", textAlign: "center" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.name}</div>
              <div style={{ fontSize: 11, color: COLORS.gray400 }}>{t.min}–{t.max}</div>
              {t.name === currentTier.name && <div style={{ fontSize: 10, color: t.color, marginTop: 4 }}>● You are here</div>}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setPage("splitview")} style={{ background: COLORS.teal, color: COLORS.navy, border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        See what lenders see →
      </button>
    </div>
  );
}

function SplitPage({ connected, animScore, currentTier, setPage }) {
  const sources = DATA_SOURCES.filter(d => connected.includes(d.id));

  // FIX 9: Guard against empty state — if no sources connected, prompt user to go back
  if (sources.length === 0) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔗</div>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: COLORS.navy, marginBottom: 12 }}>No sources connected yet</h2>
        <p style={{ color: COLORS.gray600, marginBottom: 24 }}>Go back and connect at least one financial source to see the privacy comparison.</p>
        <button onClick={() => setPage("onboard")} style={{ background: COLORS.teal, color: COLORS.navy, border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          ← Connect sources
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 32px" }}>
      <div style={{ marginBottom: 8, color: COLORS.teal, fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>STEP 3 OF 3</div>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px" }}>Privacy in action</h2>
      <p style={{ color: COLORS.gray600, marginBottom: 36, fontSize: 15 }}>Here's the difference between what you have and what banks actually see.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: COLORS.white, borderRadius: 16, border: `2px solid #FCA5A5`, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444" }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: "#991B1B" }}>Raw data — your private view</span>
          </div>
          {sources.map((s, i) => (
            <div key={i} style={{ marginBottom: 14, background: "#FFF7F7", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#991B1B", marginBottom: 4 }}>{s.icon} {s.label}</div>
              <div style={{ fontFamily: "monospace", fontSize: 11, color: COLORS.gray600, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {s.id === "upi" && "UPI: ₹4,200 → Reliance Jio · Apr 18\nUPI: ₹12,500 → LIC Premium · Apr 15\nUPI: ₹800 → Zomato · Apr 13\n...842 more transactions"}
                {s.id === "rent" && "Landlord: Ramesh Gupta\nA-204, Shyam Nagar, Jaipur\nRent: ₹9,500/month\nLast paid: May 1 via NEFT"}
                {s.id === "utility" && "Account: JVVNL-00238471\nBill: ₹1,240 · March 2026\nBill: ₹1,180 · Feb 2026\n24 months uninterrupted"}
                {s.id === "chit" && "Chit Group: Sri Mahalaxmi\nMonthly: ₹2,000 · 18/24 paid\nOrganizer: Mrs. Kamala Devi\nGroup size: 12 members"}
                {s.id === "salary" && "Employer: TechSoft Pvt Ltd\nSalary: ₹42,000/month\nAccount: ****3847\n36 months employed"}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: COLORS.white, borderRadius: 16, border: `2px solid ${COLORS.teal}`, padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS.teal }} />
            <span style={{ fontWeight: 700, fontSize: 14, color: COLORS.tealDark }}>ZK-Certificate — what lenders see</span>
          </div>
          <div style={{ background: COLORS.tealLight, borderRadius: 12, padding: "20px", marginBottom: 16, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: COLORS.tealDark, fontWeight: 600, letterSpacing: 1, marginBottom: 8 }}>KREDIFY TRUST CERTIFICATE</div>
            <GaugeChart score={animScore} tier={currentTier} />
            <TierBadge tier={currentTier} />
          </div>
          <div style={{ fontSize: 13, color: COLORS.gray600, marginBottom: 12, fontWeight: 600 }}>Verified attributes:</div>
          {sources.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10, background: COLORS.gray100, borderRadius: 8, padding: "10px 12px" }}>
              <span style={{ color: COLORS.teal, fontWeight: 700 }}>✓</span>
              <span style={{ fontSize: 13, color: COLORS.navy }}>{s.label} — <span style={{ color: COLORS.tealDark }}>verified, on-time</span></span>
            </div>
          ))}
          <div style={{ marginTop: 16, background: COLORS.navy, borderRadius: 8, padding: "12px 14px" }}>
            {/* FIX 10: Was using broken string interpolation inside JSX text node.
                "{score: [REDACTED → {animScore}]}".replace("{animScore}", animScore) 
                This renders literally as a static string — the replace never ran on the JSX string.
                Now using proper JSX expression interpolation instead. */}
            <div style={{ fontFamily: "monospace", fontSize: 10, color: COLORS.teal, lineHeight: 1.8 }}>
              {"zkProof: 0x7f3a...c9e2"}<br />
              {"issuer: Kredify Protocol v2"}<br />
              {`score: [REDACTED → ${animScore}]`}<br />
              {"expires: 2026-08-25"}<br />
              {"raw_data_exposed: false"}
            </div>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button onClick={() => setPage("market")} style={{ background: COLORS.teal, color: COLORS.navy, border: "none", borderRadius: 10, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          See loan offers unlocked →
        </button>
      </div>
    </div>
  );
}

function MarketPage({ unlockedOffers, currentTier, animScore, setPage }) {
  // FIX 11: Was using reference inequality (!unlockedOffers.includes(o)) to compute locked offers.
  // While this works because both arrays pull from the same LENDER_OFFERS reference,
  // it's fragile and semantically wrong. Filter by tier rank instead for correctness.
  const tierOrder = ["Bronze", "Silver", "Gold", "Platinum"];
  const locked = LENDER_OFFERS.filter(o =>
    tierOrder.indexOf(o.tier) > tierOrder.indexOf(currentTier.name)
  );

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 32px" }}>
      <h2 style={{ fontSize: 32, fontWeight: 800, color: COLORS.navy, margin: "0 0 8px" }}>Your loan marketplace</h2>
      <p style={{ color: COLORS.gray600, marginBottom: 8, fontSize: 15 }}>Lenders compete for you based on your TrustScore™ — no raw data shared.</p>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <TierBadge tier={currentTier} />
        <span style={{ color: COLORS.gray600, fontSize: 14 }}>· Score {animScore}/100 · {unlockedOffers.length} offers unlocked</span>
      </div>

      {unlockedOffers.length > 0 && (
        <>
          {/* FIX 12: Was using COLORS.gray500 (undefined) — now defined */}
          <div style={{ fontWeight: 700, color: COLORS.navy, marginBottom: 12, fontSize: 15 }}>✅ Offers unlocked for you</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
            {unlockedOffers.map((o, i) => (
              <div key={i} style={{ background: COLORS.white, borderRadius: 14, border: `1.5px solid ${COLORS.teal}`, padding: "22px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: o.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: o.color, fontSize: 16 }}>{o.logo}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 15 }}>{o.name}</div>
                    {/* FIX 13: Was using COLORS.gray500 (undefined) — now defined */}
                    <div style={{ fontSize: 12, color: COLORS.gray500 }}>Requires: {o.tier} tier</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.navy }}>{o.amount}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>Max loan</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.tealDark }}>{o.rate}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>Interest rate</div>
                  </div>
                </div>
                <button style={{ width: "100%", background: COLORS.teal, color: COLORS.navy, border: "none", borderRadius: 8, padding: "10px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Apply now</button>
              </div>
            ))}
          </div>
        </>
      )}

      {locked.length > 0 && (
        <>
          {/* FIX 14: Was using COLORS.gray500 (undefined) — now defined */}
          <div style={{ fontWeight: 700, color: COLORS.gray500, marginBottom: 12, fontSize: 15 }}>🔒 Unlock by improving your score</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {locked.map((o, i) => (
              <div key={i} style={{ background: COLORS.gray100, borderRadius: 14, border: `1px dashed ${COLORS.gray300}`, padding: "22px 20px", opacity: 0.6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: COLORS.gray200, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: COLORS.gray400, fontSize: 16 }}>🔒</div>
                  <div>
                    <div style={{ fontWeight: 700, color: COLORS.gray500, fontSize: 15 }}>{o.name}</div>
                    <div style={{ fontSize: 12, color: COLORS.gray400 }}>Requires: {o.tier} tier</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.gray400 }}>{o.amount}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>Max loan</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: COLORS.gray400 }}>{o.rate}</div>
                    <div style={{ fontSize: 11, color: COLORS.gray400 }}>Interest rate</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginTop: 40, background: COLORS.navy, borderRadius: 16, padding: "28px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ color: COLORS.teal, fontWeight: 700, fontSize: 13, marginBottom: 6 }}>NEXUS 2026 — DOLPHIN FUND PITCH</div>
          <div style={{ color: COLORS.white, fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Kredify: Financial inclusion for 1.4 billion</div>
          <div style={{ color: COLORS.gray400, fontSize: 13 }}>ZK-verified alternative credit scoring · Rising Youth Network</div>
        </div>
        <button onClick={() => setPage("intro")} style={{ background: COLORS.teal, color: COLORS.navy, border: "none", borderRadius: 10, padding: "12px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
          Restart demo
        </button>
      </div>
    </div>
  );
}
