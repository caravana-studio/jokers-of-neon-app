import "../App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { Background } from "../components/Background";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { CardAnimationsProvider } from "../providers/CardAnimationsProvider";
import { CardDataProvider } from "../providers/CardDataProvider";
import { GameProvider } from "../providers/GameProvider";
import { InformationPopUpProvider } from "../providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "../providers/PageTransitionsProvider";
import { RevenueCatProvider } from "../providers/RevenueCatProvider";
import { SeasonPassProvider } from "../providers/SeasonPassProvider";
import { SettingsProvider } from "../providers/SettingsProvider";
import ZoomPrevention from "../utils/ZoomPrevention";
import { AppRoutes } from "./AppRoutes";
import { ControllerButton } from "./components/ControllerButton";

function App() {
  return (
    <RevenueCatProvider>
      <SeasonPassProvider>
        <SettingsProvider
          introSongPath={"/music/intro-track.mp3"}
          baseSongPath={"/music/game-track.mp3"}
          rageSongPath={"/music/rage_soundtrack.mp3"}
        >
          <ZoomPrevention>
            <CardAnimationsProvider>
              <CardDataProvider>
                <GameProvider>
                  <PageTransitionsProvider>
                    <InformationPopUpProvider>
                      <Background>
                        <AnimatePresence mode="wait">
                          <ControllerButton />
                          <LanguageSwitcher />
                          <AppRoutes />
                        </AnimatePresence>
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
      </SeasonPassProvider>
    </RevenueCatProvider>
  );
}

export default App;
