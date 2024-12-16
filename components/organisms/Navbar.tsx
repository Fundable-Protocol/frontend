import Image from "next/image";
import ConnectWalletButton from "@/components/atoms/ConnectWalletButton";
const Navbar = async () => {
  return (
    <nav className="flex justify-between items-center pr-10 pl-12 py-4 text-sm font-bold text-txt bg-white">
      <Image
        src="/svgs/fundable_logo.svg"
        width={10}
        height={32}
        alt="logo"
        className="w-auto h-auto"
      />

      <div className="flex items-center gap-x-4">
        <ConnectWalletButton />
      </div>
    </nav>
  );
};

export default Navbar;