export interface TokenOption {
  symbol: string;
  address: string;
  decimals: number;
}

export const SUPPORTED_TOKENS: { [key: string]: TokenOption } = {
  USDC: {
    symbol: "USDC",
    address: "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
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
};

export const CONTRACT_ADDRESS = "0x288a25635f7c57607b4e017a3439f9018441945246fb5ca3424d8148dd580cc"; 

// Function to get the explorer URL based on network and tx hash
export const getExplorerUrl = (network: string, txHash: string): string => {
  const baseUrl = network === 'MAINNET' 
    ? 'https://voyager.online/tx/' 
    : 'https://sepolia.voyager.online/tx/';
  
  return `${baseUrl}${txHash}`;
};