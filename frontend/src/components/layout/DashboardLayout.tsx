import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";
export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <DashboardHeader />
      <div className="flex">
        <DashboardSidebar />
        <main className="flex-1 p-6 md:blur-0 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
