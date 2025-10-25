import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { ArrowRight, Copy, Image, X } from "lucide-react";

const steps = [
  {
    label: "Connect Wallet",
    description: `Authenticate with your crypto wallet to get started.`,
  },
  {
    label: "Encrypt & Upload",
    description: "Files are encrypted locally before uploading.",
  },
  {
    label: "Share & Control Access",
    description: `Share your unique decryption key — only keyholders can unlock.`,
  },
];

const mockConnectors = [
  {
    id: "metaMask",
    name: "MetaMask",
    icon: "/metamask-fox.svg",
  },
  {
    id: "walletConnect",
    name: "WalletConnect",
    icon: "/wallet-connect.svg",
  },
  {
    id: "coinbaseWallet",
    name: "Coinbase Wallet",
    icon: "/coinbase-wallet.svg",
  },
];

const ConnectWalletStep = () => {
  return (
    <div className="space-y-4 bg-white rounded-3xl p-4">
      <div className="space-y-3">
        {mockConnectors.map((connector) => (
          <button
            key={connector.id}
            className="w-full flex justify-between bg-[#F6F7F9] rounded-3xl px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors  "
            disabled
          >
            <div className="flex items-center space-x-3">
              <img
                src={connector.icon}
                className="w-6 h-6 rounded-md"
                alt={`${connector.name} wallet icon`}
              />
              <span className="font-medium">{connector.name}</span>
            </div>
            <ArrowRight />
          </button>
        ))}
      </div>
      <a
        className="flex items-center space-x-3 justify-center text-sm text-gray-500 hover:text-gray-700 transition-colors  opacity-50"
        style={{ pointerEvents: "none" }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span>I don't have a wallet</span>
      </a>
    </div>
  );
};

const EncryptUploadStep = () => {
  return (
    <div className="space-y-4">
      <div className="border-[1.5px] border-[#00B495] bg-white rounded-2xl p-4   ">
        <div className="flex items-center">
          <div>
            <div className=" flex items-center text-[#0B0B0B] font-bold text-2xl ">
              Media Upload
            </div>
            <p className="text-[#6D6D6D] font-normal">Encrypting file...</p>
          </div>
          <X className="ml-auto " />
        </div>
        <div className="lg:flex  p-3 items-center text-center lg:justify-between space-y-3 ">
          <div className="text-[#0B0B0B] font-normal text-2xl ">
            https://sharefile.xyz/file.jpg
          </div>
          <button className="text-[#858585] font-semibold bg-[#CECECE] rounded-2xl px-3 py-1 text-center">
            Upload
          </button>
        </div>
        <div className="w-full border-[1.5px] rounded-lg border-[#E7E7E7] p-3">
          <div className="flex  overflow-hidden  items-center">
            <div className="flex items-center justify-center bg-gray-50 p-4 min-h-[80px]">
              <Image className="w-8 h-8 text-gray-600" />
            </div>

            <div className="flex-1 p-4 flex flex-col justify-center space-y-1">
              <div className="text-[#0B0B0B] font-semibold text-lg leading-tight">
                woman-portrait.jpg
              </div>
              <div className="text-[#6D6D6D] font-normal text-sm">
                500kb • JPEG
              </div>
            </div>
            <X className="border-2  border-[#858585] text-[#858585] bg-[#CECECE] rounded-full font-semibold " />
          </div>
          <div className="flex items-center space-x-3 mt-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-[#00B495] h-2 rounded-full transition-all duration-300"
                style={{ width: "60%" }}
              ></div>
            </div>
            <span className="text-sm font-medium text-[#6D6D6D] whitespace-nowrap">
              60%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareControlStep = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 ">
        <div>
          <div className=" flex items-center text-[#0B0B0B] font-bold text-2xl ">
            Generate Key
          </div>
          <p className="text-[#6D6D6D] font-normal">
            Only those with this key can unlock your file
          </p>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 p-4 border-[1.5px] border-[#00B495] rounded-lg">
          <div className="bg-white rounded-lg p-3 flex-1 min-w-0">
            <div className="text-gray-500 font-normal truncate text-center lg:text-left">
              Decryption <span className="text-[#00B495]">Key</span>
              <span className="text-[#00B495]">8</span>f2b-
              <span className="text-[#00B495]">24</span>ac-
              <span className="text-[#00B495]">89</span>df
            </div>
          </div>

          <button className="bg-[#00B495] text-white px-6 py-3 rounded-2xl flex items-center justify-center space-x-2 whitespace-nowrap flex-shrink-0 hover:bg-[#8A5FD6] transition-colors duration-200">
            <span>Copy key</span>
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const stepComponents = [
  <ConnectWalletStep key="connect" />,
  <EncryptUploadStep key="encrypt" />,
  <ShareControlStep key="share" />,
];

export default function VerticalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "row" },
        alignItems: "center",
        gap: 4,
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      <Box sx={{ flex: 1, maxWidth: { xs: "100%", lg: 400 } }}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((step, index) => (
            <Step key={step.label}>
              <StepLabel
                optional={
                  index === steps.length - 1 ? (
                    <Typography variant="caption">Last step</Typography>
                  ) : null
                }
              >
                {step.label}
              </StepLabel>
              <StepContent>
                <Typography color="#000000">{step.description}</Typography>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                    style={{
                      backgroundColor: "#00B495",
                    }}
                  >
                    {index === steps.length - 1 ? "Finish" : "Continue"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                    style={{
                      color: "black",
                    }}
                  >
                    Back
                  </Button>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
          <Paper square elevation={0} sx={{ p: 3 }}>
            <Typography>All steps completed - you&apos;re finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
              Reset
            </Button>
          </Paper>
        )}
      </Box>

      <Box
        sx={{
          flex: 1,
          display: { xs: "none", sm: "flex" },
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={2}
          sx={{
            p: 4,
            width: "100%",
            maxWidth: { lg: 600 },
            backgroundColor: "#00B49529",
            borderRadius: "8px",
          }}
        >
          {stepComponents[activeStep]}
        </Paper>
      </Box>
    </Box>
  );
}
