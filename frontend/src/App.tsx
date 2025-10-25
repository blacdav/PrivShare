import { WagmiProvider } from "wagmi";
import "./App.css";
import { config } from "./utils/web3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Header } from "./components/layout/Header";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import HeroSection from "./components/layout/HeroSection";
import { About } from "./components/layout/About";
import { TryItYourself } from "./components/layout/TryItYourself";
import { Footer } from "./components/layout/Footer";
import HowItWorks from "./components/layout/HowItWorks";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { DashboardOverview } from "./pages/dashboard/Overviewtab";
import { ConsentManagement } from "./pages/dashboard/ConsentManagement";
import { AuditTrail } from "./pages/dashboard/AuditTrail";
import { ControlDetails } from "./pages/dashboard/ControlDetails";
import { DataManagement } from "./pages/dashboard/Data";

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <MantineProvider>
            <Routes>
              {/* Landing Page Route */}
              <Route
                path="/"
                element={
                  <div id="home">
                    <div className="min-h-screen  p-4 relative noise-overlay">
                      <div className="relative z-10">
                        <Header />
                        <HeroSection />
                      </div>
                    </div>
                    <HowItWorks />
                    <About />
                    <TryItYourself />
                    <Footer />
                  </div>
                }
              />

              {/* Dashboard Routes */}
              {/* <Route path="/dashboard" element={<DashboardLayout />}> */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route path="" element={<DashboardOverview />} />
                <Route path="consent" element={<ConsentManagement />} />
                <Route path="audit" element={<AuditTrail />} />
                <Route path="controls" element={<ControlDetails />} />
                <Route path="data" element={<DataManagement />} />
              </Route>
            </Routes>
          </MantineProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Router>
  );
}

export default App;
