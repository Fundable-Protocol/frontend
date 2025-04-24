import { Stream } from "@/lib/types/stream";

interface StreamConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  stream: Partial<Stream> | null;
}

export function StreamConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  stream,
}: StreamConfirmationModalProps) {
  if (!isOpen || !stream) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#0d0019] border border-[#5b21b6] rounded-lg p-6 w-96 max-w-[90%]">
        <h3 className="text-xl font-semibold text-white mb-4">Confirm Stream</h3>
        
        <div className="space-y-4 mb-6">
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <p className="text-[#DADADA] text-sm">Recipient</p>
            <p className="text-white font-semibold">{stream.recipient}</p>
          </div>
          
          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <p className="text-[#DADADA] text-sm">Amount</p>
            <p className="text-white font-semibold">{stream.totalAmount} {stream.token}</p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <p className="text-[#DADADA] text-sm">Duration</p>
            <p className="text-white font-semibold">
              From: {formatDate(stream.startTime?.toString() || '')}
              <br />
              To: {formatDate(stream.endTime?.toString() || '')}
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-4 rounded-lg">
            <p className="text-[#DADADA] text-sm">Settings</p>
            <p className="text-white font-semibold">
              {stream.cancelable ? 'Can be cancelled' : 'Cannot be cancelled'}
            </p>
          </div>
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
            Create Stream
          </button>
        </div>
      </div>
    </div>
  );
} 