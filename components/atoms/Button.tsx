"use client";

import { useRouter } from "next/navigation";

import { FC } from "react";

import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useInjectedConnectors, argent, braavos } from "@starknet-react/core";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import Dialog from "../molecules/Dialog";

interface ButtonProps {
  onClick?: () => void;
}

const ConnectWalletButton: FC<ButtonProps> = () => {
  const router = useRouter();

  const showDialog = () => {
    router.push("?showDialog=true");
  };

  const { address, status, account } = useAccount();

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  const { connect, error } = useConnect({});
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);

  console.log(account);

  const handleClick = () => {
    setShowModal(!showModal);
  };

  if (address) {
    return (
      <div className="relative">
        <button
          className="px-4 py-2 bg-starknet-cyan text-starknet-navy rounded-lg font-semibold hover:bg-opacity-90 transition-all"
          onClick={() => setShowModal(!showModal)}
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>

        {showModal && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-starknet-purple shadow-lg">
            <button
              onClick={() => {
                disconnect();
                setShowModal(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-starknet-navy transition-colors rounded-lg"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="">
      <Button onClick={showDialog} variant="gradient">
        Connect Wallet
      </Button>
      <Dialog>
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-starknet-purple shadow-lg">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                connect({ connector });
                setShowModal(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-starknet-navy transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {connector.name}
            </button>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default ConnectWalletButton;
