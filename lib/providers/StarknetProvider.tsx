"use client";
import React from "react";
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  publicProvider,
  argent,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
// import { ControllerOptions } from "@cartridge/controller";

// Define contract addresses
const ETH_TOKEN_ADDRESS = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const USDC_TOKEN_ADDRESS = "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8";
const STRK_TOKEN_ADDRESS = "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";

// Define session policies for Cartridge Controller
const policies = {
  contracts: {
    [ETH_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          description: "Approve spending of ETH tokens",
        },
        { name: "transfer", entrypoint: "transfer" },
      ],
    },
    [USDC_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          description: "Approve spending of USDC tokens",
        },
        { name: "transfer", entrypoint: "transfer" },
      ],
    },
    [STRK_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          description: "Approve spending of STRK tokens",
        },
        { name: "transfer", entrypoint: "transfer" },
      ],
    },
  },
};

// Initialize the Cartridge connector
const cartridgeConnector = new ControllerConnector({
  policies,
  chains: [
    { rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia' },
    { rpcUrl: 'https://api.cartridge.gg/x/starknet/mainnet' },
  ],
  defaultChainId: sepolia.id.toString()
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [
      argent(),
      braavos(),
    ],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "onlyIfNoConnectors",
    // Randomize the order of the connectors.
    order: "random"
  });

  // Add the cartridge connector to the list of connectors
  const allConnectors = [...connectors, cartridgeConnector];

  return (
    <StarknetConfig
      chains={[mainnet, sepolia]}
      provider={publicProvider()}
      connectors={allConnectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
} 