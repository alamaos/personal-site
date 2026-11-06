import type { Metadata } from "next";
import { Instrument_Serif, Instrument_Sans, Caveat } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oskari Alamäki",
  description:
    "Business & Solution Architect. AI-agentit, Microsoft Power Platform, prosessiarkkitehtuuri.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fi"
      className={`${instrumentSerif.variable} ${instrumentSans.variable} ${caveat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
