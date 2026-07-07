"use client";

import { useStore } from "./Store";
import { calcRabatKr, buildTotals, fmt } from "../lib/calc";

export default function PrintView() {
  const { printData, st } = useStore();
  if (!printData) return <div className="print-only" />;

  const { customer, items, rabat } = printData;
  const pct = rabat.pct || 0, scope = rabat.scope, types = rabat.types;
  const rabatKr = calcRabatKr(items, pct, scope, types);
  const { sub, sg, tex, moms, grand } = buildTotals(items, rabatKr, st);
  const dato = customer.dato
    ? new Date(customer.dato).toLocaleDateString("da-DK")
    : new Date().toLocaleDateString("da-DK");

  return (
    <div className="print-only pv">
      <div className="pv-head">
        <div>
          <div className="pv-brand">DiamantPro</div>
          <div className="pv-brand-sub">Diamantboring &amp; skæring</div>
        </div>
        <div className="pv-doc">
          <div className="pv-doc-title">TILBUD</div>
          {customer.nr && <div>Nr. {customer.nr}</div>}
          <div>{dato}</div>
        </div>
      </div>

      <div className="pv-cust">
        <div className="pv-cust-name">{customer.kunde || "—"}</div>
        {customer.adresse && <div>{customer.adresse}</div>}
        {customer.frist && <div className="pv-frist">Betalingsfrist: {customer.frist} dage</div>}
      </div>

      <table className="pv-items">
        <thead><tr><th>Ydelse</th><th className="r">Antal</th><th className="r">Beløb</th></tr></thead>
        <tbody>
          {items.map((it, i) => {
            const applies = (scope === "all" || types[it.type]) && pct > 0;
            const final = applies ? it.total - Math.round(it.total * pct / 100) : it.total;
            return (
              <tr key={i}>
                <td>{it.desc}</td>
                <td className="r">{it.qty}</td>
                <td className="r">
                  {applies && <span className="pv-struck">{fmt(it.total)} </span>}
                  {fmt(final)} kr
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pv-totals">
        <div className="pv-tr"><span>Subtotal ydelser</span><span>{fmt(sub)} kr</span></div>
        {rabatKr > 0 && <div className="pv-tr pv-disc"><span>Rabat {pct}%{scope === "custom" ? " (udvalgte)" : ""}</span><span>− {fmt(rabatKr)} kr</span></div>}
        {sg > 0 && <div className="pv-tr"><span>Startgebyr</span><span>{fmt(sg)} kr</span></div>}
        <div className="pv-tr pv-main"><span>I alt ex. moms</span><span>{fmt(tex)} kr</span></div>
        <div className="pv-tr"><span>Moms 25%</span><span>{fmt(moms)} kr</span></div>
        <div className="pv-tr pv-grand"><span>Total inkl. moms</span><span>{fmt(grand)} kr</span></div>
      </div>
    </div>
  );
}
