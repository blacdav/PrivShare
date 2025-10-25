import { useWallet } from "../../hooks/useWallet";
import { Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { ArrowRight, Wallet } from "lucide-react";

export const ConnectWalletButton: React.FC = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const { isConnected, address, connectors, connectWallet, disconnectWallet } =
    useWallet();

  const handleConnect = async (connectorId: string) => {
    console.log(connectorId);
    try {
      await connectWallet(connectorId);
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={handleDisconnect}
          className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  const CONNECTOR_CONFIG = {
    phantom: {
      icon: "/phantom.svg",
      keywords: ["phantom"],
    },
    metamask: {
      icon: "/metamask-fox.svg",
      keywords: ["metamask"],
    },
    walletconnect: {
      icon: "/wallet-connect.svg",
      keywords: ["walletconnect", "wallet connect"],
    },
    coinbase: {
      icon: "/coinbase-wallet.svg",
      keywords: ["coinbase", "coinbase wallet"],
    },
  } as const;

  const getConnectorIcon = (connectorId: string) => {
    const id = connectorId.toLowerCase();

    const matchedConnector = Object.values(CONNECTOR_CONFIG).find((connector) =>
      connector.keywords.some((keyword) => id.includes(keyword))
    );

    const iconSrc = matchedConnector?.icon || "/default-wallet.svg";

    return (
      <img
        src={iconSrc}
        alt={`${connectorId} logo`}
        className="w-6 h-6 rounded-md"
      />
    );
  };

  return (
    <div className="relative">
      <button
        onClick={open}
        className="relative inline-block p-px border-2 font-medium leading-6 text-white cursor-pointer rounded-3xl transition-transform duration-300 ease-in-out hover:scale-105 active:scale-95"
      >
        <span className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#BCB1FF] via-[#A396FF] to-[#8A7AFF] p-[2px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>

        <span className="relative z-10 block px-6 py-2 rounded-3xl bg-[#00B495] group-hover:bg-white transition-colors duration-500">
          <span className="text-white group-hover:text-[#BCB1FF] transition-colors duration-500">
            Connect Wallet
          </span>
        </span>
      </button>

      <Modal
        opened={opened}
        onClose={close}
        centered
        withCloseButton={false}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
      >
        <div>
          <h1 className="font-bold text-2xl"> Connect wallet</h1>
          <div className="text-xs font-normal">
            Get started by connecting your preferred wallet below
          </div>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector.id)}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              {connector.name}
            </button>
          ))}
        </div>
      </Modal>

      <Modal.Root opened={opened} onClose={close} centered>
        <Modal.Overlay backgroundOpacity={0.55} blur={3} />
        <Modal.Content
          style={{
            borderRadius: "36px",
          }}
        >
          <Modal.Header>
            <div>
              <h1 className="font-bold text-2xl"> Connect wallet</h1>
              <div className="text-xs font-normal">
                Get started by connecting your preferred wallet below
              </div>
            </div>
            <Modal.CloseButton
              style={{
                borderRadius: "12px",
                padding: "4px",
                backgroundColor: "#F6F7F9",
              }}
            />
          </Modal.Header>
          <Modal.Body>
            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => handleConnect(connector.id)}
                  className="w-full flex  justify-between bg-[#F6F7F9] rounded-3xl px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100  transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    {getConnectorIcon(connector.id)}
                    <span>{connector.name}</span>
                  </div>
                  <ArrowRight width={20} />
                </button>
              ))}
              <a
                className="flex space-x-4 justify-center"
                href="https://metamask.io/download"
                target="_blank"
              >
                <Wallet />
                <span>I dont have a wallet</span>
              </a>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};
