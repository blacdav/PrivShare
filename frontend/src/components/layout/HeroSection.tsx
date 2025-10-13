import { useWallet } from "../../hooks/useWallet";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";

const HeroSection = () => {
  const { isConnected } = useWallet();

  return (
    <section className="min-h-screen flex items-center px-4 py-12 md:py-0">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Share files.
              <br />
              Stay
              <span className="text-[#BCB1FF]"> Private.</span>
            </h1>

            <p className="text-lg md:text-xl text-white max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Upload encrypted files <span className="text-[#BCB1FF]">to</span>{" "}
              the blockchain. Only those{" "}
              <span className="text-[#BCB1FF]">with</span> your{" "}
              <span className="text-[#BCB1FF]">key</span> can unlock them.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <div className="self-center">
                <ConnectWalletButton />
              </div>
            </div>
          </div>

          {isConnected && (
            <div className="flex-1 w-full max-w-md lg:max-w-lg">
              <div className="bg-white rounded-[8px] shadow-xl border border-[#BCB1FF] p-6 md:p-8 ">
                <div className="text-start font-bold space-y-4 border border-[#A77BFF] rounded-3xl p-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#0B0B0B] mb-2">
                      Media upload
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Add your documents, you can upload up to 5 files max.
                    </p>
                  </div>

                  <div className="border border-[#A77BFF] rounded-xl hover:border-[#BCB1FF] transition-colors duration-300 cursor-pointer">
                    <div className="flex flex-col xs:flex-row xs:flex-wrap items-start xs:items-center gap-2 p-2">
                      <p className="text-sm font-normal text-[#0B0B0B] break-words flex-1 min-w-0 w-full xs:w-auto">
                        https://sharefile.xyz/file.jpg
                      </p>
                      <button className="px-4 py-2 text-sm font-semibold bg-[#A77BFF] text-white border border-[#BCB1FF] rounded-2xl hover:bg-[#BCB1FF] hover:text-white transition-colors duration-300 whitespace-nowrap flex-shrink-0 min-w-[100px] w-full xs:w-auto justify-center xs:justify-start">
                        Upload
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Files are encrypted before uploading to the blockchain
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
