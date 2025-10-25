export const TryItYourself = () => {
  return (
    <section className="py-16 md:py-24 relative min-h-[600px] flex items-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: `url('/gradient.svg')`,
        }}
      ></div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left text-[#111111]">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 leading-tight">
              Try It <span className="text-[#00B495]">Yourself</span>
            </h2>
            <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-lg mx-auto lg:mx-0 text-[#7A7A7A]">
              Experience how PrivShare encrypts and protects your files — all in
              your browser, no setup needed.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md lg:max-w-lg">
            <div className="bg-white rounded-[8px] shadow-xl border border-[#BCB1FF] p-6 md:p-8">
              <div className="text-start space-y-6 border border-[#00B495] rounded-3xl p-4 md:p-6">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-[#0B0B0B] mb-2 md:mb-3">
                    Media upload
                  </h3>
                  <p className="text-gray-600 text-sm md:text-base">
                    Add your documents, you can upload up to 5 files max.
                  </p>
                </div>

                <div className="border border-[#00B495] rounded-xl hover:border-[#BCB1FF] transition-colors duration-300 cursor-pointer">
                  <div className="flex flex-col xs:flex-row xs:flex-wrap items-start xs:items-center gap-2 p-2">
                    <p className="text-sm font-normal text-[#0B0B0B] break-words flex-1 min-w-0 w-full xs:w-auto">
                      https://sharefile.xyz/file.jpg
                    </p>
                    <button className="px-4 py-2 text-sm font-semibold bg-[#00B495] text-white border border-[#BCB1FF] rounded-2xl hover:bg-[#BCB1FF] hover:text-white transition-colors duration-300 whitespace-nowrap flex-shrink-0 min-w-[100px] w-full xs:w-auto justify-center xs:justify-start">
                      Upload
                    </button>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-gray-500 text-center">
                  Files are encrypted before uploading to the blockchain
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
