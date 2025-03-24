import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-4 md:py-11 px-8 md:px-16 md:bg-black md:text-white container rounded-2xl">
      <div className="flex justify-between items-center">
        <span>copyright fundable {new Date().getFullYear()}</span>

        <div className="flex gap-x-3 md:gap-x-7">
          <a href="https://t.me/fundable_finance" target="_blank" rel="noopener noreferrer">
            <Image
              src="/svgs/telegram.svg"
              width={32}
              height={32}
              alt="telegram"
            />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <Image src="/svgs/discord.svg" width={32} height={32} alt="discord" />
          </a>
          <a href="https://x.com/fundableHQ" target="_blank" rel="noopener noreferrer">
            <Image src="/svgs/x.svg" width={32} height={32} alt="x" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
