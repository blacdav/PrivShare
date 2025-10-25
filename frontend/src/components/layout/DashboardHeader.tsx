import React from "react";
import { ConnectWalletButton } from "../web3/ConnectWalletButton";

export const DashboardHeader: React.FC = () => {
  return (
    <header className="bg-white shadow-sm ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-primary"></h1>
          </div>

          <div className="flex-shrink-0">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    </header>
  );
};
