import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App.tsx";

import "./index.css";
import { LoadingScreen } from "./pages/LoadingScreen.tsx";
import { preloadImages } from "./utils/preloadImages.ts";

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  root.render(<LoadingScreen />);

  try {
    preloadImages();
    const queryClient = new QueryClient();
    root.render(
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Toaster />
          <App />
        </QueryClientProvider>
      </BrowserRouter>
    );
  } catch (e) {
    console.error(e);
    root.render(<LoadingScreen error />);
  }
}

init();
