import ConnectWallet from "@/components/atoms/ConnectWallet";

export default function TokenStreamingWallet() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bric font-bold text-white mb-8">Payment Streaming</h1>
          <div className="p-8 rounded-lg bg-[#0d0019] bg-opacity-50 border border-[#5b21b6] border-opacity-20">
            <p className="text-[#DADADA] mb-4">
              Please connect your wallet to use the streaming feature
            </p>
            <ConnectWallet />
          </div>
        </div>
      </div>
    </div>
  );
} 