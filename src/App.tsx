import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AppTrackingTransparency } from "capacitor-plugin-app-tracking-transparency";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createProfile, fetchProfile } from "./api/profile";
import { AppRoutes } from "./AppRoutes";
import { Background } from "./components/Background";
import { Layout } from "./components/Layout";
import { useDojo } from "./dojo/DojoContext";
import { useGameActions } from "./dojo/useGameActions";
import { useUsername } from "./dojo/utils/useUsername";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { LightningAnimationProvider } from "./providers/LightningAnimationProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { RevenueCatProvider } from "./providers/RevenueCatProvider";
import { SeasonPassProvider } from "./providers/SeasonPassProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import ZoomPrevention from "./utils/ZoomPrevention";

function App() {
  const {
    account: { account },
  } = useDojo();

  const username = useUsername();

  const { claimLives } = useGameActions();

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

    claimLives().catch(() => {});

    fetchProfile(account.address).then((profile) => {
      if (profile.username === "" && username) {
        createProfile(account.address, username, 1);
      }
    });

    askForTracking();
  }, []);

  return (
    <RevenueCatProvider>
      <SeasonPassProvider>
        <SettingsProvider>
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
                          <LightningAnimationProvider>
                            <Layout>
                              <AnimatePresence mode="wait">
                                <AppRoutes />
                              </AnimatePresence>
                            </Layout>
                          </LightningAnimationProvider>
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
        </SettingsProvider>
      </SeasonPassProvider>
    </RevenueCatProvider>
  );
}

export default App;
