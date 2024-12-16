import Image from "next/image";
import ConnectWalletButton from "@/components/atoms/Button";
import { ConnectWallet } from "@/component_/ConnectWallet";
import Link from "next/link";

const Navbar = async () => {
  return (
    <nav className="flex justify-between items-center pr-10 pl-12 py-4 text-sm font-bold text-txt bg-white">
      <Link href="/">
        <Image
          src="/imgs/fundable_logo.png"
          width={104}
          height={38.08}
          alt="logo"
        />
      </Link>

      <div className="flex items-center gap-x-4">
        <Link href="/distribute">
          <ConnectWalletButton />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
