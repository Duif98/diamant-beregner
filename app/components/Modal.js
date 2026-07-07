"use client";

import { useState } from "react";
import { useStore } from "./Store";
import QuoteSummary from "./QuoteSummary";
import BoringEditor from "./BoringEditor";
import SkaeringEditor from "./SkaeringEditor";
import TidEditor from "./TidEditor";
import KorselEditor from "./KorselEditor";
import { J, calcRabatKr, buildTotals, fmt } from "../lib/calc";
import { X, Printer, Save } from "./icons";

const SUBTABS = [
  { id: "view", label: "📄 Tilbud" },
  { id: "boring", label: "Boring" },
  { id: "skaering", label: "Skæring" },
  { id: "tid", label: "Tid & Kørsel" },
];

export default function Modal({ idx, onClose }) {
  const { history, st, updateHistory, print } = useStore();
  const entry = history[idx];
  const [sub, setSub] = useState("view");
  const [mItems, setMItems] = useState(() => J(entry.items));
  const [mRabat, setMRabat] = useState(() => ({
    pct: entry.pct || 0,
    scope: entry.scope || "all",
    types: entry.rabatTypes ? J(entry.rabatTypes) : { boring: true, t: true, tid: true, km: true },
  }));
  const [cust, setCust] = useState({
    kunde: entry.kunde || "", adresse: entry.adr || "", nr: entry.nr || "", dato: entry.datoval || "", frist: entry.frist || "14",
  });

  const setRabat = (p) => setMRabat((prev) => ({ ...prev, ...p }));
  const setCustomer = (p) => setCust((prev) => ({ ...prev, ...p }));
  const addToItems = (items) => { setMItems((prev) => [...prev, ...items]); setSub("view"); };

  const buildEntry = () => {
    const rabatKr = calcRabatKr(mItems, mRabat.pct, mRabat.scope, mRabat.types);
    const { sub: subv, sg, tex, moms, grand } = buildTotals(mItems, rabatKr, st);
    return {
      ...entry,
      kunde: cust.kunde || entry.kunde,
      adr: cust.adresse || "",
      nr: cust.nr || "—",
      datoval: cust.dato || "",
      frist: cust.frist || "14",
      items: J(mItems),
      pct: mRabat.pct, scope: mRabat.scope, rabatTypes: J(mRabat.types),
      sub: subv, sg, tex, moms, grand, rabatKr,
      lines: mItems.map((it) => it.desc + (it.qty > 1 ? ` (${it.qty} stk)` : "") + ` – ${fmt(it.total)} kr`),
      dato: entry.dato,
    };
  };

  const save = () => updateHistory(idx, buildEntry());
  const savePrint = () => { updateHistory(idx, buildEntry()); print({ customer: { ...cust }, items: J(mItems), rabat: J(mRabat) }); };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Redigér tilbud – {entry.kunde}</div>
          <button className="icon-x" onClick={onClose} aria-label="Luk"><X size={17} /></button>
        </div>
        <div className="modal-tabs">
          {SUBTABS.map((t) => (
            <button key={t.id} className={`modal-tab${sub === t.id ? " active" : ""}`} onClick={() => setSub(t.id)}>{t.label}</button>
          ))}
        </div>
        <div className="modal-body">
          {sub === "view" && (
            <>
              <QuoteSummary items={mItems} rabat={mRabat} setRabat={setRabat} onRmItem={(i) => setMItems((p) => p.filter((_, j) => j !== i))} />
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <div className="section-label">Kundeoplysninger</div>
                <div className="field"><label>Kundenavn / Firma</label><input type="text" value={cust.kunde} onChange={(e) => setCustomer({ kunde: e.target.value })} /></div>
                <div className="field"><label>Adresse</label><input type="text" value={cust.adresse} onChange={(e) => setCustomer({ adresse: e.target.value })} /></div>
                <div className="g2">
                  <div className="field"><label>Tilbudsnummer</label><input type="text" value={cust.nr} onChange={(e) => setCustomer({ nr: e.target.value })} /></div>
                  <div className="field"><label>Dato</label><input type="date" value={cust.dato} onChange={(e) => setCustomer({ dato: e.target.value })} /></div>
                </div>
                <div className="field"><label>Betalingsfrist (dage)</label><input type="number" value={cust.frist} onChange={(e) => setCustomer({ frist: e.target.value })} /></div>
              </div>
            </>
          )}
          {sub === "boring" && <BoringEditor onCommit={addToItems} />}
          {sub === "skaering" && <SkaeringEditor onCommit={addToItems} />}
          {sub === "tid" && (
            <>
              <div className="section-label" style={{ marginTop: 0 }}>Arbejdstid</div>
              <TidEditor onCommit={addToItems} />
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                <div className="section-label" style={{ marginTop: 0 }}>Kørsel</div>
                <KorselEditor onCommit={addToItems} />
              </div>
            </>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-success" onClick={savePrint}><Printer size={16} /> Gem & Print PDF</button>
          <button className="btn btn-ghost" onClick={save}><Save size={15} /> Gem ændringer</button>
          <button className="btn btn-danger" onClick={onClose}>Luk</button>
        </div>
      </div>
    </div>
  );
}
