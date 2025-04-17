import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Stream } from "@/lib/types/stream";

interface StreamCardProps {
  stream: Stream;
  onWithdraw: () => void;
  onCancel: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export function StreamCard({ stream, onWithdraw, onCancel, onPause, onRestart }: StreamCardProps) {
  const [showActions, setShowActions] = useState(false);

  const getProgress = () => {
    const now = Date.now();
    const total = stream.endTime - stream.startTime;
    const elapsed = now - stream.startTime;
    return Math.min(Math.max((elapsed / total) * 100, 0), 100);
  };

  const getStatusColor = () => {
    switch (stream.status) {
      case 'active':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-[#0d0019] border border-[#5b21b6] border-opacity-20 rounded-lg p-6 relative">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-white font-semibold mb-1">
            To: {stream.recipient.slice(0, 6)}...{stream.recipient.slice(-4)}
          </h3>
          <p className="text-[#DADADA] text-sm">
            {stream.totalAmount} {stream.token}
          </p>
        </div>
        <div className={`${getStatusColor()} h-2 w-2 rounded-full`} />
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-[#1a1a1a] rounded-full mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#440495] to-[#B102CD] rounded-full"
          style={{ width: `${getProgress()}%` }}
        />
      </div>

      <div className="flex justify-between text-sm text-[#DADADA] mb-4">
        <span>Start: {formatDistanceToNow(stream.startTime, { addSuffix: true })}</span>
        <span>End: {formatDistanceToNow(stream.endTime, { addSuffix: true })}</span>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-[#DADADA] text-sm">
          Withdrawn: {stream.withdrawnAmount} {stream.token}
        </div>
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-white hover:text-[#B102CD] transition-colors"
        >
          •••
        </button>
      </div>

      {/* Action menu */}
      {showActions && (
        <div className="absolute right-4 bottom-16 bg-[#1a1a1a] border border-[#5b21b6] border-opacity-20 rounded-lg shadow-lg p-2 z-10">
          <button
            onClick={() => {
              onWithdraw();
              setShowActions(false);
            }}
            className="block w-full text-left px-4 py-2 text-white hover:bg-[#5b21b6] rounded-lg transition-colors"
          >
            Withdraw
          </button>
          {stream.status === 'active' && (
            <button
              onClick={() => {
                onPause();
                setShowActions(false);
              }}
              className="block w-full text-left px-4 py-2 text-white hover:bg-[#5b21b6] rounded-lg transition-colors"
            >
              Pause
            </button>
          )}
          {stream.status === 'paused' && (
            <button
              onClick={() => {
                onRestart();
                setShowActions(false);
              }}
              className="block w-full text-left px-4 py-2 text-white hover:bg-[#5b21b6] rounded-lg transition-colors"
            >
              Restart
            </button>
          )}
          {stream.cancelable && stream.status === 'active' && (
            <button
              onClick={() => {
                onCancel();
                setShowActions(false);
              }}
              className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[#5b21b6] rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      )}
    </div>
  );
} 