import { Title } from "@mantine/core";
import VerticalLinearStepper from "./Stepper";

const HowItWorks = () => {
  return (
    <section className="py-16 md:py-24 bg-white" id="docs">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
          <Title
            order={2}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 md:mb-6"
          >
            How PrivShare Works
          </Title>
          <div className="text-lg md:text-xl text-[#000000B8] leading-relaxed">
            A simple, secure way to share files on the blockchain.
          </div>
        </div>
      </div>

      <div className=" px-6">
        <VerticalLinearStepper />
      </div>
    </section>
  );
};

export default HowItWorks;
