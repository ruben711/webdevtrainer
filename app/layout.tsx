import type { Metadata } from "next";
import "../css/styles.css";
import "../styles/styles-extras.css";
import "./globals.css";
import { ModeProvider } from "@/components/ModeProvider";
import { Sidebar } from "@/components/Sidebar";
import { ScrollReset } from "@/components/ScrollReset";
import { XpToast } from "@/components/XpToast";
import { THEME_SCRIPT } from "@/lib/theme";

export const metadata: Metadata = {
  title: "CodeKwartier — Web Dev Trainer",
  description: "Interactief oefenplatform voor JavaScript, HTML en CSS — oefen, run en verbeter je code live in de browser.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* anti-FOUC: set the correct theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ModeProvider>
          <ScrollReset />
          <div className="app">
            <Sidebar />
            <main className="main scroll">{children}</main>
          </div>
          <XpToast />
        </ModeProvider>
      </body>
    </html>
  );
}
