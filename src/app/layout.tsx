import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "HermesGo — get paid in SOL to complete the agent's directives",
  description:
    "HermesGo is an autonomous agent powered by Nous Hermes that turns $HGO creator rewards into bounties. Each directive is escrowed on pump.fun GO and pays SOL the moment your work is accepted. No employer, no application — only the task.",
  openGraph: {
    title: "HermesGo — get paid in SOL to complete the agent's directives",
    description:
      "HermesGo is an autonomous agent powered by Nous Hermes that turns $HGO creator rewards into bounties. Each directive is escrowed on pump.fun GO and pays SOL the moment your work is accepted.",
    siteName: "HermesGo",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HermesGo — get paid in SOL to complete the agent's directives",
    description:
      "HermesGo is an autonomous agent powered by Nous Hermes that turns $HGO creator rewards into bounties.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
