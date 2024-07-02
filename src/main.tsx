import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/generated/setup.ts";
import "./index.css";
import { ErrorScreen } from "./pages/ErrorScreen.tsx";
import { Home } from "./pages/Home.tsx";
import customTheme from "./theme/theme";

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const theme = extendTheme(customTheme);

  root.render(
    <ChakraBaseProvider theme={theme}>
      <Home loading />
    </ChakraBaseProvider>
  );

  try {
    const setupResult = await setup(dojoConfig);
    const queryClient = new QueryClient();
    root.render(
      <DojoProvider value={setupResult}>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <ChakraBaseProvider theme={theme}>
              <Toaster />
              <App />
            </ChakraBaseProvider>
          </QueryClientProvider>
        </BrowserRouter>
      </DojoProvider>
    );
  } catch {
    root.render(
      <ChakraBaseProvider theme={theme}>
        <ErrorScreen />
      </ChakraBaseProvider>
    );
  }
}

init();
