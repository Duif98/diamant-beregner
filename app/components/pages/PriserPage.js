"use client";

import { useEffect, useRef, useState } from "react";
import { useStore } from "../Store";
import { diaLabel } from "../../lib/calc";
import { Plus, X } from "../icons";

// Number input that keeps the typed string locally (so decimals work) while
// committing the parsed value to the store. Re-syncs only on external change.
function NumInput({ value, onCommit, ...props }) {
  const [s, setS] = useState(value == null ? "" : String(value));
  const last = useRef(value);
  useEffect(() => {
    if (value !== last.current) { setS(value == null ? "" : String(value)); last.current = value; }
  }, [value]);
  return (
    <input type="number" value={s} onChange={(e) => { setS(e.target.value); const n = parseFloat(e.target.value) || 0; last.current = n; onCommit(n); }} {...props} />
  );
}

export default function PriserPage() {
  const { bd, st, saveSettings, setDiaRate, addDia, rmDia, resetAll } = useStore();
  const [nd, setNd] = useState("");
  const [nr, setNr] = useState("");
  const set = (k) => (v) => saveSettings({ [k]: v });

  const doAdd = () => {
    const dia = parseFloat(nd), rate = parseFloat(nr);
    if (!dia || !rate) { alert("Angiv diameter og kr/cm."); return; }
    if (addDia(dia, rate)) { setNd(""); setNr(""); }
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Boring – Prisliste (kr/cm)</div>
        <div className="bor-head"><span>Diameter</span><span>Kr/cm</span><span /></div>
        {bd.map((b, i) => (
          <div className="bor-row" key={b.dia}>
            <span className="dia">{diaLabel(b)}</span>
            <NumInput value={b.rate} min="0" step="0.25" onCommit={(v) => setDiaRate(i, v)} />
            <button className="rm-btn" onClick={() => { if (confirm(`Fjern ${diaLabel(b)}?`)) rmDia(i); }} aria-label="Fjern"><X size={15} /></button>
          </div>
        ))}
        <div className="sep" />
        <div className="section-label">Tilføj nyt bor</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "flex-end" }}>
          <div className="field"><label>Diameter (mm)</label><input type="number" placeholder="fx 175" min="1" value={nd} onChange={(e) => setNd(e.target.value)} /></div>
          <div className="field"><label>Kr/cm</label><input type="number" placeholder="fx 35" step="0.25" value={nr} onChange={(e) => setNr(e.target.value)} /></div>
          <button className="btn-sm" onClick={doAdd}><Plus size={15} /> Tilføj</button>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Skæring – kr/cm²</div>
        <div className="g3">
          <div className="field"><label>Ring & Kapsav</label><NumInput value={st.pFlad} step="0.01" onCommit={set("pFlad")} /></div>
          <div className="field"><label>Vægskæring</label><NumInput value={st.pVaeg} step="0.01" onCommit={set("pVaeg")} /></div>
          <div className="field"><label>Gulvskæring</label><NumInput value={st.pGulv} step="0.01" onCommit={set("pGulv")} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Timepriser</div>
        <div className="g2">
          <div className="field"><label>Inkl. diamantværktøj (kr/t)</label><NumInput value={st.pDiaNormal} step="10" onCommit={set("pDiaNormal")} /></div>
          <div className="field"><label>Uden diamantværktøj (kr/t)</label><NumInput value={st.pNormNormal} step="10" onCommit={set("pNormNormal")} /></div>
        </div>
        <div style={{ maxWidth: "48%" }}><div className="field"><label>Overtidstillæg (kr/t, oven i)</label><NumInput value={st.pOver} step="10" onCommit={set("pOver")} /></div></div>
      </div>

      <div className="card">
        <div className="card-title">Kørsel</div>
        <div className="g2">
          <div className="field"><label>Fast pris 0–25 km (kr)</label><NumInput value={st.pKmFast} step="25" onCommit={set("pKmFast")} /></div>
          <div className="field"><label>Kr/km over 25 km</label><NumInput value={st.pKmExtra} step="0.5" onCommit={set("pKmExtra")} /></div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Gebyrer & Oprigningstillæg</div>
        <div className="field"><label>Startgebyr (kr ex. moms)</label><NumInput value={st.pStart} onCommit={set("pStart")} /></div>
        <div className="sep" />
        <div className="section-label">Oprigningstillæg – pr. gang</div>
        <div className="g3">
          <div className="field"><label>Boregrej</label><NumInput value={st.pBoregrej} onCommit={set("pBoregrej")} /></div>
          <div className="field"><label>Vægsav</label><NumInput value={st.pVaegsaw} onCommit={set("pVaegsaw")} /></div>
          <div className="field"><label>Gulvsav</label><NumInput value={st.pGulvsav} onCommit={set("pGulvsav")} /></div>
        </div>
        <div className="g2" style={{ marginTop: 8 }}>
          <div className="field"><label>Ring & Kapsav (boring)</label><NumInput value={st.pOprigB} onCommit={set("pOprigB")} /></div>
          <div className="field"><label>Ring & Kapsav (skæring)</label><NumInput value={st.pOprigS} onCommit={set("pOprigS")} /></div>
        </div>
      </div>

      <button className="btn btn-ghost" onClick={() => { if (confirm("Nulstil alle priser?")) resetAll(); }} style={{ marginBottom: 20 }}>↺ Nulstil alle priser til standard</button>
    </div>
  );
}
