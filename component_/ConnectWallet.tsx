"use client";

import {
  useAccount,
  useConnect,
  useDisconnect,
  useInjectedConnectors,
  argent,
  braavos,
} from "@starknet-react/core";

import { useState, useEffect } from "react";

export function ConnectWallet() {
  const { address, isConnected, connector: activeConnector } = useAccount();

  const { connectors } = useInjectedConnectors({
    recommended: [argent(), braavos()],
    includeRecommended: "onlyIfNoConnectors",
    order: "random",
  });

  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [showModal, setShowModal] = useState(false);
  console.log({ activeConnector: "gbf" });
  useEffect(() => {
    const reconnect = async () => {
      if (!isConnected && activeConnector) {
        try {
          connect({ connector: activeConnector });
        } catch (error) {
          console.error("Failed to reconnect:", error);
        }
      }
    };

    reconnect();
  }, [isConnected, activeConnector, connect]);

  if (address) {
    return (
      <div className="relative">
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white font-bold rounded-full transition-all duration-200"
          onClick={() => setShowModal(!showModal)}
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </button>

        {showModal && (
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0d0019] shadow-lg border border-[#5b21b6] border-opacity-20">
            <button
              onClick={() => {
                disconnect();
                setShowModal(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-[#5b21b6] transition-colors rounded-lg"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        className="px-6 py-3 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white font-bold rounded-full transition-all"
        onClick={() => setShowModal(!showModal)}
      >
        Connect Wallet
      </button>

      {showModal && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#0d0019] shadow-lg border border-[#5b21b6] border-opacity-20">
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => {
                connect({ connector });
                setShowModal(false);
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-[#5b21b6] transition-colors first:rounded-t-lg last:rounded-b-lg"
            >
              {connector.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
