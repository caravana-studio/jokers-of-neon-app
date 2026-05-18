import "../App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { Background } from "../components/Background";
import { BackgroundAnimationProvider } from "../providers/BackgroundAnimationProvider";
import { CardAnimationsProvider } from "../providers/CardAnimationsProvider";
import { CardDataProvider } from "../providers/CardDataProvider";
import { GameProvider } from "../providers/GameProvider";
import { InformationPopUpProvider } from "../providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "../providers/PageTransitionsProvider";
import ZoomPrevention from "../utils/ZoomPrevention";
import { AppRoutes } from "./AppRoutes";
import { MiniAppLayout } from "./MiniAppLayout";
import { MiniAppTermsGate } from "./MiniAppTermsGate";

function App() {
  return (
    <ZoomPrevention>
      <CardAnimationsProvider>
        <CardDataProvider>
          <GameProvider>
            <PageTransitionsProvider>
              <InformationPopUpProvider>
                <Background>
                  <BackgroundAnimationProvider>
                    <MiniAppTermsGate>
                      <MiniAppLayout>
                        <AnimatePresence mode="wait">
                          <AppRoutes />
                        </AnimatePresence>
                      </MiniAppLayout>
                    </MiniAppTermsGate>
                  </BackgroundAnimationProvider>
                </Background>
              </InformationPopUpProvider>
            </PageTransitionsProvider>
          </GameProvider>
        </CardDataProvider>
      </CardAnimationsProvider>
      <Analytics />
      <SpeedInsights />
    </ZoomPrevention>
  );
}

export default App;
