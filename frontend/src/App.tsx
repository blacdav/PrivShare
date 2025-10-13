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

const queryClient = new QueryClient();
function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MantineProvider>
          <div id="home">
            <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed bg-[url('/hero-bg-mobile-noise.png')] md:bg-[url('/hero-bg-noise.png')] p-4 relative noise-overlay">
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
        </MantineProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
