interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  totalAmount: string;
  recipientCount: number;
  selectedToken: string;
  protocolFee?: string;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  totalAmount,
  recipientCount,
  selectedToken,
  protocolFee,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0d0019] border border-[#5b21b6] rounded-lg p-6 w-96 max-w-[90%]">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Distribution</h3>
        
        <div className="space-y-4 mb-6">
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <p className="text-[#DADADA] text-sm">Total Amount</p>
            <p className="text-white font-semibold">{totalAmount} {selectedToken}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <p className="text-[#DADADA] text-sm">Recipients</p>
            <p className="text-white font-semibold">{recipientCount} addresses</p>
          </div>

          {protocolFee && (
            <div className="bg-[#1a1a1a] p-4 rounded-lg">
              <p className="text-[#DADADA] text-sm">Fee</p>
              <p className="text-white font-semibold">{protocolFee} {selectedToken}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-opacity-80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white rounded-full transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
} 