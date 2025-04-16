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
    <header className="w-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019] rounded-xl px-4 sm:px-6 md:px-8 xl:px-12 overflow-hidden">
      <div className="flex justify-center items-center py-12 sm:py-16 md:py-20 lg:py-24 xl:pb-0 flex-col text-balance">
        <div className="w-full max-w-screen-lg text-center space-y-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-[5rem] lg:leading-[6rem] font-bric font-bold">
            {heroText.h1Label}
          </h1>

          <div className="space-y-4 sm:space-y-6">
            <p className="text-[#DADADA] text-base sm:text-lg md:text-xl lg:text-2xl max-w-xl md:max-w-[85%] mx-auto">
              {heroText.text}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-y-3 sm:gap-y-0 sm:gap-x-4">
              <Link href="/distribute">
                <Button className="w-full sm:w-auto">Get Started</Button>
              </Link>
              <Button variant="secondary" className="w-full sm:w-auto">Learn More</Button>
            </div>
          </div>
        </div>

        <div className="relative mt-8 sm:mt-10 md:mt-16 lg:mt-20 w-full flex justify-center">
          {/* Large screens */}
          <Image
            src={walletsImg}
            width={850}
            height={74}
            alt="hero-card"
            priority
            className="hidden md:block h-auto max-w-full"
          />
          {/* Small screens */}
          <Image
            src={walletsImg}
            width={350}
            height={50}
            alt="hero-card"
            priority
            className="block md:hidden h-auto max-w-full px-4"
          />
        </div>
      </div>

      <div className="relative mt-10 sm:mt-16 aspect-[3/1] hidden lg:block">
        <Image
          src={laptopPhoneImage}
          priority
          fill
          alt="hero-laptop-phone"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw"
          className="object-contain translate-y-1/3 md:translate-y-1/4 lg:translate-y-1/5 xl:translate-y-52"
        />
      </div>
    </header>
  );
};

export default Hero;
