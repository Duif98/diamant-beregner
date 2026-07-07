"use client";

import { useState } from "react";
import { useStore } from "./Store";
import { tidLines, buildTidItems, fmt } from "../lib/calc";

const EMPTY = { diaNormal: "", diaOver: "", normNormal: "", normOver: "" };

export default function TidEditor({ onCommit }) {
  const { st, toast } = useStore();
  const [v, setV] = useState(EMPTY);
  const [flash, setFlash] = useState(false);
  const upd = (k, val) => setV((p) => ({ ...p, [k]: val }));
  const { lines, tot } = tidLines(v, st);

  const commit = () => {
    const items = buildTidItems(v, st);
    if (!items) { alert("Indtast mindst 0,5 times arbejdstid."); return; }
    onCommit(items);
    setFlash(true); setTimeout(() => setFlash(false), 2500);
    toast("✓ Tid tilføjet");
  };

  return (
    <>
      <div className="section-label">Inkl. diamantværktøj</div>
      <div className="g2">
        <div className="field"><label>Normaltid (timer)</label><input type="number" placeholder="0" min="0" step="0.5" value={v.diaNormal} onChange={(e) => upd("diaNormal", e.target.value)} /></div>
        <div className="field"><label>Overtid (timer)</label><input type="number" placeholder="0" min="0" step="0.5" value={v.diaOver} onChange={(e) => upd("diaOver", e.target.value)} /></div>
      </div>
      <div className="sep" />
      <div className="section-label">Uden diamantværktøj</div>
      <div className="g2">
        <div className="field"><label>Normaltid (timer)</label><input type="number" placeholder="0" min="0" step="0.5" value={v.normNormal} onChange={(e) => upd("normNormal", e.target.value)} /></div>
        <div className="field"><label>Overtid (timer)</label><input type="number" placeholder="0" min="0" step="0.5" value={v.normOver} onChange={(e) => upd("normOver", e.target.value)} /></div>
      </div>
      {lines.length > 0 && (
        <div className="calc-box">
          {lines.map((l, i) => (
            <div key={i}>{l.label} = <span className="hl">{fmt(l.v)} kr</span></div>
          ))}
          <div className="total-line">Total: {fmt(tot)} kr</div>
        </div>
      )}
      {flash && <div className="flash">✓ Tid tilføjet til tilbud</div>}
      <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={commit}>+ Føj tid til tilbud</button>
    </>
  );
}
