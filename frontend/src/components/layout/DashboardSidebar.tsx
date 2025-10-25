import {
  BarChart3,
  FileText,
  FileUp,
  Menu,
  Settings,
  Shield,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navigation = [
  { name: "Overview", href: "/dashboard/", Icon: BarChart3 },
  { name: "Consent Management", href: "/dashboard/consent", Icon: Shield },
  { name: "Audit Trail", href: "/dashboard/audit", Icon: FileText },
  { name: "Control Details", href: "/dashboard/controls", Icon: Settings },
  { name: "Data", href: "/dashboard/data", Icon: FileUp },
];

export const DashboardSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden fixed z-50 top-4 left-4 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50 transition-all"
        onClick={toggleSidebar}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40 h-full bg-white shadow-lg
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0 md:shadow-sm
          w-64
        `}
      >
        {/* Logo */}
        <div className="flex items-center px-6 py-5 ">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-[#00B495] rounded-lg flex items-center justify-center">
              <img src="/icon-dark.svg" alt="" className="h-6" />
            </div>
            <Link to={"/"}>
              <h1 className="ml-3 text-xl font-bold text-gray-800">
                privshare
              </h1>
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-3xl
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-[#00B495] text-black bg-opacity-10 shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => setIsOpen(false)}
                >
                  <item.Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        {/* <div className="absolute bottom-0 left-0 right-0 p-4  bg-gray-50">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-[#00B495] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                User Account
              </p>
              <p className="text-xs text-gray-500 truncate">Connected</p>
            </div>
          </div>
        </div> */}
      </div>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/10 backdrop-blur-sm z-30 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
