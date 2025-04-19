import * as Dialog from '@radix-ui/react-dialog';
import { formatDistanceToNow } from "date-fns";
import { Distribution } from "@/lib/types/distribution";

interface DistributionDetailsModalProps {
  distribution: Distribution | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DistributionDetailsModal({
  distribution,
  isOpen,
  onClose,
}: DistributionDetailsModalProps) {
  if (!distribution) return null;

  const recipients = distribution.metadata?.recipients || [];
  const hasLabels = recipients.some(r => r.label);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Content className="bg-[#1a1a1a] text-white border-[#5b21b6] border-opacity-20 max-w-2xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg p-6">
          <Dialog.Title className="text-xl font-semibold mb-4">Distribution Details</Dialog.Title>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm text-[#DADADA]">Status</h3>
                <p className="text-white font-medium capitalize">{distribution.status.toLowerCase()}</p>
              </div>
              <div>
                <h3 className="text-sm text-[#DADADA]">Network</h3>
                <p className="text-white font-medium capitalize">{distribution.network.toLowerCase()}</p>
              </div>
              <div>
                <h3 className="text-sm text-[#DADADA]">Distribution Type</h3>
                <p className="text-white font-medium capitalize">{distribution.distribution_type.toLowerCase()}</p>
              </div>
              <div>
                <h3 className="text-sm text-[#DADADA]">Total Recipients</h3>
                <p className="text-white font-medium">{distribution.total_recipients}</p>
              </div>
              <div>
                <h3 className="text-sm text-[#DADADA]">Total Amount</h3>
                <p className="text-white font-medium">
                  {distribution.total_amount} {distribution.token_symbol}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-[#DADADA]">Fee Amount</h3>
                <p className="text-white font-medium">
                  {distribution.fee_amount} {distribution.token_symbol}
                </p>
              </div>
              <div>
                <h3 className="text-sm text-[#DADADA]">Created</h3>
                <p className="text-white font-medium">
                  {formatDistanceToNow(new Date(distribution.created_at), { addSuffix: true })}
                </p>
              </div>
              {distribution.block_timestamp && (
                <div>
                  <h3 className="text-sm text-[#DADADA]">Completed</h3>
                  <p className="text-white font-medium">
                    {formatDistanceToNow(new Date(distribution.block_timestamp), { addSuffix: true })}
                  </p>
                </div>
              )}
            </div>
            
            {distribution.transaction_hash && (
              <div className="mt-6">
                <h3 className="text-sm text-[#DADADA] mb-2">Transaction Hash</h3>
                <p className="text-white font-medium break-all">
                  {distribution.transaction_hash}
                </p>
              </div>
            )}

            {recipients.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm text-[#DADADA] mb-2">Recipients</h3>
                <div className="max-h-60 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-[#DADADA]">
                        {hasLabels && <th className="p-2">Label</th>}
                        <th className="p-2">Address</th>
                        <th className="p-2">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipients.map((recipient, index) => (
                        <tr key={`${recipient.address}-${index}`} className="border-t border-[#5b21b6] border-opacity-20">
                          {hasLabels && (
                            <td className="p-2 text-sm">
                              {recipient.label || '-'}
                            </td>
                          )}
                          <td className="p-2 text-sm font-mono">{recipient.address}</td>
                          <td className="p-2 text-sm">
                            {recipient.amount} {distribution.token_symbol}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
} 