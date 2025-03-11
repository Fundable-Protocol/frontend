"use client";

import { useEffect } from "react";
import { Connector } from "@starknet-react/core";
import { useConnect, useAccount } from "@starknet-react/core";

import { saveWalletAction } from "../actions/saveWalletActions";
import { useIsMounted } from "./useIsMounted";

export const useAutoConnect = () => {
  const { connect, connectors } = useConnect();
  const { hasPrevWallet } = useIsMounted();
  const { address, status } = useAccount();

  useEffect(() => {
    if (!address && status === "disconnected") {
      const savedConnectorId = localStorage.getItem("starknetConnectorId");

      if (savedConnectorId) {
        const connector: Connector | undefined = connectors.find(
          (c) => c.id === savedConnectorId
        );

        if (connector) connect({ connector });
      }
    }

    if (address && status === "connected") {
      if (!hasPrevWallet) {
        saveWalletAction({ walletAddress: address });
      }
    }
  }, [address, status, connectors, connect]);
};
