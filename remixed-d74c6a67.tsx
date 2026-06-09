import { useState, useEffect, useRef } from "react";

const LEADS = [
  {
    id: "infineon", score: 94, tier: "hot", name: "Infineon Technologies",
    flag: "PRIOR HTEC DEAL", flagType: "prior",
    vertical: "Industrial & power semis", rev: "€16.3B FY24",
    contact: "Lukas Strobel", contactRole: "Director · IoT Edge",
    booth: { hall: "9", num: "B12" },
    angle: "You signed a deal here in 2023 — Lukas knows HTEC. His former PM Daniel Chen is still in your network. Lead with the AURIX MCU firmware gap; he's mid-platform-decision and needs delivery capacity by Q3.",
    angleSrc: "Q1 earnings + HubSpot deal #2301",
    tip: "Lukas's team often grabs coffee at Café Black Bean before the floor opens. If you happen to be there around 08:45, you're more likely to bump into him without the booth crowd.",
    tipSrc: "Google Maps reviews + LinkedIn · 18 Apr",
    connections: [
      { name: "Daniel Chen", rel: "Former PM on HTEC deal #2301 — still in your LinkedIn network", type: "direct" },
      { name: "Prof. Klaus Müller", rel: "TU Munich — co-authored a paper with Lukas on AURIX edge cases, spoke at your Embedded World panel in 2024", type: "academic" },
      { name: "Carla Rossi (STMicro)", rel: "Lukas's ex-colleague at Infineon Automotive — now at STMicro. Could open a two-deal corridor", type: "lateral" },
    ],
    category: "specialty"
  },
  {
    id: "bosch", score: 91, tier: "hot", name: "Bosch Sensortec",
    vertical: "MEMS & environmental sensors", rev: "€91.6B (parent)",
    contact: "Stefan Finkbeiner", contactRole: "CEO",
    booth: { hall: "8", num: "D24" },
    angle: "Finkbeiner is under pressure to cut time-to-integration for new sensor families — that's your wedge. Frame HTEC as the bridge between BST's sensor API and customer firmware stacks. He prefers direct openers; skip the small talk.",
    angleSrc: "BST press release · Mar 2026",
    tip: "Stefan tagged Marko Jovanović (your ex-colleague from the Lyte Fiber engagement) in a LinkedIn post about sensor fusion last week. Marko commented back. You have a warm intro sitting right there — message Marko before the floor opens.",
    tipSrc: "LinkedIn activity · 14 Apr 2026",
    connections: [
      { name: "Marko Jovanović", rel: "Your ex-colleague from Lyte Fiber — Stefan tagged him in a LinkedIn post last week about sensor fusion", type: "direct" },
      { name: "Anika Bauer (Siemens)", rel: "Co-chairs IEC TC47 sensor standards with Stefan — she's also at Hannover, Hall 9", type: "industry" },
    ],
    category: "mems"
  },
  {
    id: "stmicro", score: 88, tier: "hot", name: "STMicroelectronics",
    flag: "SiC PUSH", flagType: "signal",
    vertical: "Silicon-carbide power", rev: "€17.3B FY24",
    contact: "Anna Kowalski", contactRole: "VP · Power & Discrete",
    booth: { hall: "11", num: "A05" },
    angle: "Anna committed €3B capex to SiC publicly and needs 200mm process-control software she doesn't have in-house. Your yield engineering team is the fastest path to compliance. This is a Q3 close if you move now.",
    angleSrc: "ST Capital Markets Day · Feb 2026",
    connections: [
      { name: "Carla Rossi", rel: "Anna's direct report — previously at Infineon with Lukas Strobel. Cross-reference your Infineon conversation", type: "lateral" },
      { name: "Dr. Yuki Tanaka (Applied Materials)", rel: "Supplies ST's SiC deposition tools — could validate your process-control pitch if approached at the SEMI meetup Tuesday night", type: "vendor" },
    ],
    category: "power"
  },
  {
    id: "elmos", score: 86, tier: "hot", name: "Elmos Semiconductor",
    vertical: "Automotive ICs · 130nm specialty", rev: "€580M FY24",
    contact: "Jan-Dirk Lueders", contactRole: "CTO",
    booth: { hall: "7", num: "C18" },
    angle: 'Jan-Dirk used the phrase "software-defined fabs" in public in February — that\'s your opener verbatim. Their 130nm MES is aging and he knows it. You\'re not pitching a product; you\'re finishing his sentence.',
    angleSrc: "SemiEngineering · Feb 2026",
    connections: [
      { name: "Ralf Schneider (ex-Elmos)", rel: "Left Elmos last year, now consulting — you met him at the Belgrade Tech Summit. Knows Jan-Dirk's priorities cold", type: "insider" },
    ],
    category: "specialty"
  },
  {
    id: "nxp", score: 85, tier: "hot", name: "NXP Semiconductors",
    vertical: "Automotive & edge processing", rev: "€13.3B FY24",
    contact: "Lisa van der Berg", contactRole: "SVP · Edge Processing",
    booth: { hall: "9", num: "A30" },
    angle: "NXP is consolidating edge processing software partners after the Freescale legacy cleanup. Lisa is actively benchmarking delivery partners for their S32 automotive platform. Your embedded systems team maps directly to this.",
    angleSrc: "NXP Investor Day · Mar 2026",
    connections: [
      { name: "Hiroshi Tanaka (Renesas)", rel: "Lisa and Hiroshi co-presented at Embedded World 2025 — if you mention the cross-platform abstraction layer, she'll know you did your homework", type: "industry" },
    ],
    category: "power"
  },
  {
    id: "soitec", score: 84, tier: "warm", name: "Soitec",
    vertical: "SOI & engineered substrates", rev: "€1.10B FY24",
    contact: "Marie Lacroix", contactRole: "VP · Engineering",
    booth: { hall: "11", num: "B33" },
    angle: "New Bernin SiC fab scaling fast — engineering headcount is the stated bottleneck. Marie is actively vetting embedded services partners for process ramp. Get there early, she's usually done by 14:00.",
    angleSrc: "Soitec H1 results · Jan 2026",
    category: "power"
  },
  {
    id: "renesas", score: 79, tier: "warm", name: "Renesas Electronics",
    vertical: "Embedded MCUs · industrial", rev: "€13.4B FY24",
    contact: "Hiroshi Tanaka", contactRole: "GM · Industrial BU",
    booth: { hall: "9", num: "D08" },
    angle: "Industrial BU reorganized in January — Hiroshi is defining the new partner ecosystem before Q2 budget locks. Early conversations now avoid a 12-month vendor-selection freeze later.",
    angleSrc: "Renesas org announcement · Jan 2026",
    tip: "Hiroshi's team shared their Hannover dinner reservation at Brauhaus Ernst August on LinkedIn — good for a follow-up drink after Day 1 closes at 18:00.",
    tipSrc: "LinkedIn post · Renesas Industrial · 17 Apr",
    category: "specialty"
  },
  {
    id: "aixtron", score: 76, tier: "warm", name: "Aixtron",
    flag: "CFO RECENT", flagType: "signal",
    vertical: "Compound-semi deposition tools", rev: "€630M FY24",
    contact: "Christoph Petry", contactRole: "CRO",
    booth: { hall: "6", num: "F11" },
    angle: "New CFO is driving margin improvement through services revenue — Christoph is building the commercial model. Potentially a partner opportunity (resell / co-delivery) rather than a straight prospect.",
    angleSrc: "Aixtron AGM · Apr 2026",
    category: "eda"
  },
  {
    id: "murata", score: 71, tier: "warm", name: "Murata Manufacturing",
    vertical: "Passives & RF components", rev: "€13.8B FY24",
    contact: "Sebastian Vogel", contactRole: "BD Mgr · EU Industrial",
    booth: { hall: "12", num: "A22" },
    angle: "Sebastian is building Murata's EU industrial BD function from scratch — lower urgency but a relationship worth starting now. Receptive to long-game conversations, runs a clean discovery process.",
    angleSrc: "LinkedIn · role posted Jan 2026",
    category: "mems"
  },
  {
    id: "kontron", score: 68, tier: "cool", name: "Kontron AG",
    vertical: "Industrial PCs & embedded modules", rev: "€1.5B FY24",
    contact: "Petra Becker", contactRole: "Head of Strategic Partners",
    booth: { hall: "5", num: "E07" },
    angle: "ICP fit is weak — no active modernization signal. Worth a 5-min floor pass only if already in Hall 5. Don't prioritise over Day 1 targets.",
    angleSrc: "Clay enrichment · no signal",
    category: "specialty"
  },
];

const CONN_ICONS = { direct: "🤝", academic: "🎓", lateral: "↔️", industry: "🏭", vendor: "🔧", insider: "🔑" };

function ScoreChip({ score, tier }) {
  const bg = tier === "hot" ? "#059669" : tier === "warm" ? "#FBBF24" : "#E5E7EB";
  const fg = tier === "cool" ? "#6B7280" : "#fff";
  return (
    <div style={{ width: 48, height: 48, borderRadius: 10, background: bg, color: fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 19, fontFamily: "monospace", flexShrink: 0 }}>
      {score}
    </div>
  );
}

function ConnectionsSection({ connections }) {
  if (!connections || connections.length === 0) return null;
  return (
    <div style={{ marginTop: 10, padding: "11px 14px", background: "#FFF7ED", borderLeft: "2px solid #F59E0B", borderRadius: "0 6px 6px 0" }}>
      <div style={{ fontFamily: "monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#D97706", marginBottom: 8 }}>Network overlaps</div>
      {connections.map((c, i) => (
        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: i < connections.length - 1 ? 6 : 0, fontSize: 13, lineHeight: 1.5 }}>
          <span style={{ flexShrink: 0 }}>{CONN_ICONS[c.type] || "👤"}</span>
          <span><strong style={{ color: "#1c1c1c" }}>{c.name}</strong> <span style={{ color: "#6B7280" }}>— {c.rel}</span></span>
        </div>
      ))}
    </div>
  );
}

function VoiceNoteButton({ lead, notes, onSave }) {
  const [mode, setMode] = useState("idle");
  const [text, setText] = useState(notes || "");
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === "recording") {
      setSeconds(0);
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    } else { clearInterval(timerRef.current); }
    return () => clearInterval(timerRef.current);
  }, [mode]);

  if (mode === "idle" && !text) {
    return (
      <button onClick={(e) => { e.stopPropagation(); setMode("recording"); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 500, padding: "6px 12px", borderRadius: 999, background: "#1c1c1c", color: "#7EFFC6", border: "none", cursor: "pointer", fontFamily: "inherit", marginTop: 10 }}>
        🎙 Log conversation
      </button>
    );
  }

  if (mode === "recording") {
    return (
      <div onClick={e => e.stopPropagation()} style={{ marginTop: 10, padding: 14, background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#EF4444", animation: "pulse 1.2s infinite" }} />
          <span style={{ fontFamily: "monospace", fontSize: 12, color: "#EF4444", fontWeight: 600 }}>Recording · {seconds}s</span>
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder='e.g. "Lukas confirmed AURIX gap, intro to Maria Chen by Friday, est. €600K"' style={{ width: "100%", minHeight: 60, padding: 10, border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 13, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button onClick={() => { onSave(lead.id, text); setMode("saved"); }} style={{ padding: "6px 14px", borderRadius: 999, background: "#059669", color: "#fff", border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Save to HubSpot →</button>
          <button onClick={() => { setMode("idle"); setText(""); }} style={{ padding: "6px 14px", borderRadius: 999, background: "transparent", border: "1px solid #E5E7EB", cursor: "pointer", fontSize: 12, color: "#6B7280" }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={e => e.stopPropagation()} style={{ marginTop: 10, padding: "10px 14px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span style={{ color: "#059669", fontSize: 14 }}>✓</span>
        <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#059669" }}>Logged to HubSpot</span>
      </div>
      <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5, fontStyle: "italic" }}>"{text}"</p>
      <button onClick={() => setMode("recording")} style={{ marginTop: 6, fontSize: 11, color: "#6B7280", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}>Edit note</button>
    </div>
  );
}

function LeadRow({ lead, selected, onToggle, conversationNotes, onSaveNote, forceConnectionsOpen }) {
  const [connOpen, setConnOpen] = useState(forceConnectionsOpen);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 48px 1fr auto", alignItems: "start", gap: 18, padding: "18px 24px", borderBottom: "1px solid #F3F4F6", cursor: "pointer", background: selected ? "#F0FDF4" : "transparent", position: "relative", borderLeft: selected ? "3px solid #059669" : "3px solid transparent", transition: "background 100ms ease" }}
      onClick={() => onToggle(lead.id)}>

      {/* Walk plan button — left side */}
      <button onClick={e => { e.stopPropagation(); onToggle(lead.id); }} style={{ width: "auto", height: 36, borderRadius: 999, background: selected ? "#059669" : "transparent", border: selected ? "1px solid #059669" : "1px solid #E5E7EB", color: selected ? "#fff" : "#6B7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, fontWeight: 500, flexShrink: 0, transition: "all 120ms ease", padding: "0 12px", fontFamily: "inherit", whiteSpace: "nowrap", marginTop: 6 }}>
        {selected ? "✓ On plan" : "+ Walk plan"}
      </button>

      <ScoreChip score={lead.score} tier={lead.tier} />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#1c1c1c" }}>{lead.name}</h3>
          {lead.flag && (
            <span style={{ fontSize: 9.5, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", background: lead.flagType === "prior" ? "#7EFFC6" : "#1c1c1c", color: lead.flagType === "prior" ? "#1c1c1c" : "#7EFFC6", padding: "2px 7px", borderRadius: 3, fontWeight: 600 }}>{lead.flag}</span>
          )}
        </div>

        <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.4, display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
          <span style={{ color: "#1c1c1c", fontWeight: 500 }}>{lead.vertical}</span>
          <span style={{ color: "#D1D5DB" }}>·</span>
          <span style={{ fontFamily: "monospace", fontSize: 12 }}>{lead.rev}</span>
          <span style={{ color: "#D1D5DB" }}>·</span>
          <span><strong style={{ color: "#1c1c1c" }}>{lead.contact}</strong>, {lead.contactRole}</span>
        </div>

        {/* Angle — full width, source below */}
        <div style={{ marginTop: 12, padding: "11px 14px", background: "#F9FAFB", borderRadius: 6 }}>
          <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "#374151", fontWeight: 500, display: "block" }}>{lead.angle}</span>
          <span style={{ display: "inline-block", marginTop: 8, fontFamily: "monospace", fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF", background: "#fff", border: "1px solid #E5E7EB", padding: "3px 8px", borderRadius: 4 }}>{lead.angleSrc}</span>
        </div>

        {/* Pro tip — label first, source at bottom */}
        {lead.tip && (
          <div style={{ marginTop: 10, padding: "11px 14px", background: "rgba(126,255,198,0.10)", borderLeft: "2px solid #7EFFC6", borderRadius: "0 6px 6px 0" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9.5, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "#059669", marginBottom: 6 }}>Pro tip</div>
            <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{lead.tip}</p>
            <div style={{ marginTop: 6, fontFamily: "monospace", fontSize: 10.5, color: "#9CA3AF", letterSpacing: "0.04em" }}>Source: {lead.tipSrc}</div>
          </div>
        )}

        {/* Network overlaps */}
        {lead.connections && lead.connections.length > 0 && (
          <div style={{ marginTop: 6 }}>
            {!forceConnectionsOpen && (
              <button onClick={e => { e.stopPropagation(); setConnOpen(!connOpen); }} style={{ fontSize: 12, fontWeight: 500, color: "#D97706", background: "none", border: "none", cursor: "pointer", padding: "4px 0", fontFamily: "inherit" }}>
                {connOpen ? "▾" : "▸"} {lead.connections.length} network overlap{lead.connections.length > 1 ? "s" : ""}
              </button>
            )}
            {(forceConnectionsOpen || connOpen) && <ConnectionsSection connections={lead.connections} />}
          </div>
        )}

        {selected && <VoiceNoteButton lead={lead} notes={conversationNotes[lead.id]} onSave={onSaveNote} />}
      </div>

      {/* Booth tag */}
      <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.08em", color: "#1c1c1c", background: "#F9FAFB", border: "1px solid #E5E7EB", padding: "6px 10px", borderRadius: 4, textTransform: "uppercase", whiteSpace: "nowrap", display: "inline-flex", alignItems: "center", gap: 8, marginTop: 6 }}>
        <span style={{ color: "#9CA3AF" }}>HALL</span>
        <span>{lead.booth.hall} · {lead.booth.num}</span>
      </div>
    </div>
  );
}

export default function App() {
  const [selectedIds, setSelectedIds] = useState(new Set(["infineon", "bosch", "stmicro", "elmos", "nxp"]));
  const [toast, setToast] = useState(null);
  const [showFullList, setShowFullList] = useState(false);
  const [emailDrafting, setEmailDrafting] = useState(false);
  const [conversationNotes, setConversationNotes] = useState({});
  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2600);
  };

  const toggle = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      const lead = LEADS.find(l => l.id === id);
      if (next.has(id)) { next.delete(id); showToast(`Removed ${lead.name}`); }
      else { next.add(id); showToast(`Added ${lead.name} to walk plan`); }
      return next;
    });
  };

  const saveNote = (id, text) => {
    setConversationNotes(prev => ({ ...prev, [id]: text }));
    const lead = LEADS.find(l => l.id === id);
    showToast(`Conversation logged for ${lead.name}`);
  };

  const hot = LEADS.filter(l => l.tier === "hot");
  const warm = LEADS.filter(l => l.tier === "warm");
  const cool = LEADS.filter(l => l.tier === "cool");
  const selectedList = LEADS.filter(l => selectedIds.has(l.id));
  const hallCount = new Set(selectedList.map(s => s.booth.hall)).size;
  const estHours = (selectedList.length * 0.7).toFixed(1);

  const visibleWarm = showFullList ? warm : warm.slice(0, 4);
  const visibleCool = showFullList ? cool : cool.slice(0, 1);
  const totalShown = hot.length + visibleWarm.length + visibleCool.length;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: "#F9FAFB", minHeight: "100vh", color: "#1c1c1c" }}>

      {/* Chrome */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: "#1c1c1c", borderBottom: "1px solid #374151", padding: "14px 32px", display: "flex", alignItems: "center", gap: 20 }}>
        <span style={{ fontWeight: 700, color: "#fff", fontSize: 14, letterSpacing: "0.06em" }}>HTEC</span>
        <span style={{ width: 1, height: 18, background: "#4B5563" }} />
        <span style={{ fontFamily: "monospace", fontSize: 11.5, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "#9CA3AF" }}>
          Sales OS <span style={{ color: "#4B5563" }}>/</span> Agents <span style={{ color: "#4B5563" }}>/</span> <span style={{ color: "#fff" }}>Conference scanner</span>
        </span>
        <span style={{ flex: 1 }} />
        <div style={{ width: 32, height: 32, borderRadius: 999, background: "linear-gradient(135deg, #34786A, #449A88)", color: "#1c1c1c", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>LV</div>
      </div>

      <main style={{ maxWidth: 1120, margin: "0 auto", padding: "32px 32px 160px" }}>

        {/* Eyebrow */}
        <div style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 6, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#1c1c1c", border: "1px solid #1c1c1c", background: "#7EFFC6", padding: "3px 8px", borderRadius: 3, fontWeight: 600 }}>Agent · Conference scanner</span>
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF", marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
          <span>Scan <b style={{ color: "#6B7280" }}>#117</b></span> <span style={{ color: "#D1D5DB" }}>·</span>
          <span>Source: <b style={{ color: "#6B7280" }}>hannovermesse.de</b></span> <span style={{ color: "#D1D5DB" }}>·</span>
          <span>Scraped <b style={{ color: "#6B7280" }}>12 Apr 16:08 CET</b></span> <span style={{ color: "#D1D5DB" }}>·</span>
          <span>ICP: <b style={{ color: "#6B7280" }}>Specialty semis · €100M+ yearly revenue</b></span>
        </div>

        {/* Title */}
        <h1 style={{ fontSize: 44, fontWeight: 600, lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 28px" }}>
          <span style={{ background: "#7EFFC6", padding: "0 8px 2px", borderRadius: 3 }}>Hannover Messe 2026</span> — Top ICP matches
        </h1>

        {/* ============ WALK PLAN SECTION ============ */}
        <section style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 28, marginBottom: 32 }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "#059669", marginBottom: 10 }}>Your walk plan</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 600, lineHeight: 1.3 }}>Welcome to your Hannover Messe 2026 walk plan!</h2>
          <p style={{ margin: "0 0 20px", fontSize: 15, color: "#6B7280", lineHeight: 1.6, maxWidth: 800 }}>
            Your Day 1 route covers <strong style={{ color: "#1c1c1c" }}>{selectedList.length} companies</strong> across <strong style={{ color: "#1c1c1c" }}>{hallCount} halls</strong>, with an estimated <strong style={{ color: "#1c1c1c" }}>~{estHours}h</strong> of booth time including transit. Combined pipeline potential: <strong style={{ color: "#059669" }}>€1.8M–3.2M ARR</strong>. Several leads frequent the same pre-show spots — check the Pro tip sections for early-morning positioning opportunities.
          </p>

          {/* Walk plan companies */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {selectedList.map(s => (
              <span key={s.id} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 12px", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
                <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#059669" }}>{s.score}</span>
                {s.name}
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#9CA3AF" }}>H{s.booth.hall}</span>
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={() => { setEmailDrafting(!emailDrafting); if (!emailDrafting) showToast("Generating outreach drafts…"); }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 8, background: "#1c1c1c", color: "#7EFFC6", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
              Draft intro emails
            </button>
          </div>

          {/* Email drafting panel */}
          {emailDrafting && (
            <div style={{ marginTop: 20, background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Pre-conference outreach — {hot.length} Hot leads</h3>
                <button onClick={() => setEmailDrafting(false)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6B7280", padding: "4px 8px" }}>×</button>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>Each email includes a calendar slot, a fallback "I'll drop by your booth" plan, and the ICP angle baked in. The walk plan becomes your fallback for anyone who doesn't reply.</p>
              {hot.map((l, i) => (
                <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#fff", borderRadius: 8, marginBottom: 6, border: "1px solid #E5E7EB" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, color: "#0284C7", width: 20 }}>{i + 1}.</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>
                    {l.contact} <span style={{ color: "#9CA3AF", fontWeight: 400 }}>at {l.name}</span>
                  </span>
                  <button style={{ padding: "4px 12px", borderRadius: 999, background: "#0284C7", color: "#fff", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600 }}>Preview</button>
                </div>
              ))}
              <button style={{ marginTop: 10, padding: "8px 18px", borderRadius: 8, background: "#0284C7", color: "#fff", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600 }} onClick={() => showToast("5 drafts created in Outlook")}>
                Draft all emails in Outlook →
              </button>
            </div>
          )}
        </section>

        {/* Stats row */}
        <div style={{ display: "flex", border: "1px solid #E5E7EB", borderRadius: 8, overflow: "hidden", background: "#fff", width: "fit-content", marginBottom: 28 }}>
          {[
            { k: "Hot · 85+", v: hot.length, accent: true },
            { k: "Warm · 70–84", v: warm.length },
            { k: "On walk plan", v: selectedList.length, accent: true },
            { k: "Avg score", v: "78" },
            { k: "Event dates", v: "20–24 Apr", small: true },
          ].map((s, i) => (
            <div key={i} style={{ padding: "14px 24px", borderRight: i < 4 ? "1px solid #E5E7EB" : "none", display: "flex", flexDirection: "column", gap: 5, minWidth: 100 }}>
              <span style={{ fontFamily: "monospace", fontSize: 9.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9CA3AF" }}>{s.k}</span>
              <span style={{ fontSize: s.small ? 14 : 28, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em", color: s.accent ? "#059669" : "#1c1c1c", fontFamily: s.small ? "monospace" : "inherit" }}>{s.v}</span>
            </div>
          ))}
        </div>

        {/* List transparency */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11.5, color: "#9CA3AF", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Showing <b style={{ color: "#1c1c1c" }}>top {totalShown} of 86</b> by score
          </span>
          <button onClick={() => setShowFullList(!showFullList)} style={{ fontFamily: "monospace", fontSize: 11, color: "#0284C7", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            {showFullList ? "Show curated top 10 ↑" : "View full list →"}
          </button>
        </div>

        {/* Lead list */}
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>

          {/* HOT */}
          <div style={{ padding: "10px 24px 8px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", fontFamily: "monospace", fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9CA3AF", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, background: "#059669", color: "#fff", padding: "2px 7px", borderRadius: 999 }}>Hot · 85+</span>
            Walk these first — pre-qualified conversations
          </div>
          {hot.map(l => <LeadRow key={l.id} lead={l} selected={selectedIds.has(l.id)} onToggle={toggle} conversationNotes={conversationNotes} onSaveNote={saveNote} forceConnectionsOpen={true} />)}

          {/* WARM */}
          <div style={{ padding: "10px 24px 8px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", fontFamily: "monospace", fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9CA3AF", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, background: "#FBBF24", color: "#1c1c1c", padding: "2px 7px", borderRadius: 999 }}>Warm · 70–84</span>
            Worth a swing if time permits
          </div>
          {visibleWarm.map(l => <LeadRow key={l.id} lead={l} selected={selectedIds.has(l.id)} onToggle={toggle} conversationNotes={conversationNotes} onSaveNote={saveNote} forceConnectionsOpen={false} />)}

          {/* COOL */}
          <div style={{ padding: "10px 24px 8px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB", fontFamily: "monospace", fontSize: 10.5, fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase", color: "#9CA3AF", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 10, background: "#E5E7EB", color: "#6B7280", padding: "2px 7px", borderRadius: 999 }}>Below threshold · &lt;70</span>
            Skip unless intent signals change
          </div>
          {visibleCool.map(l => <LeadRow key={l.id} lead={l} selected={selectedIds.has(l.id)} onToggle={toggle} conversationNotes={conversationNotes} onSaveNote={saveNote} forceConnectionsOpen={false} />)}

          {!showFullList && (
            <div style={{ padding: "16px 24px", background: "#F9FAFB", textAlign: "center" }}>
              <button onClick={() => setShowFullList(true)} style={{ fontSize: 13, fontWeight: 500, color: "#0284C7", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>
                Show remaining {86 - totalShown} companies → <span style={{ fontFamily: "monospace", fontSize: 11, color: "#9CA3AF" }}>What did you cut?</span>
              </button>
            </div>
          )}
        </div>

        {/* Footnote */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #E5E7EB", display: "flex", gap: 24, fontFamily: "monospace", fontSize: 11, letterSpacing: "0.04em", color: "#9CA3AF", lineHeight: 1.7, flexWrap: "wrap" }}>
          <div style={{ flex: 1, textTransform: "uppercase", letterSpacing: "0.08em", minWidth: 300 }}>
            <b style={{ color: "#6B7280" }}>Sources</b> · hannovermesse.de exhibitor list · Apollo · Clay enrichment · LinkedIn · Crunchbase · SEC EDGAR · 10-Q filings
          </div>
          <div style={{ textAlign: "right", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Last refreshed <b style={{ color: "#059669" }}>16:08 CET</b> · regenerates daily until 18 Apr<br />
            Walk plan auto-files to HubSpot deals on save
          </div>
        </div>

        {/* Sticky walk plan bar */}
        <div style={{ position: "sticky", bottom: 16, marginTop: 24, background: "#1c1c1c", color: "#fff", borderRadius: 12, padding: "16px 20px 16px 24px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center", boxShadow: "0 12px 32px rgba(0,0,0,0.16)", zIndex: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, borderRight: "1px solid #4B5563", paddingRight: 24 }}>
            <span style={{ fontSize: 32, fontWeight: 600, lineHeight: 1, color: "#7EFFC6" }}>{selectedList.length}</span>
            <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9CA3AF" }}>on walk plan</span>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>
              Day 1 — <b style={{ color: "#7EFFC6" }}>~{estHours}h</b> · {hallCount} halls
            </div>
            <div style={{ fontFamily: "monospace", fontSize: 11.5, color: "#9CA3AF", marginTop: 2 }}>
              {selectedList.slice(0, 5).map(s => s.name).join(" · ")}{selectedList.length > 5 ? ` +${selectedList.length - 5} more` : ""}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => showToast("Exported walk plan to HubSpot")} style={{ padding: "10px 18px", borderRadius: 999, background: "transparent", color: "#9CA3AF", border: "1px solid #4B5563", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>Export to HubSpot</button>
            <button onClick={() => showToast("Generating optimized hall route…")} style={{ padding: "10px 18px", borderRadius: 999, background: "#7EFFC6", color: "#1c1c1c", border: "1px solid #7EFFC6", cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit" }}>Generate route →</button>
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", left: "50%", bottom: 100, transform: "translateX(-50%)", background: "#1c1c1c", color: "#7EFFC6", fontSize: 13, fontWeight: 500, padding: "12px 20px", borderRadius: 999, boxShadow: "0 12px 32px rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 16, height: 16, borderRadius: 999, background: "#7EFFC6", color: "#1c1c1c", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>✓</span>
          {toast}
        </div>
      )}

      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}
