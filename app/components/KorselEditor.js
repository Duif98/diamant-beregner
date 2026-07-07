"use client";

import { useState } from "react";
import { useStore } from "./Store";
import { korselCalc, buildKorselItem, fmt } from "../lib/calc";

export default function KorselEditor({ onCommit }) {
  const { st, toast } = useStore();
  const [km, setKm] = useState("");
  const [flash, setFlash] = useState(false);
  const n = parseFloat(km) || 0;
  const c = korselCalc(n, st);

  const commit = () => {
    const item = buildKorselItem(n, st);
    if (!item) { alert("Indtast antal km."); return; }
    onCommit([item]);
    setFlash(true); setTimeout(() => setFlash(false), 2500);
    toast("✓ Kørsel tilføjet");
  };

  return (
    <>
      <div className="g2">
        <div className="field"><label>Samlet kørsel (km)</label><input type="number" placeholder="0" min="0" value={km} onChange={(e) => setKm(e.target.value)} /></div>
        <div className="field"><label>Beregnet pris</label><input type="text" readOnly placeholder="—" value={n > 0 ? `${fmt(c.price)} kr` : ""} /></div>
      </div>
      {n > 25 && (
        <div className="row-hint" style={{ marginTop: 7 }}>
          Fast (0–25 km): {c.fast} kr + {c.over} km × {c.extra} kr = {fmt(Math.round(c.over * c.extra))} kr
        </div>
      )}
      {flash && <div className="flash">✓ Kørsel tilføjet til tilbud</div>}
      <button className="btn btn-primary" onClick={commit}>+ Føj kørsel til tilbud</button>
    </>
  );
}
