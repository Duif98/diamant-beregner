"use client";

import BoringEditor from "../BoringEditor";
import { useStore } from "../Store";
import { Info } from "../icons";

export default function BoringPage() {
  const { addItems } = useStore();
  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Kerneboring</div>
        <BoringEditor onCommit={addItems} />
      </div>
      <div className="infobox"><Info size={16} /> Minimum fakturering: 20 cm dybde pr. boring. Pris = dybde (cm) × kr/cm.</div>
    </div>
  );
}
