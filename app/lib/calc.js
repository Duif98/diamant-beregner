// ============================================================
// DiamantPro — pricing logic, ported 1:1 from the original app.
// Pure functions only (no DOM). Correctness here is business-critical.
// ============================================================

export const DEFAULT_DIAMETERS = [
  { dia: "0-92", label: "Ø0–92 mm", rate: 14.0 },
  { dia: 102, rate: 15.5 }, { dia: 112, rate: 16.0 }, { dia: 117, rate: 16.5 },
  { dia: 122, rate: 17.0 }, { dia: 127, rate: 18.0 }, { dia: 132, rate: 18.5 },
  { dia: 138, rate: 19.0 }, { dia: 142, rate: 19.5 }, { dia: 152, rate: 20.0 },
  { dia: 162, rate: 21.5 }, { dia: 172, rate: 22.5 }, { dia: 182, rate: 23.0 },
  { dia: 186, rate: 25.5 }, { dia: 202, rate: 27.0 }, { dia: 212, rate: 27.5 },
  { dia: 226, rate: 28.5 }, { dia: 242, rate: 31.0 }, { dia: 252, rate: 32.25 },
  { dia: 262, rate: 33.5 }, { dia: 276, rate: 34.5 }, { dia: 302, rate: 39.0 },
  { dia: 312, rate: 41.0 }, { dia: 325, rate: 43.0 }, { dia: 341, rate: 45.0 },
  { dia: 352, rate: 50.0 }, { dia: 368, rate: 52.5 }, { dia: 402, rate: 54.5 },
  { dia: 425, rate: 58.5 }, { dia: 452, rate: 65.5 }, { dia: 502, rate: 83.5 },
  { dia: 525, rate: 91.0 }, { dia: 552, rate: 94.5 }, { dia: 602, rate: 104.0 },
  { dia: 652, rate: 117.0 }, { dia: 710, rate: 149.0 }, { dia: 750, rate: 157.5 },
  { dia: 800, rate: 167.0 }, { dia: 820, rate: 169.5 }, { dia: 850, rate: 175.5 },
  { dia: 900, rate: 212.0 }, { dia: 1000, rate: 272.5 }, { dia: 1100, rate: 319.0 },
];

export const DEF = {
  pFlad: 0.5, pVaeg: 0.35, pGulv: 0.25,
  pDiaNormal: 780, pNormNormal: 490, pOver: 245,
  pKmFast: 425, pKmExtra: 8.5, pStart: 0,
  pBoregrej: 330, pVaegsaw: 660, pGulvsav: 660, pOprigB: 330, pOprigS: 330,
};

export const RAB_TYPES = { boring: "Boring & skæring", t: "Oprigningstillæg", tid: "Arbejdstid", km: "Kørsel" };
export const CB_LABEL = {
  boregrej: "Boregrej", ringsav: "Ring & kapsav", skra: "Skråboring (+25%)",
  underop: "Under-op boring (+100%)", vaegsaw: "Vægsav", gulvsav: "Gulvsav",
};
export const SK_TYPE_KEY = { flad: "pFlad", vaeg: "pVaeg", gulv: "pGulv" };
export const SK_TYPE_NAME = { flad: "Ring & Kapsav", vaeg: "Vægskæring", gulv: "Gulvskæring" };

export const J = (x) => JSON.parse(JSON.stringify(x));
export const fmt = (n) => Math.round(n).toLocaleString("da");

export const diaLabel = (b) => b.label || `Ø${b.dia} mm`;

// Rate for a diameter, interpolating between neighbours for custom sizes.
export function getBor(dia, bd) {
  if (dia === "0-92") return bd[0];
  const n = parseFloat(dia);
  const b = bd.find((x) => x.dia === n || String(x.dia) === String(dia));
  if (!b) {
    const ns = bd.filter((x) => typeof x.dia === "number").sort((a, c) => a.dia - c.dia);
    let lo = ns[0], hi = ns[ns.length - 1];
    for (let i = 0; i < ns.length - 1; i++) {
      if (n >= ns[i].dia && n <= ns[i + 1].dia) { lo = ns[i]; hi = ns[i + 1]; break; }
    }
    const r = (n - lo.dia) / Math.max(hi.dia - lo.dia, 1);
    return { rate: lo.rate + r * (hi.rate - lo.rate) };
  }
  return b;
}

export function calcBorPrice(dia, depth, mult, bd) {
  const billDepth = Math.max(depth, 20);
  const b = getBor(dia, bd);
  return { price: Math.round(billDepth * b.rate * (mult || 1)), billDepth, rate: b.rate };
}

export function getMult(cb) {
  let m = 1;
  if (cb.b.skra) m *= 1.25;
  if (cb.b.underop) m *= 2;
  return m;
}

export function buildTotals(items, rabKr, st) {
  const sub = items.reduce((s, x) => s + x.total, 0);
  const sg = st.pStart || 0;
  const tex = sub - rabKr + sg;
  const moms = Math.round(tex * 0.25);
  return { sub, rabatKr: rabKr, sg, tex, moms, grand: tex + moms };
}

export function calcRabatKr(items, pct, scope, rt) {
  if (!pct || pct <= 0) return 0;
  let base = 0;
  items.forEach((it) => { if (scope === "all" || rt[it.type]) base += it.total; });
  return Math.round(base * pct / 100);
}

// ---- Live per-row helpers (for subtotals shown while editing) ----
export function borRowPrice(row, cb, bd) {
  const d = parseFloat(row.depthRaw) || 0;
  const q = parseInt(row.qty) || 1;
  const dia = row.dia === "custom" ? row.customDia || 0 : row.dia;
  if (!dia || d <= 0) return null;
  const { price, billDepth, rate } = calcBorPrice(dia, d, getMult(cb), bd);
  return { price, billDepth, rate, qty: q, total: price * q, min: d < 20 };
}

export function skRowPrice(row, st) {
  const m = parseFloat(row.meter) || 0;
  const d = parseFloat(row.depth) || 0;
  const q = parseInt(row.qty) || 1;
  const p = st[SK_TYPE_KEY[row.type]] || 0.35;
  if (m <= 0 || d <= 0) return null;
  const area = Math.round(m * 100 * d);
  const unit = Math.round(area * p);
  return { area, unit, qty: q, total: unit * q };
}

// ---- Item builders (mirror the original commit* functions exactly) ----
export function buildBoringItems(rows, cb, st, bd) {
  const chk = Object.entries(cb.b).filter(([, v]) => v).map(([k]) => CB_LABEL[k]);
  const tag = chk.length ? ` [${chk.join(", ")}]` : "";
  const m = getMult(cb);
  const mn = m > 1 ? ` (×${m} tillæg)` : "";
  const out = [];
  let n = 0;
  rows.forEach((r) => {
    const d = parseFloat(r.depthRaw) || 0;
    const q = parseInt(r.qty) || 1;
    const dia = r.dia === "custom" ? r.customDia || 0 : r.dia;
    if (!dia || !d) return;
    const { price, billDepth } = calcBorPrice(dia, d, m, bd);
    const b = getBor(dia, bd);
    const ds = r.dia === "custom" ? `Ø${dia}mm` : b.label || `Ø${dia}mm`;
    out.push({ type: "boring", desc: `Kerneboring ${ds}, ${billDepth}cm${d < 20 ? " (min. 20cm)" : ""}${mn}${tag}`, qty: q, unitPrice: price, total: price * q });
    n++;
  });
  if (cb.b.boregrej) out.push({ type: "t", desc: "Oprigningstillæg – Boregrej", qty: 1, unitPrice: st.pBoregrej, total: st.pBoregrej });
  if (cb.b.ringsav) out.push({ type: "t", desc: "Oprigningstillæg – Ring & Kapsav (boring)", qty: 1, unitPrice: st.pOprigB, total: st.pOprigB });
  return { items: out, count: n };
}

export function buildSkaeringItems(rows, cb, st) {
  const chk = Object.entries(cb.s).filter(([, v]) => v).map(([k]) => CB_LABEL[k]);
  const tag = chk.length ? ` [${chk.join(", ")}]` : "";
  const out = [];
  let n = 0;
  rows.forEach((r) => {
    const m = parseFloat(r.meter) || 0;
    const d = parseFloat(r.depth) || 0;
    const q = parseInt(r.qty) || 1;
    if (!m || !d) return;
    const p = st[SK_TYPE_KEY[r.type]] || 0.35;
    const a = Math.round(m * 100 * d);
    const u = Math.round(a * p);
    out.push({ type: "boring", desc: `${SK_TYPE_NAME[r.type]}, ${m}m × ${d}cm = ${fmt(a)} cm²${tag}`, qty: q, unitPrice: u, total: u * q });
    n++;
  });
  if (cb.s.vaegsaw) out.push({ type: "t", desc: "Oprigningstillæg – Vægsav", qty: 1, unitPrice: st.pVaegsaw, total: st.pVaegsaw });
  if (cb.s.gulvsav) out.push({ type: "t", desc: "Oprigningstillæg – Gulvsav", qty: 1, unitPrice: st.pGulvsav, total: st.pGulvsav });
  if (cb.s.ringsav) out.push({ type: "t", desc: "Oprigningstillæg – Ring & Kapsav (skæring)", qty: 1, unitPrice: st.pOprigS, total: st.pOprigS });
  return { items: out, count: n };
}

export function tidLines(inp, st) {
  const dN = +inp.diaNormal || 0, dO = +inp.diaOver || 0, nN = +inp.normNormal || 0, nO = +inp.normOver || 0;
  const pD = st.pDiaNormal, pN = st.pNormNormal, pO = st.pOver;
  const lines = [];
  let tot = 0;
  if (dN > 0) { const v = Math.round(dN * pD); tot += v; lines.push({ label: `Inkl. dia, normaltid: ${dN}t × ${pD} kr`, v }); }
  if (dO > 0) { const v = Math.round(dO * (pD + pO)); tot += v; lines.push({ label: `Inkl. dia, overtid: ${dO}t × ${pD + pO} kr`, v }); }
  if (nN > 0) { const v = Math.round(nN * pN); tot += v; lines.push({ label: `Uden dia, normaltid: ${nN}t × ${pN} kr`, v }); }
  if (nO > 0) { const v = Math.round(nO * (pN + pO)); tot += v; lines.push({ label: `Uden dia, overtid: ${nO}t × ${pN + pO} kr`, v }); }
  return { lines, tot };
}

export function buildTidItems(inp, st) {
  const dN = +inp.diaNormal || 0, dO = +inp.diaOver || 0, nN = +inp.normNormal || 0, nO = +inp.normOver || 0;
  const pD = st.pDiaNormal, pN = st.pNormNormal, pO = st.pOver;
  if (dN + dO + nN + nO === 0) return null;
  const out = [];
  if (dN > 0) { const v = Math.round(dN * pD); out.push({ type: "tid", desc: `Arbejdstid inkl. dia – normaltid (${dN}t × ${pD} kr)`, qty: 1, unitPrice: v, total: v }); }
  if (dO > 0) { const r = pD + pO, v = Math.round(dO * r); out.push({ type: "tid", desc: `Arbejdstid inkl. dia – overtid (${dO}t × ${r} kr)`, qty: 1, unitPrice: v, total: v }); }
  if (nN > 0) { const v = Math.round(nN * pN); out.push({ type: "tid", desc: `Arbejdstid uden dia – normaltid (${nN}t × ${pN} kr)`, qty: 1, unitPrice: v, total: v }); }
  if (nO > 0) { const r = pN + pO, v = Math.round(nO * r); out.push({ type: "tid", desc: `Arbejdstid uden dia – overtid (${nO}t × ${r} kr)`, qty: 1, unitPrice: v, total: v }); }
  return out;
}

export function korselCalc(km, st) {
  const f = st.pKmFast, e = st.pKmExtra, ov = Math.max(0, km - 25);
  const price = km === 0 ? 0 : Math.round(f + ov * e);
  return { price, over: ov, fast: f, extra: e };
}

export function buildKorselItem(km, st) {
  if (!km) return null;
  const { price, over, extra } = korselCalc(km, st);
  return { type: "km", desc: `Kørsel ${km} km${over > 0 ? ` (25 km fast + ${over} km × ${extra} kr)` : ""}`, qty: 1, unitPrice: price, total: price };
}
