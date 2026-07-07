# DiamantPro

Professionelt prisberegner- og tilbudsværktøj til **diamantboring & -skæring**.
Bygget i Next.js (statisk eksport → GitHub Pages) med en forfinet mørk pro-værktøj-æstetik.

**Live:** https://duif98.github.io/diamant-beregner/

## Funktioner

- **Boring, Skæring, Tid & Kørsel** — beregn priser med tillæg (skråboring, under-op,
  oprigningstillæg m.m.) og læg ydelser i tilbuddet.
- **Tilbud** — rabat pr. kategori, moms, startgebyr, kundeoplysninger og PDF-udskrift.
- **Priser** — fuldt redigerbar prisliste (borediametre, sats pr. cm²/time/km, gebyrer).
- **Historik** — gemte tilbud med status (accepteret/afvist/afventer), søgning og redigér-modal.
- Alt gemt lokalt i browseren (`localStorage`); ingen server.

Prislogikken er porteret 1:1 fra den oprindelige app og verificeret mod den med en
sammenligningstest (179 cases på tværs af diametre, dybder, multiplikatorer, skæring, tid,
kørsel, rabat og moms).

## Kom i gang

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # statisk build → ./out
```

## Deploy

Push til `main` — den medfølgende GitHub Actions-workflow bygger og udgiver automatisk.
Sæt **Settings → Pages → Source: GitHub Actions**. Sti-præfikset (`/diamant-beregner`)
sættes automatisk ud fra repo-navnet.

## Teknik

Next.js 14 (App Router, `output: "export"`) · self-hostede Google Fonts (Inter + Space
Grotesk) · vanilla React. Al prislogik ligger rent i `app/lib/calc.js`; delt state i
`app/components/Store.js`. PDF-tilbuddet genereres via browserens print (`@media print`).
