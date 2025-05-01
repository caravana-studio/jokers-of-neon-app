import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { AppRoutes } from "./AppRoutes";
import { Background } from "./components/Background";
import { Layout } from "./components/Layout";
import { FeatureFlagProvider } from "./featureManagement/FeatureFlagProvider";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import customTheme from "./theme/theme";
import ZoomPrevention from "./utils/ZoomPrevention";

function App() {
  const theme = extendTheme(customTheme);

  return (
    <SettingsProvider>
      <ZoomPrevention>
        <ChakraBaseProvider theme={theme}>
          <FeatureFlagProvider>
            <CardAnimationsProvider>
              <CardDataProvider>
                <GameProvider>
                  <PageTransitionsProvider>
                    <InformationPopUpProvider>
                      <AudioPlayerProvider
                        baseSongPath={"/music/new-track.mp3"}
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
          </FeatureFlagProvider>
          <Analytics />
          <SpeedInsights />
        </ChakraBaseProvider>
      </ZoomPrevention>
    </SettingsProvider>
  );
}

export default App;
