import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Democracia S.A. — El Juego del Poder Real",
  description:
    "Un juego incremental de estrategia politica. Compra influencia, corrompe el sistema y convirte la democracia en tu empresa personal.",
  keywords: [
    "juego incremental",
    "cookie clicker",
    "politica",
    "satira",
    "estrategia",
    "democracia",
    "lobby",
  ],
  authors: [{ name: "Democracia S.A." }],
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏛️</text></svg>",
  },
  openGraph: {
    title: "Democracia S.A.",
    description: "El juego del poder real. Compra influencia. Corrompe. Domina.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 30%, #1e3a5f 100%)', color: '#ffffff' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
