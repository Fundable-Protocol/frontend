'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ConnectWallet } from './ConnectWallet';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-starknet-navy bg-opacity-95 backdrop-blur-sm z-50 border-b border-starknet-purple border-opacity-20">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/starknet-logo.svg"
            alt="Starknet Logo"
            width={32}
            height={32}
          />
          <span className="text-xl font-bold">Fundable</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/distribute"
            className="px-4 py-2 text-starknet-cyan hover:text-white transition-colors"
          >
            Distribute
          </Link>
          <ConnectWallet />
        </div>
      </nav>
    </header>
  );
} 