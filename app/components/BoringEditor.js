"use client";

import { useState } from "react";
import Pills from "./Pills";
import { useStore } from "./Store";
import { diaLabel, borRowPrice, buildBoringItems, fmt } from "../lib/calc";
import { Plus, X } from "./icons";

const TILLAEG = [
  { key: "boregrej", label: "Boregrej" },
  { key: "ringsav", label: "Ring & Kapsav" },
  { key: "skra", label: "Skråboring", tag: "+25%" },
  { key: "underop", label: "Under-op boring", tag: "+100%" },
];

export default function BoringEditor({ onCommit, buttonLabel = "+ Føj boringer til tilbud" }) {
  const { bd, st, toast } = useStore();
  const [rows, setRows] = useState([{ dia: "0-92", depthRaw: "", qty: 1 }]);
  const [cb, setCb] = useState({ boregrej: false, ringsav: false, skra: false, underop: false });
  const [flash, setFlash] = useState(false);

  const cbWrap = { b: cb, s: {} };
  const upd = (i, patch) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));
  const addRow = () => setRows((r) => [...r, { dia: bd[0].dia, depthRaw: "", qty: 1 }]);
  const rmRow = (i) => setRows((r) => (r.length === 1 ? [{ dia: bd[0].dia, depthRaw: "", qty: 1 }] : r.filter((_, j) => j !== i)));

  const subtotal = rows.reduce((s, r) => { const p = borRowPrice(r, cbWrap, bd); return p ? s + p.total : s; }, 0);

  const commit = () => {
    const { items, count } = buildBoringItems(rows, cbWrap, st, bd);
    if (!count) { alert("Udfyld mindst én linje."); return; }
    onCommit(items);
    setFlash(true); setTimeout(() => setFlash(false), 2500);
    toast("✓ Boringer tilføjet");
  };

  return (
    <>
      <div className="section-label">Tillæg</div>
      <Pills defs={TILLAEG} value={cb} onToggle={(k) => setCb((c) => ({ ...c, [k]: !c[k] }))} />
      <div className="sep" />
      <div className="tbl-wrap">
        <table>
          <thead>
            <tr><th>Diameter</th><th>Dybde (cm)</th><th>Antal</th><th style={{ textAlign: "right" }}>Enhedspris</th><th style={{ textAlign: "right" }}>Total</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const p = borRowPrice(r, cbWrap, bd);
              return (
                <tr key={i}>
                  <td>
                    <select value={r.dia} onChange={(e) => upd(i, { dia: e.target.value })}>
                      {bd.map((b) => <option key={b.dia} value={b.dia}>{diaLabel(b)}</option>)}
                      <option value="custom">Anden størrelse...</option>
                    </select>
                    {r.dia === "custom" && (
                      <input type="number" placeholder="mm" value={r.customDia || ""} style={{ marginTop: 4 }} onChange={(e) => upd(i, { customDia: parseFloat(e.target.value) || 0 })} />
                    )}
                  </td>
                  <td>
                    <input type="number" placeholder="cm" min="1" value={r.depthRaw} onChange={(e) => upd(i, { depthRaw: e.target.value })} />
                    {p && <div className="row-hint">{p.billDepth}cm{p.min ? " (min)" : ""} × {p.rate.toFixed(2)} kr</div>}
                  </td>
                  <td><input type="number" min="1" style={{ maxWidth: 60 }} value={r.qty} onChange={(e) => upd(i, { qty: parseInt(e.target.value) || 1 })} /></td>
                  <td className="td-price">{p ? fmt(p.price) + " kr" : "—"}</td>
                  <td className="td-price">{p ? fmt(p.total) + " kr" : "—"}</td>
                  <td><button className="rm-btn" onClick={() => rmRow(i)} aria-label="Fjern"><X size={15} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button className="btn-add" onClick={addRow}><Plus size={15} /> Tilføj linje</button>
      <div className="subtotal-bar"><span className="subtotal-label">Subtotal boring</span><span className="subtotal-amount">{subtotal > 0 ? fmt(subtotal) + " kr" : "0 kr"}</span></div>
      {flash && <div className="flash">✓ Boringer tilføjet til tilbud</div>}
      <button className="btn btn-primary" onClick={commit}>{buttonLabel}</button>
    </>
  );
}
