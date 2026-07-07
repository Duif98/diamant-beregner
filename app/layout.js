import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
const mono = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "DiamantPro — Prisberegner for diamantboring & skæring",
  description:
    "Professionelt tilbudsværktøj til diamantboring og -skæring: beregn boring, skæring, tid, kørsel og rabat, og udskriv tilbud som PDF.",
  icons: { icon: [{ url: "favicon.svg", type: "image/svg+xml" }] },
};

export const viewport = {
  themeColor: "#0C1014",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html lang="da" className={`${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
