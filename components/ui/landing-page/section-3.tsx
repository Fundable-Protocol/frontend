import Image from "next/image";

const Section3 = () => {
  const contents = [
    { title: "Create/Import Details", description: "" },
    { title: "Add Addresses", description: "" },
    {
      title: "Mass Payout",
      description:
        "Pay to multiple teams using different tokens in a single transaction.",
    },
    { title: "Accounting", description: "" },
  ];

  return (
    <div className="container text-center">
      <h2 className="text-2xl md:text-[3.125rem] text-[#444444] font-semibold md:font-bold font-bric">
        Super efficient mass payouts
      </h2>
      <p className="text-lg md:text-[1.34rem] md:mt-5 text-[#989898]">
        Transaction batching can help you save up to 90% gas fees
      </p>
      <div className="relative md:mx-auto md:max-w-[50%] mt-[2.54rem]">
        <Image
          src="/imgs/section-3.png"
          width={797.46}
          height={534.6}
          alt="processing-img"
        />
      </div>
      <div className="py-16 md:py-48 pl-8">
        <div className="hidden md:flex w-full h-[1.27px] bg-[#8256FF]  justify-between">
          {contents.map((cnt, i) => (
            <div
              key={`section-3-${i}`}
              className="flex flex-col items-center -m-[6px] bg-[#8256FF] h-[0.79375rem] w-[0.79375rem] rounded-full"
            >
              <div className="space-y-2 mt-5">
                <h3 className="text-[#444444] font-bold text-2xl font-bric text-nowrap hover:text-btn transition-all duration-200">
                  {cnt.title}
                </h3>

                <p className="text-[1.2rem] min-w-[24rem] text-wrap max-w-[32rem]">
                  {cnt.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-between items-center md:hidden h-[60vh] w-[1.27px] bg-[#8256FF]">
          {contents.map((cnt, i) => (
            <div
              key={`section-3-${i}`}
              className="flex flex-col justify-center bg-[#8256FF] h-[0.79375rem] w-[0.79375rem] rounded-full"
            >
              <div className="ml-8 flex flex-col">
                <h3 className="text-[#444444] font-bold text-2xl font-bric text-nowrap hover:text-btn transition-all duration-200">
                  {cnt.title}
                </h3>
                {/* min-w-[24rem] text-wrap max-w-[32rem] */}
                <p className="w-[20rem] text-left">{cnt.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section3;
