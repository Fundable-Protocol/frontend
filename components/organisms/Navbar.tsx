import Link from "next/link";
import Image from "next/image";
import ConnectWalletButton from "@/components/atoms/Button";

const Navbar = async () => {
  return (
    <nav className="flex justify-between items-center px-4 md:pr-10 md:pl-12 py-4 text-sm font-bold text-txt bg-white">
      <Link href="/" className="max-w-32 h-auto">
        <Image
          priority
          alt="logo"
          width={50}
          height={55}
          className="w-auto h-auto"
          src="/svgs/fundable_logo.svg"
        />
      </Link>

      <ConnectWalletButton />
    </nav>
  );
};

export default Navbar;
