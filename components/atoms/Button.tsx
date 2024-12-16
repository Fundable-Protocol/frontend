"use client";

import { Button } from "@/components/ui/button";
import { FC } from "react";
import { ConnectWallet } from "@/component_/ConnectWallet";
import { usePathname } from "next/navigation";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

const ConnectWalletButton: FC<ButtonProps> = ({ onClick, className, ...rest }) => {
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  return (
    <>
      {isRootPath ? (
        <Button onClick={onClick} variant="gradient" className={className} {...rest}>
          Launch App
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </>
  );
};

export default ConnectWalletButton;
