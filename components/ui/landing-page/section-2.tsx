import InternalArrowIcon from "@/public/svgs/internal-arrow";
import ShieldIcon from "@/public/svgs/shield";
import LinkIcon from "@/public/svgs/link";

const Section2 = () => {
  const contents = [
    {
      Icon: InternalArrowIcon,
      header: "Linear Streaming",
      description:
        "Create and manage continuous payment streams with precise per-second rates",
    },
    {
      Icon: ShieldIcon,
      header: "Quadratic Funding",
      description: "Amplify community preferences with democratic fund matching",
    },
    {
      Icon: LinkIcon,
      header: "Mass Distribution",
      description:
        "Distribute resources equitably through transparent giveaway mechanisms with a single transaction",
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
