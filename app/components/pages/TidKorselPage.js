"use client";

import TidEditor from "../TidEditor";
import KorselEditor from "../KorselEditor";
import { useStore } from "../Store";

export default function TidKorselPage() {
  const { addItems } = useStore();
  return (
    <div className="page">
      <div className="card">
        <div className="card-title">Arbejdstid</div>
        <TidEditor onCommit={addItems} />
      </div>
      <div className="card">
        <div className="card-title">Kørsel</div>
        <KorselEditor onCommit={addItems} />
      </div>
    </div>
  );
}
