export interface TokenOption {
  symbol: string;
  address: string;
  decimals: number;
}

export const MAINNET_SUPPORTED_TOKENS = Object.freeze({
  USDC: {
    symbol: "USDC",
    address: "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    decimals: 6,
  },
  ETH: {
    symbol: "ETH",
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
  },
  STRK: {
    symbol: "STRK",
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
  },
  USDT: {
    symbol: "USDT",
    address: "0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    decimals: 6,
  },
}) as Readonly<Record<string, Readonly<TokenOption>>>;

export const TESTNET_SUPPORTED_TOKENS = Object.freeze({
  USDC: {
    symbol: "USDC",
    address: "0x05be0e73ef0f477eb8d4fbea87802acbf55c266c2bab64aa93b2db573be15c41",
    decimals: 6,
  },
  ETH: {
    symbol: "ETH",
    address: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    decimals: 18,
  },
  STRK: {
    symbol: "STRK",
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    decimals: 18,
  },
}) as Readonly<Record<string, Readonly<TokenOption>>>;

export const TESTNET_CONTRACT_ADDRESS = "0x02495b0832001cde19e2bd3ec27beabe07b913000e155864a77b5e834ce60b6a";
export const MAINNET_CONTRACT_ADDRESS = "0x67a27274b63fa3b070cabf7adf59e7b1c1e5b768b18f84b50f6cb85f59c42e5";

export const getContractAddress = (isMainnet: boolean) => 
  isMainnet ? MAINNET_CONTRACT_ADDRESS : TESTNET_CONTRACT_ADDRESS;

export const getSupportedTokens = (isMainnet: boolean) => 
  isMainnet ? MAINNET_SUPPORTED_TOKENS : TESTNET_SUPPORTED_TOKENS; 