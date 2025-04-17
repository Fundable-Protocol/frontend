export interface Stream {
  id: string;
  recipient: string;
  totalAmount: string;
  startTime: number;
  endTime: number;
  cancelable: boolean;
  token: string;
  status: 'active' | 'paused' | 'cancelled' | 'completed';
  withdrawnAmount: string;
} 