import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { dojoConfig } from "../dojoConfig.ts";
import App from "./App.tsx";
import { DojoProvider } from "./dojo/DojoContext.tsx";
import { setup } from "./dojo/generated/setup.ts";
import "./index.css";
import { Toaster } from 'sonner'

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const setupResult = await setup(dojoConfig);
  const queryClient = new QueryClient();

  root.render(
    <DojoProvider value={setupResult}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Toaster/>
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    </DojoProvider>
  );
}

init();
