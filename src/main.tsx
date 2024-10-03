import ReactDOM from "react-dom/client";
import { sepolia } from "@starknet-react/chains";
import { QueryClient, QueryClientProvider } from "react-query";
import { jsonRpcProvider, StarknetConfig, voyager } from "@starknet-react/core";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";
import cartridgeConnector from "./cartridgeConnector.tsx";

import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
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

  try {
    preloadImages();
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
                <App />
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
