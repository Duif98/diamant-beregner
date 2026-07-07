"use client";

import SkaeringEditor from "../SkaeringEditor";
import { useStore } from "../Store";

export default function SkaeringPage() {
  const { addItems } = useStore();
  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Diamantskæring</div>
        <SkaeringEditor onCommit={addItems} />
      </div>
    </div>
  );
}
