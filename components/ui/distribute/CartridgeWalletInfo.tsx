import { useAccount, useDisconnect } from "@starknet-react/core";
import { Button } from "../button";
import { useCartridge } from "@/lib/hooks/useCartridge";

export function CartridgeWalletInfo() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { username, loading } = useCartridge();

  if (!address) return null;

  return (
    <div className="flex flex-col items-center p-4 bg-[#0d0019] bg-opacity-50 border border-[#5b21b6] border-opacity-20 rounded-lg text-white mt-4 mb-8">
      <h3 className="text-xl font-bold mb-2">Connected with Cartridge</h3>
      
      {loading ? (
        <div className="mb-2 text-[#DADADA]">Loading username...</div>
      ) : username ? (
        <div className="mb-2">
          <span className="text-[#DADADA]">Username: </span>
          <span className="font-semibold">{username}</span>
        </div>
      ) : null}
      
      <div className="mb-4">
        <span className="text-[#DADADA]">Address: </span>
        <span className="font-mono text-sm">{address.substring(0, 10)}...{address.substring(address.length - 8)}</span>
      </div>
      
      <Button 
        onClick={() => disconnect()} 
        variant="destructive"
        className="mt-2"
      >
        Disconnect
      </Button>
    </div>
  );
}

export default CartridgeWalletInfo; 