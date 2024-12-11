import Image from "next/image";
import { Button } from "../ui/button";

const Hero = () => {
  const heroText = {
    h1Label: "Refining automated payments in Web3",
    text: "One stop solution for subscriptions, giveaways, salaries, SIPs and more automated payments in web3.",
  };
  return (
    <div className="h-[65vh] md:h-screen w-full bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#5b21b6] via-[#0d0019] to-[#0d0019]">
      <div className="flex justify-center items-center flex-col">
        <div className="md:max-w-[50%] text-center pt-24 space-y-4">
          <h1 className="text-white text-5xl md:text-[5rem] md:leading-[6rem] font-bric font-bold">
            {heroText.h1Label}
          </h1>
          <div className="space-y-6">
            <p className="text-[#DADADA] max-w-[85%] mx-auto md:text-2xl">
              {heroText.text}
            </p>
            <div className="flex justify-center gap-x-4">
              <Button>Get Started</Button>
              <Button variant="secondary">Learn More</Button>
            </div>
          </div>
        </div>

        <div className="relative mt-10 md:mt-20">
          <Image
            src="/imgs/wallets.png"
            width={850}
            height={74}
            alt="hero-card"
            className="hidden md:block"
          />
          <Image
            src="/imgs/wallets.png"
            width={350}
            height={200}
            alt="hero-card"
            className="block md:hidden"
          />
        </div>
      </div>
      <div className="relative md:mt-36 md:mx-auto md:max-w-[50%]">
        <Image
          src="/imgs/laptop_phone.png"
          width={1120.8}
          height={654}
          alt="hero-laptop-phone"
          className="hidden md:block"
        />
      </div>
    </div>
  );
};

export default Hero;
