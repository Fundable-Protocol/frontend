import { useAccount } from "@starknet-react/core";

export function DashboardHeader() {
  const { address } = useAccount();
  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bric font-bold text-white">Dashboard</h1>
        <p className="text-[#DADADA] mt-2">Track your streams and distributions</p>
      </div>
      <div className="bg-[#1a1a1a] px-6 py-3 rounded-full">
        <p className="text-white font-medium">{shortAddress}</p>
      </div>
    </div>
  );
} 