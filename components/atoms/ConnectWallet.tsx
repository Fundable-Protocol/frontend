// components/ConnectWallet.tsx
"use client";

import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useIsMounted } from "@/lib/hooks/useIsMounted";
import Link from "next/link";

const ConnectWallet: FC = () => {
  const { isMounted, hasPrevWallet, setHasPrevWallet } = useIsMounted();
  const router = useRouter();
  const [showDisconnect, setShowDisconnect] = useState(false);
  const { address, isConnected, status } = useAccount();

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    order: "alphabetical", // stable order
  });

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const showDialog = () => {
    if (isConnected) {
      setShowDisconnect((prev) => !prev);
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
    localStorage.setItem("starknetConnectorId", connector.id);
    setHasPrevWallet(true);
    hideDialog();
  };

  const disconnectWallet = () => {
    disconnect();
    setHasPrevWallet(false);
    localStorage.removeItem("starknetConnectorId");
    setShowDisconnect(false);
  };

  const userAddress = address
    ? `${address.slice(0, 7)}...${address.slice(-5)}`
    : "";

  if (!isMounted) {
    return (
      <Button
        variant="gradient"
        size="lg"
        className="p-4 flex gap-x-1"
        disabled
      >
        <Loader2 className="animate-spin" width={20} height={20} />
        Please wait
      </Button>
    );
  }

  return (
    <>
      <div className="relative">
        {!hasPrevWallet && status === "disconnected" ? (
          <Button
            variant="gradient"
            size="lg"
            className="p-4"
            onClick={showDialog}
          >
            Connect Wallet
          </Button>
        ) : address ? (
          <Button
            variant="gradient"
            size="lg"
            className="p-4"
            onClick={showDialog}
          >
            <div className="flex items-center">
              <span className="mr-2">{userAddress}</span>
              <Image
                src="/svgs/carret_down.svg"
                width={32}
                height={32}
                alt="carret_down"
                className="h-auto w-auto"
              />
            </div>
          </Button>
        ) : (
          <Button
            variant="gradient"
            size="lg"
            className="p-4 flex gap-x-1"
            disabled
          >
            <Loader2 className="animate-spin" width={20} height={20} />
            Please wait
          </Button>
        )}

        {showDisconnect ? (
          <Link href="/" onClick={disconnectWallet}>
            <Button
              className="absolute top-12 right-0 p-4"
              variant="outline"
              size="lg"
            >
              Disconnect wallet
            </Button>
          </Link>
        ) : null}
      </div>

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
                  src={typeof cnt.icon === "string" ? cnt.icon : cnt.icon.light}
                  width={40}
                  height={40}
                  alt={cnt.name}
                  className="h-10 w-10"
                  unoptimized
                />
              </div>
            ))}
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ConnectWallet;
