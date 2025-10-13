import { Cloud, Earth, Lock, Zap } from "lucide-react";

export const About = () => {
  const features = [
    {
      number: "01",
      title: "End-to-End Encryption",
      description:
        "Only the person with your unique decryption key can open it — not even PrivShare can peek.",
      icon: Lock,
    },
    {
      number: "02",
      title: "On-chain Transparency",
      description:
        "Every time someone accesses a shared file, it’s recorded on the blockchain as a public 'receipt.'",
      icon: Earth,
    },
    {
      number: "03",
      title: "Decentralized Storage",
      description:
        "That means no central authority can take your data down, lock you out, or spy on your uploads.",
      icon: Cloud,
    },
    {
      number: "04",
      title: "Instant Decryption Access",
      description:
        "When someone with the right key tries to open your file, it decrypts instantly in their browser.",
      icon: Zap,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white" id="about">
      <div className="  left-[-4rem] top-[100rem] absolute ">
        <img
          src="/shield.png"
          alt="Background decoration"
          className="w-full h-full object-cover object-left-bottom lg:object-contain lg:object-left-bottom"
        />
      </div>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111111] mb-4 md:mb-6">
            Built <span className="text-[#A77BFF]">for</span> Privacy, Backed{" "}
            <span className="text-[#A77BFF]">by</span> Blockchain.
          </h2>
          <p className="text-lg md:text-xl text-[#7A7A7A] leading-relaxed">
            No central servers. No hidden access. Just you and your key.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 md:p-8 border border-[#A77BFF] hover:border-[#BCB1FF] transition-all duration-300 hover:shadow-xl ${
                index === 0
                  ? "bg-white/80 backdrop-blur-sm lg:bg-white/70 lg:backdrop-blur-[1px]"
                  : "bg-white"
              }`}
            >
              <div className="w-12 h-12  rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#BCB1FF] transition-colors duration-300">
                <div className="text-[#A77BFF] group-hover:text-white transition-colors duration-300">
                  <feature.icon />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-[#A77BFF] group-hover:text-[#111111] transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-[#3D3D3D] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
