import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AppTrackingTransparency } from "capacitor-plugin-app-tracking-transparency";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { AppRoutes } from "./AppRoutes";
import { Background } from "./components/Background";
import { Layout } from "./components/Layout";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import ZoomPrevention from "./utils/ZoomPrevention";

function App() {
  useEffect(() => {
    const askForTracking = async () => {
      try {
        const { status } = await AppTrackingTransparency.getStatus();
        if (status === "notDetermined") {
          const result = await AppTrackingTransparency.requestPermission();
          console.log("Tracking permission:", result);
        } else {
          console.log("Tracking already handled:", status);
        }
      } catch (err) {
        console.error("Error checking tracking permission:", err);
      }
    };

    askForTracking();
  }, []);

  return (
    <SettingsProvider
      introSongPath={"music/intro-track.mp3"}
      baseSongPath={"music/game-track.mp3"}
      rageSongPath={"music/rage_soundtrack.mp3"}
    >
      <ZoomPrevention>
        <CardAnimationsProvider>
          <CardDataProvider>
            <GameProvider>
              <PageTransitionsProvider>
                <InformationPopUpProvider>
                  <Background>
                    <Layout>
                      <AnimatePresence mode="wait">
                        <AppRoutes />
                      </AnimatePresence>
                    </Layout>
                  </Background>
                </InformationPopUpProvider>
              </PageTransitionsProvider>
            </GameProvider>
          </CardDataProvider>
        </CardAnimationsProvider>
        <Analytics />
        <SpeedInsights />
      </ZoomPrevention>
    </SettingsProvider>
  );
}

export default App;
