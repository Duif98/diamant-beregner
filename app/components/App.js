"use client";

import { useState } from "react";
import { useStore } from "./Store";
import BoringPage from "./pages/BoringPage";
import SkaeringPage from "./pages/SkaeringPage";
import TidKorselPage from "./pages/TidKorselPage";
import TilbudPage from "./pages/TilbudPage";
import PriserPage from "./pages/PriserPage";
import HistorikPage from "./pages/HistorikPage";
import Modal from "./Modal";
import Toast from "./Toast";
import PrintView from "./PrintView";
import { Drill, Blade, Clock, Doc, Sliders, History, Diamond } from "./icons";

const TABS = [
  { id: "boring", label: "Boring", Icon: Drill },
  { id: "skaering", label: "Skæring", Icon: Blade },
  { id: "tid", label: "Tid & Kørsel", Icon: Clock },
  { id: "tilbud", label: "Tilbud", Icon: Doc, badge: "items" },
  { id: "priser", label: "Priser", Icon: Sliders },
  { id: "historik", label: "Historik", Icon: History, badge: "history" },
];

export default function App() {
  const { items, history } = useStore();
  const [tab, setTab] = useState("boring");
  const [modalIdx, setModalIdx] = useState(null);

  const counts = { items: items.length, history: history.length };

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="header-left">
            <div className="header-logo"><Diamond size={22} /></div>
            <div>
              <div className="header-title">Diamant<b>Pro</b></div>
              <div className="header-sub">Boring &amp; Skæring · Prisberegner</div>
            </div>
          </div>
          <div className="header-badge">PRO</div>
        </div>
      </header>

      <nav className="tab-bar">
        <div className="tab-bar-inner">
          {TABS.map(({ id, label, Icon, badge }) => {
            const c = badge ? counts[badge] : 0;
            return (
              <button key={id} className={`tab${tab === id ? " active" : ""}`} onClick={() => setTab(id)}>
                <Icon className="ico" size={16} />
                {label}
                {badge && c > 0 && <span className="tab-count">{c}</span>}
              </button>
            );
          })}
        </div>
      </nav>

      {tab === "boring" && <BoringPage />}
      {tab === "skaering" && <SkaeringPage />}
      {tab === "tid" && <TidKorselPage />}
      {tab === "tilbud" && <TilbudPage />}
      {tab === "priser" && <PriserPage />}
      {tab === "historik" && <HistorikPage onEdit={setModalIdx} />}

      {modalIdx !== null && history[modalIdx] && <Modal idx={modalIdx} onClose={() => setModalIdx(null)} />}
      <Toast />
      <PrintView />
    </>
  );
}
