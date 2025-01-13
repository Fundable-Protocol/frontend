import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

import laptopPhoneImage from "../../public/imgs/laptop_phone.png";
import walletsImg from "../../public/svgs/wallets.svg";

const Hero = () => {
  const heroText = {
    h1Label: "Refining automated payments in Web3",
    text: "One stop solution for subscriptions, giveaways, salaries, SIPs and more automated payments in web3.",
  };
  return (
    <header className="w-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019] rounded-xl px-8 xl:px-0">
      <div className="flex justify-center items-center py-24 xl:pb-0 flex-col text-balance">
        <div className="md:max-w-4xl text-center space-y-4">
          <h1 className="text-white text-5xl md:text-[5rem] md:leading-[6rem] font-bric font-bold">
            {heroText.h1Label}
          </h1>

          <div className="space-y-6">
            <p className="text-[#DADADA] max-w-xl md:max-w-[85%] mx-auto md:text-2xl">
              {heroText.text}
            </p>
            <div className="flex justify-center gap-x-4">
              <Link href="/distribute">
                <Button>Get Started</Button>
              </Link>
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>
        </div>

        <div className="relative m-10 md:mt-20 xs:mb-0">
          <Image
            src={walletsImg}
            width={850}
            height={74}
            alt="hero-card"
            priority
            className="hidden md:block h-auto w-auto"
          />
          <Image
            src={walletsImg}
            width={50}
            height={50}
            alt="hero-card"
            priority
            className="block max-w-xs md:hidden h-auto w-auto"
          />
        </div>
      </div>

      <div className="relative aspect-[3/1] hidden xl:block">
        <Image
          src={laptopPhoneImage}
          priority
          fill
          alt="hero-laptop-phone"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain translate-y-52"
        />
      </div>
    </header>
  );
};

export default Hero;
