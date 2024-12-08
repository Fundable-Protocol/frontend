import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-4 md:py-11 px-8 md:px-16 md:bg-black md:text-white container rounded-2xl">
      <div className="flex justify-between items-center">
        <span>copyright fundable 2024</span>

        <div className="flex gap-x-3 md:gap-x-7">
          <Image
            src="/svgs/telegram.svg"
            width={32}
            height={32}
            alt="telegram"
          />
          <Image src="/svgs/discord.svg" width={32} height={32} alt="discord" />
          <Image src="/svgs/x.svg" width={32} height={32} alt="x" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
