import ReactDOM from "react-dom/client";
import { flushSync } from "react-dom";

import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import i18n from "i18next";
import localI18n from "../i18n";
import "../index.css";
import customTheme from "../theme/theme";

const I18N_NAMESPACES = ["intermediate-screens", "game", "migrate"];
const STARTUP_PRELOAD_TIMEOUT_MS = 5000;

const withStartupTimeout = (promise: Promise<unknown>) =>
  Promise.race([
    promise,
    new Promise((resolve) => {
      window.setTimeout(resolve, STARTUP_PRELOAD_TIMEOUT_MS);
    }),
  ]);

const LoadingFallback = ({ text }: { text: string }) => (
  <div
    style={{
      alignItems: "center",
      background: "#05050A",
      color: "white",
      display: "flex",
      fontFamily: "Oxanium, sans-serif",
      height: "100svh",
      justifyContent: "center",
      width: "100%",
    }}
  >
    {text}
  </div>
);

async function preloadRuntimeConfig() {
  const [
    { preloadSlotInstance },
    { preloadGameApiUrl },
    { preloadCurrentSeasonId },
    { preloadManifest },
  ] = await Promise.all([
    import("../config/cartridgeUrls"),
    import("../config/gameApiUrl"),
    import("../constants/season"),
    import("../dojo/getManifest"),
  ]);

  await withStartupTimeout(
    Promise.allSettled([
      preloadGameApiUrl(),
      preloadSlotInstance(),
      preloadManifest(),
      preloadCurrentSeasonId(),
    ]),
  );
}

async function init() {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("React root not found");
  const root = ReactDOM.createRoot(rootElement);
  const theme = extendTheme(customTheme);

  flushSync(() => {
    root.render(<LoadingFallback text="Loading..." />);
  });

  try {
    await preloadRuntimeConfig();

    const [{ MigrateProvidersApp }] = await Promise.all([
      import("./MigrateProvidersApp"),
      i18n.loadNamespaces(I18N_NAMESPACES),
    ]);

    flushSync(() => {
      root.render(
        <MigrateProvidersApp
          fadeInDelay={0.2}
          theme={theme}
        />,
      );
    });
  } catch (error) {
    console.error(error);
    flushSync(() => {
      root.render(
        <LoadingFallback
          text={`${localI18n.t("loading-screen.error", {
            ns: "intermediate-screens",
            defaultValue: "Error loading the game",
          })}: ${String(error)}`}
        />,
      );
    });
  }
}

init();
