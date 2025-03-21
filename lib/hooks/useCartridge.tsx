"use client";

import { useAccount, useConnect } from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { useEffect, useState } from "react";

export function useCartridge() {
  const { connectors } = useConnect();
  const { address, status } = useAccount();
  const [username, setUsername] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  // Find the Cartridge connector
  const connector = connectors.find(
    (c) => c.id === "cartridge.controller"
  ) as ControllerConnector | undefined;

  // Determine if connected with Cartridge
  const isCartridgeConnected = !!connector && status === "connected";

  // Fetch the username if connected with Cartridge
  useEffect(() => {
    if (!isCartridgeConnected || !connector || !address) {
      setUsername(undefined);
      return;
    }

    const fetchUsername = async () => {
      setLoading(true);
      try {
        const name = await connector.username();
        setUsername(name);
      } catch (error) {
        console.error("Failed to fetch Cartridge username:", error);
        setUsername(undefined);
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [connector, address, isCartridgeConnected]);

  return {
    connector,
    username,
    isCartridgeConnected,
    loading
  };
}

export default useCartridge; 