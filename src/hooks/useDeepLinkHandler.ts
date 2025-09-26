import { useEffect } from "react";
import { App } from "@capacitor/app";
import { PluginListenerHandle } from "@capacitor/core";
import SessionConnector from "@cartridge/connector/session";

/**
 * A robust hook to handle deep link redirects for wallet authentication.
 * It handles both "cold start" (app was terminated) and "warm start" (app was in background) scenarios.
 */
export const useDeepLinkHandler = (controller: SessionConnector | null) => {
  const handleUrl = (url: string) => {
    console.log("Deep link processed by handleUrl:", url);

    // Use a short timeout to ensure the rest of the app, including the
    // controller, has had a moment to initialize after a cold start.
    setTimeout(() => {
      if (controller) {
        try {
          console.log(
            "Attempting to finalize connection via controller.connect()"
          );
          // This "nudge" tells the SessionConnector to wake up.
          // It will detect the redirect state and finalize the login.
          controller.connect();
        } catch (error) {
          console.error("Error finalizing connection after redirect:", error);
        }
      } else {
        console.warn("Deep link handled, but controller was not available.");
      }
    }, 500); // A 500ms delay is usually sufficient.
  };

  useEffect(() => {
    if (!controller) {
      return;
    }

    let listenerHandle: PluginListenerHandle | null = null;

    const setupListeners = async () => {
      // 1. Check if the app was launched from a URL (handles the "cold start" race condition).
      const launchUrl = await App.getLaunchUrl();
      if (launchUrl && launchUrl.url) {
        handleUrl(launchUrl.url);
      }

      // 2. Add the listener for any future deep links while the app is running.
      listenerHandle = await App.addListener("appUrlOpen", (event) => {
        handleUrl(event.url);
      });
    };

    setupListeners();

    // Cleanup function to remove the listener when the component unmounts.
    return () => {
      if (listenerHandle) {
        listenerHandle.remove();
      }
    };
  }, [controller]);
};
