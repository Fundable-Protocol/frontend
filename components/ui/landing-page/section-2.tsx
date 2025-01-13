import InternalArrowIcon from "@/public/svgs/internal-arrow";
import ShieldIcon from "@/public/svgs/shield";
import LinkIcon from "@/public/svgs/link";

const Section2 = () => {
  const contents = [
    {
      Icon: InternalArrowIcon,
      header: "Scalability",
      description:
        "Process thousands of transactions per second with STARK proofs",
    },
    {
      Icon: ShieldIcon,
      header: "Security",
      description: "Benefit from mathematical proof-based security",
    },
    {
      Icon: LinkIcon,
      header: "Composability",
      description:
        "Build and connect with other Starknet applications seamlessly",
    },
  ];

  return (
    <div className="container md:py-20 xl:px-12">
      <h2 className="text-4xl md:text-7xl md:leading-[5.6rem] text-[#444444] font-bric text-center md:text-left">
        Our Recipe <br className="hidden md:block" /> For Quick Success
      </h2>
      <div className="grid-view mt-10 gap-8">
        {contents.map(({ Icon, description, header }, i) => (
          <div
            className="group border rounded-xl shadow-lg flex flex-col gap-y-8 md:gap-y-16 pl-6 py-8 md:py-16 bg-white hover:bg-[#8256FF] transition-colors duration-300"
            key={`section-two-content-` + i}
          >
            <Icon className="text-black group-hover:text-white transition-colors duration-300" />
            <div className="space-y-3 md:space-y-4">
              <h2 className="font-bric text-3xl md:text-5xl group-hover:text-white transition-colors duration-300">
                {header}
              </h2>
              <p className="text-lg group-hover:text-gray-300 transition-colors duration-300 max-w-[85%]">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Section2;
