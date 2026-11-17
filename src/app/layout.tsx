import type { Metadata, Viewport } from "next";
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/components/providers/AppProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const interTight = Inter_Tight({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://webloom-interactive.vercel.app"),
  title: {
    default: "Webloom Interactive — Ideas made interactive",
    template: "%s — Webloom Interactive",
  },
  description:
    "Webloom Interactive is a creative technology studio and a concern of Dcastalia Limited. We bring brands to life through expressive design, creative code, and a little unexpected interaction.",
  openGraph: {
    title: "Webloom Interactive — Ideas made interactive",
    description: "Good websites get seen. Great ones get felt.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#171A1C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${mono.variable} is-loading`}>
      <body>
        <AppProvider>
          <a href="#main" className="skip">
            Skip to content
          </a>
          <Preloader />
          <Cursor />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <div className="grain" aria-hidden="true" />
        </AppProvider>
      </body>
    </html>
  );
}
