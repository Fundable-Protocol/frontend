export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#29296E] to-[#00FFE0] bg-clip-text text-transparent mb-6">
          Fundable
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Build scalable and secure decentralized applications with the power of
          STARK proof technology
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-starknet-cyan text-starknet-navy rounded-lg font-semibold hover:bg-opacity-90 transition-all">
            Get Started
          </button>
          <button className="px-6 py-3 border-2 border-starknet-cyan text-starknet-cyan rounded-lg font-semibold hover:bg-starknet-cyan hover:bg-opacity-10 transition-all">
            Learn More
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mt-24">
        <div className="p-6 rounded-xl bg-[#29296E] bg-opacity-50">
          <h3 className="text-xl font-bold mb-3">Scalability</h3>
          <p className="text-gray-300">
            Process thousands of transactions per second with STARK proofs
          </p>
        </div>
        <div className="p-6 rounded-xl bg-[#29296E] bg-opacity-50">
          <h3 className="text-xl font-bold mb-3">Security</h3>
          <p className="text-gray-300">
            Benefit from mathematical proof-based security
          </p>
        </div>
        <div className="p-6 rounded-xl bg-[#29296E] bg-opacity-50">
          <h3 className="text-xl font-bold mb-3">Composability</h3>
          <p className="text-gray-300">
            Build and connect with other Starknet applications seamlessly
          </p>
        </div>
      </div>
    </div>
  );
}
