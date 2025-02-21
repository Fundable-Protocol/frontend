import { useState } from "react";
import { SUPPORTED_TOKENS, TokenOption } from "@/lib/constants";
import { Stream } from "@/types/stream";

interface CreateStreamFormProps {
  onSubmit: (data: Partial<Stream>) => void;
  onCancel: () => void;
}

export function CreateStreamForm({ onSubmit, onCancel }: CreateStreamFormProps) {
  const [formData, setFormData] = useState<Partial<Stream>>({
    recipient: "",
    totalAmount: "",
    startTime: 0,
    endTime: 0,
    cancelable: true,
    token: Object.keys(SUPPORTED_TOKENS)[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#0d0019] bg-opacity-50 p-6 rounded-lg border border-[#5b21b6] border-opacity-20">
      <div className="space-y-4">
        <div>
          <label className="block text-white mb-2">Recipient Address</label>
          <input
            type="text"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            className="w-full bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2"
            placeholder="0x..."
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Total Amount</label>
          <input
            type="text"
            value={formData.totalAmount}
            onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
            className="w-full bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2"
            placeholder="0.0"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white mb-2">Start Time</label>
            <input
              type="datetime-local"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: Number(e.target.value) })}
              className="w-full bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-white mb-2">End Time</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: Number(e.target.value) })}
              className="w-full bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-white mb-2">Token</label>
          <select
            value={formData.token}
            onChange={(e) => setFormData({ ...formData, token: e.target.value })}
            className="w-full bg-[#1a1a1a] text-white border border-[#5b21b6] border-opacity-40 rounded-lg px-4 py-2"
          >
            {Object.entries(SUPPORTED_TOKENS).map(([symbol, token]) => (
              <option key={symbol} value={symbol}>
                {symbol}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.cancelable}
            onChange={(e) => setFormData({ ...formData, cancelable: e.target.checked })}
            className="rounded border-[#5b21b6] border-opacity-40"
          />
          <label className="text-white">Allow cancellation</label>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-[#1a1a1a] text-white rounded-full hover:bg-opacity-80 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white rounded-full transition-all"
        >
          Create Stream
        </button>
      </div>
    </form>
  );
} 