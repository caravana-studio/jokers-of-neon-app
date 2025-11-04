import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AppTrackingTransparency } from "capacitor-plugin-app-tracking-transparency";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { AppRoutes } from "./AppRoutes";
import { Background } from "./components/Background";
import { Layout } from "./components/Layout";
import { useDojo } from "./dojo/DojoContext";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { SeasonPassProvider } from "./providers/SeasonPassProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import { claimLives } from "./queries/claimLives";
import ZoomPrevention from "./utils/ZoomPrevention";
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { useUsername } from "./dojo/utils/useUsername";
import { getRevenueCatApiKey } from "./utils/getRevenueCatApiKey";

function App() {
  const {
    account: { account },
  } = useDojo();

  const username = useUsername()

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

    claimLives({ playerAddress: account.address }).catch(() => {});

    askForTracking();

    (async function () {
      await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
      await Purchases.configure({
        apiKey: getRevenueCatApiKey(),
        appUserID: username,
      });
    })();

  }, []);


  return (
    <SettingsProvider>
      <SeasonPassProvider>
        <ZoomPrevention>
          <CardAnimationsProvider>
            <CardDataProvider>
              <GameProvider>
                <PageTransitionsProvider>
                  <InformationPopUpProvider>
                    <AudioPlayerProvider
                      introSongPath={"/music/intro-track.mp3"}
                      baseSongPath={"/music/game-track.mp3"}
                      rageSongPath={"/music/rage_soundtrack.mp3"}
                    >
                      <Background>
                        <Layout>
                          <AnimatePresence mode="wait">
                            <AppRoutes />
                          </AnimatePresence>
                        </Layout>
                      </Background>
                    </AudioPlayerProvider>
                  </InformationPopUpProvider>
                </PageTransitionsProvider>
              </GameProvider>
            </CardDataProvider>
          </CardAnimationsProvider>
          <Analytics />
          <SpeedInsights />
        </ZoomPrevention>
      </SeasonPassProvider>
    </SettingsProvider>
  );
}

export default App;
