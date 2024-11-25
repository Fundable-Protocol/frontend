import { validateAndParseAddress } from 'starknet';
import { parseUnits } from 'ethers';

export const isValidStarknetAddress = (address: string): boolean => {
  try {
    validateAndParseAddress(address);
    return true;
  } catch {
    return false;
  }
};

export const isValidAmount = (amount: string): boolean => {
  try {
    const bn = parseUnits(amount, 18);
    return bn >= parseUnits('0', 18);
  } catch {
    return false;
  }
};

export const validateDistribution = (
  address: string,
  amount: string
): { isValid: boolean; error?: string } => {
  if (!isValidStarknetAddress(address)) {
    return { isValid: false, error: 'Invalid Starknet address' };
  }

  if (!isValidAmount(amount)) {
    return { isValid: false, error: 'Invalid amount' };
  }

  return { isValid: true };
}; 