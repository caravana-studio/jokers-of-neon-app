import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";

import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen.tsx";
import { preloadImages } from "./utils/preloadImages.ts";
import { Schema, schema } from "./dojo/typescript/bindings.ts";
import { init } from "@dojoengine/sdk";

async function main() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  root.render(<LoadingScreen />);

  const sdk = await init<Schema>(
    {
        client: {
            rpcUrl: dojoConfig.rpcUrl,
            toriiUrl: dojoConfig.toriiUrl,
            relayUrl: dojoConfig.relayUrl,
            worldAddress: dojoConfig.manifest.world.address,
        },
        domain: {
            name: "WORLD_NAME",
            version: "1.0",
            chainId: "KATANA",
            revision: "1",
        },
    },
    schema
);

  try {
    preloadImages();
    const setupResult = await setup(dojoConfig);
    const queryClient = new QueryClient();
    root.render(
      <DojoProvider value={setupResult}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <Toaster />
            <App sdk={sdk}/>
          </QueryClientProvider>
        </BrowserRouter>
      </DojoProvider>
    );
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

main();
