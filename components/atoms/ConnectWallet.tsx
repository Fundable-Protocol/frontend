"use client";

import { FC, Suspense, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import {
  argent,
  braavos,
  useAccount,
  useConnect,
  useDisconnect,
  useInjectedConnectors,
} from "@starknet-react/core";

import Image from "next/image";
import { Button } from "../ui/button";
import Dialog from "../molecules/Dialog";

const ConnectWallet: FC = () => {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  const [showDisconnect, SetshowDisconnect] = useState(false);

  const { address, isConnected, connector: activeConnector } = useAccount();

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  useEffect(() => {
    setIsClient(true);

    const savedConnectorId = localStorage.getItem("walletConnectorId");

    if (savedConnectorId && !isConnected) {
      const connector = connectors.find((c) => c.id === savedConnectorId);

      if (connector) connect({ connector });
    }

    if (isConnected && activeConnector && !savedConnectorId) {
      localStorage.setItem("walletConnectorId", activeConnector.id);
    }
  }, [isConnected, isClient]);

  const showDialog = () => {
    if (isConnected) {
      SetshowDisconnect((prev) => !prev);
      return;
    }

    const params = new URLSearchParams(window.location.search);
    params.set("showDialog", "true");

    router.replace(`?${params.toString()}`);
  };

  const hideDialog = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("showDialog");

    router.replace(`?${params.toString()}`);
  };

  const handleWalletConnect = (connector: (typeof connectors)[number]) => {
    connect({ connector });
    hideDialog();
  };

  const disconnectWallet = () => {
    disconnect();
    localStorage.removeItem("walletConnectorId");
    SetshowDisconnect(false);
  };

  const userAddress = `${address?.slice(0, 7)}...${address?.slice(-5)}`;

  return (
    <>
      <div className="relative">
        <Button
          variant="gradient"
          size="lg"
          className=" p-4"
          onClick={showDialog}
        >
          {address ? (
            <div className="flex items-center">
              <span className="mr-2">{userAddress}</span>
              <Image
                src={`/svgs/carret_down.svg`}
                width={32}
                height={32}
                alt="carret_down"
                className="h-auto w-auto"
              />
            </div>
          ) : (
            "Connect Wallet"
          )}
        </Button>
        {showDisconnect && (
          <Button
            className="absolute top-12 right-0 p-4"
            variant="outline"
            size="lg"
            onClick={disconnectWallet}
          >
            Disconnect wallet
          </Button>
        )}
      </div>

      {isClient && (
        <Suspense fallback={<div>Loading...</div>}>
          <Dialog>
            <div className="rounded-2xl bg-white py-6 text-center">
              <h2 className="text-[#8B8E97] font-inter pb-3 text-lg font-medium">
                Choose your preferred wallet
              </h2>
              <div className="bg-white flex flex-col px-4">
                {connectors.map((cnt) => (
                  <div
                    key={cnt.id}
                    className="flex items-center justify-between cursor-pointer hover:bg-slate-100 py-4 px-8 hover:rounded-lg"
                    onClick={() => handleWalletConnect(cnt)}
                    aria-label={cnt.name}
                  >
                    <span className="text-xl font-semibold capitalize">
                      {cnt.name}
                    </span>

                    <Image
                      src={typeof cnt.icon === 'string' ? cnt.icon : cnt.icon.light}
                      width={400}
                      height={400}
                      alt={cnt.name}
                      className="h-10 w-10"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Dialog>
        </Suspense>
      )}
    </>
  );
};

export default ConnectWallet;
