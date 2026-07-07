"use client";

import { useState } from "react";
import { useStore } from "../Store";
import { fmt } from "../../lib/calc";
import { Search, History, Edit, Trash } from "../icons";

const SI = {
  accepted: { cls: "accepted", label: "✓ Accepteret" },
  rejected: { cls: "rejected", label: "✗ Afvist" },
  pending: { cls: "pending", label: "⏳ Afventer" },
};

export default function HistorikPage({ onEdit }) {
  const { history, setStatus, deleteHistory, clearHistory } = useStore();
  const [q, setQ] = useState("");
  const query = q.toLowerCase().trim();

  const filtered = history
    .map((e, idx) => ({ e, idx }))
    .filter(({ e }) => !query || e.kunde.toLowerCase().includes(query) || e.nr.toLowerCase().includes(query));

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Opgavehistorik</div>
        <div className="hist-search" style={{ marginBottom: 12 }}>
          <span className="ico"><Search size={16} /></span>
          <input type="text" placeholder="Søg på kundenavn eller tilbudsnummer..." value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {filtered.length === 0 ? (
          <div className="hist-empty">
            <History size={40} />
            <div style={{ fontSize: ".9rem", fontWeight: 500 }}>{query ? `Ingen resultater for "${q}"` : "Ingen gemte tilbud endnu"}</div>
            {!query && <div style={{ fontSize: ".78rem", color: "var(--ink-3)" }}>Gem et tilbud fra Tilbud-fanen</div>}
          </div>
        ) : (
          filtered.map(({ e, idx }) => {
            const s = e.status || "pending";
            return (
              <div className={`hist-item s-${s}`} key={e.id ?? idx}>
                <div className="hist-top">
                  <div className="hist-name">{e.kunde}</div>
                  <div className="hist-date">{e.dato} · Nr. {e.nr}</div>
                </div>
                <div className="hist-lines">
                  {e.lines.slice(0, 3).map((l, i) => <div key={i}>{l}</div>)}
                  {e.lines.length > 3 && <div style={{ color: "var(--ink-3)" }}>+{e.lines.length - 3} flere...</div>}
                </div>
                <div className="hist-mid">
                  <div className="hist-total">{fmt(e.grand)} kr inkl. moms{e.pct > 0 ? ` (inkl. ${e.pct}% rabat)` : ""}</div>
                  <span className={`status-badge ${SI[s].cls}`}>{SI[s].label}</span>
                </div>
                <div className="status-btns">
                  <button className={`status-btn accept${s === "accepted" ? " active" : ""}`} onClick={() => setStatus(idx, "accepted")}>✓ Accepteret</button>
                  <button className={`status-btn pending${s === "pending" ? " active" : ""}`} onClick={() => setStatus(idx, "pending")}>⏳ Afventer</button>
                  <button className={`status-btn reject${s === "rejected" ? " active" : ""}`} onClick={() => setStatus(idx, "rejected")}>✗ Afvist</button>
                </div>
                <div className="hist-actions">
                  <button className="hist-btn view" onClick={() => onEdit(idx)}><Edit size={15} /> Redigér / Print</button>
                  <button className="hist-btn del" onClick={() => { if (confirm("Slet dette tilbud?")) deleteHistory(idx); }}><Trash size={15} /> Slet</button>
                </div>
              </div>
            );
          })
        )}
      </div>
      {history.length > 0 && (
        <button className="btn btn-danger" onClick={() => { if (confirm("Slet al historik?")) clearHistory(); }} style={{ marginBottom: 20 }}><Trash size={16} /> Ryd al historik</button>
      )}
    </div>
  );
}
