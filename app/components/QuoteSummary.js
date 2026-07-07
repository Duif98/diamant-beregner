"use client";

import { useStore } from "./Store";
import { RAB_TYPES, calcRabatKr, buildTotals, fmt } from "../lib/calc";
import { Doc, X } from "./icons";

export default function QuoteSummary({ items, rabat, setRabat, onRmItem }) {
  const { st } = useStore();

  if (!items.length)
    return (
      <div className="inv-empty">
        <div className="ico"><Doc size={40} /></div>
        <div style={{ fontSize: ".9rem", fontWeight: 500 }}>Ingen ydelser tilføjet endnu</div>
      </div>
    );

  const pct = rabat.pct || 0;
  const scope = rabat.scope;
  const types = rabat.types;
  const rabatKr = calcRabatKr(items, pct, scope, types);
  const { sub, sg, tex, moms, grand } = buildTotals(items, rabatKr, st);

  const setScope = (val) => {
    if (val === "custom") setRabat({ scope: "custom" });
    else setRabat({ scope: "all", types: { boring: true, t: true, tid: true, km: true } });
  };
  const toggleType = (k) => setRabat({ types: { ...types, [k]: !types[k] } });

  return (
    <>
      <div>
        {items.map((it, i) => {
          const applies = (scope === "all" || types[it.type]) && pct > 0;
          const disc = applies ? Math.round(it.total * pct / 100) : 0;
          return (
            <div className="inv-item" key={i}>
              <div className="inv-desc">
                {it.desc}
                {it.qty > 1 && <small>{it.qty} stk × {fmt(it.unitPrice)} kr</small>}
              </div>
              <div className="inv-right">
                {applies ? (
                  <><span className="inv-price struck">{fmt(it.total)} kr</span><span className="inv-price-disc">{fmt(it.total - disc)} kr</span></>
                ) : (
                  <span className="inv-price">{fmt(it.total)} kr</span>
                )}
                <button className="rm-btn no-print" onClick={() => onRmItem(i)} aria-label="Fjern"><X size={15} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="no-print">
        <div className="sep" />
        <div className="section-label">Rabat</div>
        <div className="g2">
          <div className="field"><label>Rabat (%)</label>
            <input type="number" placeholder="0" min="0" max="100" step="0.5" value={rabat.pct || ""} onChange={(e) => setRabat({ pct: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="field"><label>Gælder for</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="all">Hele tilbuddet</option>
              <option value="custom">Vælg selv...</option>
            </select>
          </div>
        </div>
        {scope === "custom" && (
          <>
            <div className="section-label">Rabat gælder for</div>
            <div className="pill-wrap">
              {Object.entries(RAB_TYPES).map(([k, lbl]) => (
                <button key={k} type="button" className={`pill violet${types[k] ? " on" : ""}`} onClick={() => toggleType(k)}>
                  <span className="dot" />{lbl}
                </button>
              ))}
            </div>
          </>
        )}
        {rabatKr > 0 && (
          <div className="rabat-box" style={{ marginTop: 10 }}>
            <div className="lbl">Rabatfordeling</div>
            {Object.entries(RAB_TYPES).map(([k, lbl]) => {
              const app = scope === "all" || types[k];
              const kSum = items.filter((x) => x.type === k).reduce((s, x) => s + x.total, 0);
              if (!kSum) return null;
              return <div className="rabat-row" key={k}><span>{lbl}</span><span>{app ? "− " + fmt(Math.round(kSum * pct / 100)) + " kr" : "Ingen rabat"}</span></div>;
            })}
          </div>
        )}
      </div>

      <div className="totals-box">
        <div className="tot-row"><span>Subtotal ydelser</span><span>{fmt(sub)} kr</span></div>
        {rabatKr > 0 && (
          <div className="tot-row discount"><span>Rabat {pct}%{scope === "custom" ? " (udvalgte)" : ""}</span><span>− {fmt(rabatKr)} kr</span></div>
        )}
        {sg > 0 && <div className="tot-row"><span>Startgebyr</span><span>{fmt(sg)} kr</span></div>}
        <div className="tot-row main"><span>I alt ex. moms</span><span>{fmt(tex)} kr</span></div>
        <div className="tot-row"><span>Moms 25%</span><span>{fmt(moms)} kr</span></div>
      </div>
      <div className="grand-box"><div className="lbl">Total inkl. moms</div><div className="val">{fmt(grand)} kr</div></div>
    </>
  );
}
