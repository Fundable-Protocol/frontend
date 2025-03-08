"use client";

import { useEffect } from "react";
import { useConnect, useAccount } from "@starknet-react/core";
import { Connector } from "@starknet-react/core"; // adjust import based on your version

const AutoConnect = () => {
  const { connect, connectors } = useConnect();

  const { address, status } = useAccount();

  useEffect(() => {
    if (address) return;

    if (status === "disconnected") {
      const savedConnectorId = localStorage.getItem("starknetConnectorId");

      if (savedConnectorId) {
        const connector: Connector | undefined = connectors.find(
          (c) => c.id === savedConnectorId
        );

        if (connector) {
          try {
            connect({ connector });
          } catch {
            localStorage.removeItem("starknetConnectorId");
          }
        }
      }
    }
  }, [address, connect, connectors, status]);

  return null;
};

export default AutoConnect;
