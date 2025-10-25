import { ConnectWalletButton } from "../web3/ConnectWalletButton";
import { Drawer, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Navitems } from "./Navitems";
import { FileSpreadsheet, Home, Info } from "lucide-react";

export const Header: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <header className="w-full p-0  left-0   ">
      <div className="">
        <div className=" flex items-center justify-between">
          <div className="flex justify-center  space-x-2 ">
            <img src="/icon-dark.svg" alt="" className="h-10" />
            <h1 className="text-2xl font-semibold text-black">privshare</h1>
          </div>
          <nav className="hidden  md:flex space-x-8">
            <Navitems />
          </nav>

          <div className="md:block hidden">
            <ConnectWalletButton />
          </div>

          <div className="md:hidden">
            <Drawer
              opened={opened}
              onClose={close}
              position="left"
              size="65%"
              overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
              withCloseButton={false}
              styles={{
                content: {
                  backgroundColor: "#1a1a1a",
                  display: "flex",
                  flexDirection: "column",
                  borderTopRightRadius: "12px",
                },
              }}
            >
              <div className="flex    space-x-2 ">
                <img src="/icon.svg" alt="" className="h-10" />
                <h1 className="text-2xl font-semibold text-white">privshare</h1>
              </div>
              <nav className="flex flex-col space-y-8 mt-4 mb-auto  ">
                <a
                  href="#home"
                  className="hover:text-[#BCB1FF] px-6 py-2 hover:bg-white w-fit text-white rounded-3xl transition-colors  space-x-2 inline-flex whitespace-nowrap"
                >
                  <Home />
                  <span className="text-base sm:text-sm xs:text-xs">Home</span>
                </a>
                <a
                  href="#docs"
                  className="hover:text-[#BCB1FF] px-6 py-2 hover:bg-white w-fit text-white rounded-3xl transition-colors  space-x-2 inline-flex whitespace-nowrap"
                >
                  <FileSpreadsheet />
                  <span className="text-base sm:text-sm xs:text-xs">Docs</span>
                </a>
                <a
                  href="#about"
                  className="hover:text-[#BCB1FF] px-6 py-2 hover:bg-white w-fit text-white rounded-3xl transition-colors space-x-2 inline-flex whitespace-nowrap"
                >
                  <Info />
                  <span className="text-base sm:text-sm xs:text-xs">About</span>
                </a>
              </nav>
              <div className="mt-5">
                <ConnectWalletButton />
              </div>
            </Drawer>

            <Burger color="#000000" variant="default" onClick={open} />
          </div>
        </div>
      </div>
    </header>
  );
};
