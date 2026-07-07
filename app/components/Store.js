"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { DEFAULT_DIAMETERS, DEF, J, fmt, buildTotals, calcRabatKr } from "../lib/calc";
import { LS, read, write, remove } from "../lib/storage";

const StoreCtx = createContext(null);
export const useStore = () => useContext(StoreCtx);

const freshRabat = () => ({ pct: 0, scope: "all", types: { boring: true, t: true, tid: true, km: true } });

export function StoreProvider({ children }) {
  // Persisted
  const [bd, setBd] = useState(() => J(DEFAULT_DIAMETERS));
  const [st, setSt] = useState(() => ({ ...DEF }));
  const [history, setHistory] = useState([]);
  // In-memory quote
  const [items, setItems] = useState([]);
  const [rabat, setRabatState] = useState(freshRabat);
  const [customer, setCustomerState] = useState({ kunde: "", adresse: "", nr: "", dato: "", frist: "14" });
  // UI
  const [toastMsg, setToastMsg] = useState(null);
  const [printData, setPrintData] = useState(null);
  const hydrated = useRef(false);
  const toastTimer = useRef(null);

  // Hydrate from localStorage after mount (keeps SSR markup stable)
  useEffect(() => {
    const d = read(LS.dia, null);
    if (Array.isArray(d) && d.length) setBd(d);
    const s = read(LS.settings, null);
    if (s) setSt({ ...DEF, ...s });
    const h = read(LS.history, null);
    if (Array.isArray(h)) setHistory(h);
    setCustomerState((c) => ({ ...c, dato: new Date().toISOString().split("T")[0] }));
    hydrated.current = true;
  }, []);

  const toast = useCallback((msg) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 1800);
  }, []);

  // ---- Settings / diameters ----
  const saveSettings = (partial) =>
    setSt((prev) => { const next = { ...prev, ...partial }; write(LS.settings, next); return next; });
  const saveBd = (next) => { setBd(next); write(LS.dia, next); };
  const setDiaRate = (i, rate) => saveBd(bd.map((b, j) => (j === i ? { ...b, rate } : b)));
  const addDia = (dia, rate) => {
    if (bd.find((b) => b.dia === dia)) { alert("Diameter findes allerede."); return false; }
    const next = [...bd, { dia, rate }].sort((a, b) => {
      const na = a.dia === "0-92" ? 0 : parseFloat(a.dia), nb = b.dia === "0-92" ? 0 : parseFloat(b.dia);
      return na - nb;
    });
    saveBd(next); toast("✓ Bor gemt"); return true;
  };
  const rmDia = (i) => { const next = bd.filter((_, j) => j !== i); saveBd(next); toast("✓ Bor gemt"); };
  const resetAll = () => {
    const nb = J(DEFAULT_DIAMETERS), ns = { ...DEF };
    setBd(nb); setSt(ns); write(LS.dia, nb); write(LS.settings, ns); toast("✓ Nulstillet");
  };

  // ---- Quote items ----
  const addItems = (newItems) => setItems((prev) => [...prev, ...newItems]);
  const rmItem = (i) => setItems((prev) => prev.filter((_, j) => j !== i));
  const clearItems = () => setItems([]);
  const setRabat = (partial) => setRabatState((prev) => ({ ...prev, ...partial }));
  const setCustomer = (partial) => setCustomerState((prev) => ({ ...prev, ...partial }));

  // ---- History ----
  const persistHistory = (next) => { setHistory(next); write(LS.history, next); };
  const saveTilbudToHistory = () => {
    if (!items.length) { toast("⚠ Tilbud er tomt"); return; }
    const rabatKr = calcRabatKr(items, rabat.pct, rabat.scope, rabat.types);
    const { sub, sg, tex, moms, grand } = buildTotals(items, rabatKr, st);
    const entry = {
      id: Date.now(),
      dato: new Date().toLocaleDateString("da-DK"),
      kunde: customer.kunde || "Ukendt kunde",
      nr: customer.nr || "—",
      adr: customer.adresse || "",
      frist: customer.frist || "14",
      datoval: customer.dato || "",
      items: J(items),
      pct: rabat.pct, rabatKr, scope: rabat.scope, rabatTypes: J(rabat.types),
      sub, sg, tex, moms, grand,
      lines: items.map((it) => it.desc + (it.qty > 1 ? ` (${it.qty} stk)` : "") + ` – ${fmt(it.total)} kr`),
      status: "pending",
    };
    const next = [entry, ...history];
    if (next.length > 20) next.pop();
    persistHistory(next);
    toast("✓ Gemt i historik");
  };
  const setStatus = (idx, status) => persistHistory(history.map((e, i) => (i === idx ? { ...e, status } : e)));
  const deleteHistory = (idx) => persistHistory(history.filter((_, i) => i !== idx));
  const clearHistory = () => { setHistory([]); remove(LS.history); toast("✓ Historik ryddet"); };
  const updateHistory = (idx, entry) => { persistHistory(history.map((e, i) => (i === idx ? entry : e))); toast("✓ Ændringer gemt"); };

  // ---- Print ----
  const print = (data) => setPrintData(data);
  useEffect(() => {
    if (!printData) return;
    const done = () => setPrintData(null);
    window.addEventListener("afterprint", done);
    const t = setTimeout(() => window.print(), 60);
    return () => { window.removeEventListener("afterprint", done); clearTimeout(t); };
  }, [printData]);

  const value = {
    bd, st, items, rabat, customer, history, toastMsg, printData,
    toast, saveSettings, setDiaRate, addDia, rmDia, resetAll,
    addItems, rmItem, clearItems, setRabat, setCustomer,
    saveTilbudToHistory, setStatus, deleteHistory, clearHistory, updateHistory, print,
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}
