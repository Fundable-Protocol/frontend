"use client";

import { FC } from "react";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import ConnectWallet from "./ConnectWallet";
import Link from "next/link";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

const ConnectWalletButton: FC<ButtonProps> = ({ className }) => {
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  return (
    <>
      {isRootPath ? (
        <Link href="/dashboard">
          <Button variant="default" className={className}>
            Launch App
          </Button>
        </Link>
      ) : (
        <ConnectWallet />
      )}
    </>
  );
};

export default ConnectWalletButton;
