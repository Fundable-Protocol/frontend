import missingWalletImg from "../../../public/svgs/missingWallet.svg";

import Image from "next/image";

const TokenDistributionWallet = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bric font-bold text-white mb-8">
            Token Distribution
          </h1>
          <div className="p-8 rounded-lg bg-[#0d0019] bg-opacity-50 border border-[#5b21b6] border-opacity-20 flex flex-col items-center justify-center text-xl">
            <Image
              src={missingWalletImg}
              height={128}
              width={128}
              priority
              alt="Wallet Required"
              className="h-auto w-auto"
            />
            <h2 className="font-inter text-white font-bold mt-8">
              Wallet Not Connected
            </h2>
            <p className="text-[#DADADA] my-4 max-w-xs">
              Please connect your wallet to use the distribution feature
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDistributionWallet;
