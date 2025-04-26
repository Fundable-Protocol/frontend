export interface RecipientData {
  address: string;
  amount: string;
}

export const DistributionStatus = ["COMPLETED", "FAILED", "PENDING"] as const;

export const DistributionType = ["EQUAL", "WEIGHTED"] as const;

export const SupportedNetwork = ["MAINNET", "TESTNET"] as const;

export interface Distribution {
  id: string;
  user_address: string;
  transaction_hash?: string | null;
  token_address: string;
  token_symbol: string;
  token_decimals: number;
  total_amount: string;
  fee_amount: string;
  total_recipients: number;
  distribution_type: (typeof DistributionType)[number];
  status: (typeof DistributionStatus)[number];
  block_number?: bigint | number | null;
  block_timestamp?: Date | null;
  network: (typeof SupportedNetwork)[number];
  created_at: Date | string;
  metadata?: {
    recipients: Array<RecipientData>;
  } | null;
}

export interface DistributionResponse {
  distributions: Distribution[];
  total: number;
}
