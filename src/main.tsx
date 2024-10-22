import { sepolia } from "@starknet-react/chains";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";
import cartridgeConnector from "./cartridgeConnector.tsx";

import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import localI18n from "./i18n.ts";
import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen.tsx";
import { preloadImages } from "./utils/preloadImages.ts";

function rpc() {
  return {
    nodeUrl: import.meta.env.VITE_RPC_URL,
  };
}

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const chains = [sepolia];
  const connectors = [cartridgeConnector];
  const provider = jsonRpcProvider({ rpc });

  root.render(<LoadingScreen />);

  const loadImages = async () => {
    await i18n.loadNamespaces(["traditional-cards", "neon-cards"]);
    preloadImages();
  };

  i18n.on("initialized", loadImages);

  try {
    const setupResult = await setup(dojoConfig);
    const queryClient = new QueryClient();
    root.render(
      <StarknetConfig
        autoConnect
        chains={chains}
        provider={provider}
        connectors={connectors}
        explorer={voyager}
      >
        <DojoProvider value={setupResult}>
          <BrowserRouter>
            <QueryClientProvider client={queryClient}>
              <Toaster />
              <I18nextProvider i18n={localI18n} defaultNS={undefined}>
                <App />
              </I18nextProvider>
            </QueryClientProvider>
          </BrowserRouter>
        </DojoProvider>
      </StarknetConfig>
    );
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
