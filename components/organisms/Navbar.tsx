import Image from "next/image";
import ConnectWalletButton from "@/components/atoms/Button";
const Navbar = async () => {
  return (
    <nav className="flex justify-between items-center pr-10 pl-12 py-4 text-sm font-bold text-txt bg-white">
      <Image
        src="/imgs/fundable_logo.png"
        width={104}
        height={38.08}
        alt="logo"
      />

      <div className="flex items-center gap-x-4">
        <ConnectWalletButton />
      </div>
    </nav>
  );
};

export default Navbar;
