"use client";

import { FC } from "react";

import { useRouter } from "next/navigation";

import {
  argent,
  braavos,
  useAccount,
  useConnect,
  useInjectedConnectors,
} from "@starknet-react/core";

import Image from "next/image";
import { Button } from "../ui/button";
import Dialog from "../molecules/Dialog";

const ConnectWallet: FC = () => {
  const router = useRouter();

  const { address, isConnected, connector: activeConnector } = useAccount();

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  const { connect } = useConnect();
  // const { disconnect } = useDisconnect();

  const showDialog = () => {
    if (isConnected) return;

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

  return (
    <>
      <Button onClick={showDialog} variant="gradient" size="lg">
        {address
          ? `${(address as string).slice(0, 7)}...${(address as string).slice(
              -5
            )}`
          : "Connect Wallet"}
      </Button>

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
                <div>
                  <Image
                    src={`/svgs/${cnt.id}.svg`}
                    width={32}
                    height={32}
                    alt={cnt.name}
                    className="h-auto w-auto"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[#8B8E97] font-inter mt-8 text-base font-normal">
            View QR code instead
          </p>
        </div>
      </Dialog>
    </>
  );
};

export default ConnectWallet;
