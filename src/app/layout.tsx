import type { Metadata } from "next";
import { Inter, Barlow_Condensed, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SEED · Seminario de Emprendedor a Empresario Digital",
  description:
    "Descubre cómo pasar de emprendedor a empresario digital. Aprende Redes Sociales, Publicidad Efectiva e IA aplicada a tu negocio — en vivo, gratis, con Jorge Serratos.",
  openGraph: {
    title: "SEED · Seminario de Emprendedor a Empresario Digital",
    description:
      "Aprende el sistema que usan los empresarios digitales que ya escalaron. En vivo, gratis, esta semana.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${barlowCondensed.variable} ${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
