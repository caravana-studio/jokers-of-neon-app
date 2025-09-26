import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { AppRoutes } from "./AppRoutes";
import { Background } from "./components/Background";
import { Layout } from "./components/Layout";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { SettingsProvider } from "./providers/SettingsProvider";
import customTheme from "./theme/theme";
import ZoomPrevention from "./utils/ZoomPrevention";
import { useDeepLinkHandler } from "./hooks/useDeepLinkHandler";
import { controller } from "./dojo/controller/controller";
import SessionConnector from "@cartridge/connector/session";

function App() {
  const theme = extendTheme(customTheme);
  useDeepLinkHandler(controller as SessionConnector);

  return (
    <SettingsProvider>
      <ZoomPrevention>
        <ChakraBaseProvider theme={theme}>
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
        </ChakraBaseProvider>
      </ZoomPrevention>
    </SettingsProvider>
  );
}

export default App;
