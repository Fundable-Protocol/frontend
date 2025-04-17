"use client";

import { useState } from "react";
import { useAccount } from "@starknet-react/core";
import { toast } from "react-hot-toast";
import { Stream } from "@/lib/types/stream";
import TokenStreamingWallet from "@/components/ui/stream/TokenStreamingWallet";
import { StreamConfirmationModal } from "@/components/ui/stream/StreamConfirmationModal";
import { StreamCard } from "@/components/ui/stream/StreamCard";
import { CreateStreamForm } from "@/components/ui/stream/CreateStreamForm";

export default function StreamPage() {
  const { address, status, account } = useAccount();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingStream, setPendingStream] = useState<Partial<Stream> | null>(null);

  const handleCreateStream = async (streamData: Partial<Stream>) => {
    setPendingStream(streamData);
    setShowConfirmModal(true);
  };

  const handleConfirmStream = async () => {
    if (!pendingStream || !account) return;

    setShowConfirmModal(false);
    const loadingToast = toast.loading("Creating stream...");

    try {
      // Contract interaction logic here
      toast.dismiss(loadingToast);
      toast.success("Stream created successfully");
      setStreams([...streams, { ...pendingStream, id: Date.now().toString(), status: 'active' } as Stream]);
      setShowCreateForm(false);
    } catch (error) {
      console.error("Stream creation failed:", error);
      toast.dismiss(loadingToast);
      toast.error(`Failed to create stream: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setPendingStream(null);
    }
  };

  // Show connect wallet message if not connected
  if (status !== "connected" || !address) {
    return <TokenStreamingWallet />;
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-bric font-bold text-white">Payment Streaming</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#440495] to-[#B102CD] hover:from-[#B102CD] hover:to-[#440495] text-white font-bold rounded-full transition-all"
          >
            Create Stream
          </button>
        </div>

        {showCreateForm ? (
          <CreateStreamForm
            onSubmit={handleCreateStream}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <StreamCard
                key={stream.id}
                stream={stream}
                onWithdraw={() => {}}
                onCancel={() => {}}
                onPause={() => {}}
                onRestart={() => {}}
              />
            ))}
            {streams.length === 0 && (
              <div className="col-span-full text-center text-[#DADADA] py-12">
                No active streams. Create one to get started!
              </div>
            )}
          </div>
        )}
      </div>

      <StreamConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmStream}
        stream={pendingStream}
      />
    </div>
  );
} 