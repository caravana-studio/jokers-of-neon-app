import "../App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();
  const shouldBypassTermsGate =
    location.pathname === "/terms-and-conditions";
  const appContent = (
    <MiniAppLayout>
      <AnimatePresence mode="wait">
        <AppRoutes />
      </AnimatePresence>
    </MiniAppLayout>
  );

  return (
    <ZoomPrevention>
      <CardAnimationsProvider>
        <CardDataProvider>
          <GameProvider>
            <PageTransitionsProvider>
              <InformationPopUpProvider>
                <Background>
                  <BackgroundAnimationProvider>
                    {shouldBypassTermsGate ? (
                      appContent
                    ) : (
                      <MiniAppTermsGate>{appContent}</MiniAppTermsGate>
                    )}
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
