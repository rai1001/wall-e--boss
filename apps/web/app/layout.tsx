import type { Metadata } from "next";
import { Sora, DM_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans"
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-alt"
});

export const metadata: Metadata = {
  title: "WALL-E | Hoy",
  description: "Asistente de Rai - WALL-E"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${sora.variable} ${dmSans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
