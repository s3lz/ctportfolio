import type { Metadata } from "next";
import {
  IBM_Plex_Sans_Thai_Looped,
  Inter,
  Libre_Barcode_128,
} from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexThai = IBM_Plex_Sans_Thai_Looped({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-ibm-plex-thai",
});

const libreBarcode = Libre_Barcode_128({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-barcode",
});

export const metadata: Metadata = {
  title: "Selena Zheng Portfolio",
  description: "Portfolio landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${ibmPlexThai.variable} ${libreBarcode.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
