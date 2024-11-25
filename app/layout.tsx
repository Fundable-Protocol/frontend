import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { StarknetProvider } from "@/components/StarknetProvider";
import { Toaster } from 'react-hot-toast';
import { Header } from "@/components/Header";

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

export const metadata: Metadata = {
  title: "Fundable",
  description: "A decentralized funding application built on Starknet",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0C0C4F] text-white min-h-screen`}
      >
        <StarknetProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Toaster position="bottom-right" />
        </StarknetProvider>
      </body>
    </html>
  );
}
