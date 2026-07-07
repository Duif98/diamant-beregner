"use client";

import { useState } from "react";
import Pills from "./Pills";
import { useStore } from "./Store";
import { skRowPrice, buildSkaeringItems, fmt } from "../lib/calc";
import { Plus, X } from "./icons";

const TILLAEG = [
  { key: "vaegsaw", label: "Vægsav" },
  { key: "gulvsav", label: "Gulvsav" },
  { key: "ringsav", label: "Ring & Kapsav" },
];

export default function SkaeringEditor({ onCommit, buttonLabel = "+ Føj skæring til tilbud" }) {
  const { st, toast } = useStore();
  const [rows, setRows] = useState([{ type: "flad", meter: "", depth: "", qty: 1 }]);
  const [cb, setCb] = useState({ vaegsaw: false, gulvsav: false, ringsav: false });
  const [flash, setFlash] = useState(false);

  const upd = (i, patch) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const addRow = () => setRows((r) => [...r, { type: "flad", meter: "", depth: "", qty: 1 }]);
  const rmRow = (i) => setRows((r) => (r.length === 1 ? [{ type: "flad", meter: "", depth: "", qty: 1 }] : r.filter((_, j) => j !== i)));

  const subtotal = rows.reduce((s, r) => { const p = skRowPrice(r, st); return p ? s + p.total : s; }, 0);

  const commit = () => {
    const { items, count } = buildSkaeringItems(rows, { b: {}, s: cb }, st);
    if (!count) { alert("Udfyld mindst én linje."); return; }
    onCommit(items);
    setFlash(true); setTimeout(() => setFlash(false), 2500);
    toast("✓ Skæring tilføjet");
  };

  return (
    <>
      <div className="section-label">Tillæg</div>
      <Pills defs={TILLAEG} value={cb} onToggle={(k) => setCb((c) => ({ ...c, [k]: !c[k] }))} />
      <div className="sep" />
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Type</th><th>Meter</th><th>Dybde (cm)</th><th>Antal</th><th style={{ textAlign: "right" }}>Total</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const p = skRowPrice(r, st);
              return (
                <tr key={i}>
                  <td>
                    <select value={r.type} onChange={(e) => upd(i, { type: e.target.value })}>
                      <option value="flad">Ring & Kapsav</option>
                      <option value="vaeg">Vægskæring</option>
                      <option value="gulv">Gulvskæring</option>
                    </select>
                  </td>
                  <td><input type="number" placeholder="m" step="0.1" value={r.meter} onChange={(e) => upd(i, { meter: e.target.value })} /></td>
                  <td>
                    <input type="number" placeholder="cm" min="1" value={r.depth} onChange={(e) => upd(i, { depth: e.target.value })} />
                    {p && <div className="row-hint">{fmt(p.area)} cm²</div>}
                  </td>
                  <td><input type="number" min="1" style={{ maxWidth: 54 }} value={r.qty} onChange={(e) => upd(i, { qty: parseInt(e.target.value) || 1 })} /></td>
                  <td className="td-price">{p ? fmt(p.total) + " kr" : "—"}</td>
                  <td><button className="rm-btn" onClick={() => rmRow(i)} aria-label="Fjern"><X size={15} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="btn-add" onClick={addRow}><Plus size={15} /> Tilføj linje</button>
      <div className="subtotal-bar"><span className="subtotal-label">Subtotal skæring</span><span className="subtotal-amount">{subtotal > 0 ? fmt(subtotal) + " kr" : "0 kr"}</span></div>
      {flash && <div className="flash">✓ Skæring tilføjet til tilbud</div>}
      <button className="btn btn-primary" onClick={commit}>{buttonLabel}</button>
    </>
  );
}
