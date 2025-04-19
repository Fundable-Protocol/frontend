export interface RecipientData {
    address: string;
    amount: string;
    label?: string;
  }
  
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
    distribution_type: 'EQUAL' | 'WEIGHTED';
    status: 'COMPLETED' | 'FAILED' | 'PENDING';
    block_number?: bigint | null;
    block_timestamp?: Date | null;
    network: 'MAINNET' | 'TESTNET';
    created_at: Date;
    metadata?: {
      recipients: Array<RecipientData>;
    } | null;
  } 
  
  export interface DistributionResponse {
      distributions: Distribution[];
      total: number;
  }