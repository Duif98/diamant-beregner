"use client";

import { useStore } from "../Store";
import QuoteSummary from "../QuoteSummary";
import { J } from "../../lib/calc";
import { Printer, Save, Trash } from "../icons";

export default function TilbudPage() {
  const { items, rabat, setRabat, rmItem, customer, setCustomer, saveTilbudToHistory, clearItems, print } = useStore();

  const printQuote = () => {
    saveTilbudToHistory();
    print({ customer: { ...customer }, items: J(items), rabat: J(rabat) });
  };

  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Tilbudsoversigt</div>
        <QuoteSummary items={items} rabat={rabat} setRabat={setRabat} onRmItem={rmItem} />
      </div>

      <div className="card no-print">
        <div className="card-title">Kundeoplysninger</div>
        <div className="field"><label>Kundenavn / Firma</label><input type="text" placeholder="Navn eller firmanavn" value={customer.kunde} onChange={(e) => setCustomer({ kunde: e.target.value })} /></div>
        <div className="field"><label>Adresse</label><input type="text" placeholder="Vej, by" value={customer.adresse} onChange={(e) => setCustomer({ adresse: e.target.value })} /></div>
        <div className="g2">
          <div className="field"><label>Tilbudsnummer</label><input type="text" placeholder="fx 2024-001" value={customer.nr} onChange={(e) => setCustomer({ nr: e.target.value })} /></div>
          <div className="field"><label>Dato</label><input type="date" value={customer.dato} onChange={(e) => setCustomer({ dato: e.target.value })} /></div>
        </div>
        <div className="field"><label>Betalingsfrist (dage)</label><input type="number" value={customer.frist} onChange={(e) => setCustomer({ frist: e.target.value })} /></div>
      </div>

      <div className="no-print">
        <button className="btn btn-success" onClick={printQuote} disabled={!items.length}><Printer size={17} /> Print / Gem tilbud som PDF</button>
        <button className="btn btn-ghost" onClick={saveTilbudToHistory} disabled={!items.length}><Save size={16} /> Gem tilbud i historik</button>
        <button className="btn btn-danger" onClick={() => { if (confirm("Ryd tilbud?")) clearItems(); }} disabled={!items.length}><Trash size={16} /> Ryd tilbud</button>
      </div>
    </div>
  );
}
