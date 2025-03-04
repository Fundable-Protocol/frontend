import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";
import Navbar from "@/components/organisms/Navbar";
import { Toaster } from "react-hot-toast";
import { StarknetProvider } from "@/lib/providers/StarknetProvider";
import ClientAutoConnect from "@/lib/providers/AutoConnectProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const inter = Inter({
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage-grotesque",
});

export const metadata: Metadata = {
  title: "Fundable",
  description: "A decentralized funding application built on Starknet",
  icons: {
    icon: "/favicon_io/favicon.ico",
  },
};
// antialiased bg-[#0C0C4F] text-white min-h-screen
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <StarknetProvider>
        <body
          className={`${bricolageGrotesque.variable} ${geistSans.variable} ${geistMono.variable} ${inter.className} bg-purple-50`}
        >
          <ClientAutoConnect />
          <Navbar />
          {children}
          <SpeedInsights />
          <Toaster position="bottom-right" />
        </body>
      </StarknetProvider>
    </html>
  );
}
