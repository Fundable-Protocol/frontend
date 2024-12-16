"use client";

import { FC } from "react";
import { ConnectWallet } from "@/component_/ConnectWallet";
import { usePathname } from "next/navigation";

import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useInjectedConnectors, argent, braavos } from "@starknet-react/core";

import { useState } from "react";

import Dialog from "../molecules/Dialog";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
}

const ConnectWalletButton: FC<ButtonProps> = ({
  onClick,
  className,
  ...rest
}) => {
  const pathname = usePathname();
  const isRootPath = pathname === "/";

  return (
    <>
      {isRootPath ? (
        <Button
          onClick={onClick}
          variant="gradient"
          className={className}
          {...rest}
        >
          Launch App
        </Button>
      ) : (
        <ConnectWallet />
      )}
    </>
  );
};

export default ConnectWalletButton;
