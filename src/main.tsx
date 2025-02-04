import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";

import i18n from "i18next";
import { I18nextProvider } from "react-i18next";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/setup.ts";
import localI18n from "./i18n.ts";
import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen.tsx";
import { StarknetProvider } from "./providers/StarknetProvider.tsx";
import { preloadSpineAnimations } from "./utils/preloadAnimations.ts";
import { preloadImages } from "./utils/preloadImages.ts";
import { registerServiceWorker } from "./utils/registerServiceWorker.ts";

const I18N_NAMESPACES = [
  "game",
  "rage",
  "home",
  "traditional-cards",
  "neon-cards",
  "store",
  "effects",
  "tutorials",
  "itermediate-screens",
  "plays",
  "loot-boxes",
];

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  let promises = [];

  root.render(<LoadingScreen />);

  promises.push(i18n.loadNamespaces(I18N_NAMESPACES));

  registerServiceWorker();

  try {
    const setupPromise = setup(dojoConfig);
    promises.push(setupPromise);
    const setupResult = await setupPromise;

    Promise.all(promises).then(() => {
      const queryClient = new QueryClient();
      preloadImages();
      preloadSpineAnimations();
      root.render(
        <StarknetProvider>
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
        </StarknetProvider>
      );
    });
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
