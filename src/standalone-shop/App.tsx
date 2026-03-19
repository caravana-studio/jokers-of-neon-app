import "../App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Layout as MarketplaceLayout } from "../marketplace/components/Layout";
import { MarketplaceProvider } from "../marketplace/providers/MarketplaceProvider";
import { CardAnimationsProvider } from "../providers/CardAnimationsProvider";
import { CardDataProvider } from "../providers/CardDataProvider";
import { GameProvider } from "../providers/GameProvider";
import { InformationPopUpProvider } from "../providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "../providers/PageTransitionsProvider";
import { RevenueCatProvider } from "../providers/RevenueCatProvider";
import { SeasonPassProvider } from "../providers/SeasonPassProvider";
import ZoomPrevention from "../utils/ZoomPrevention";
import { AppRoutes } from "./AppRoutes";

const shouldHideMarketplaceChrome = (pathname: string): boolean => {
  return (
    pathname.startsWith("/external-pack") || pathname === "/purchasing-pack"
  );
};

function App() {
  const location = useLocation();
  const hideMarketplaceChrome = shouldHideMarketplaceChrome(location.pathname);
  const routes = (
    <AnimatePresence mode="wait">
      <AppRoutes />
    </AnimatePresence>
  );

  return (
    <RevenueCatProvider>
      <SeasonPassProvider>
        <ZoomPrevention>
          <CardAnimationsProvider>
            <CardDataProvider>
              <GameProvider>
                <PageTransitionsProvider>
                  <InformationPopUpProvider>
                    <MarketplaceProvider>
                      {hideMarketplaceChrome ? (
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100dvh",
                            overflow: "hidden",
                          }}
                        >
                          <video
                            src="/bg/store-bg.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{
                              position: "fixed",
                              inset: 0,
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              pointerEvents: "none",
                              zIndex: 0,
                            }}
                          />
                          <div
                            style={{
                              position: "fixed",
                              inset: 0,
                              background: "rgba(6, 15, 38, 0.6)",
                              pointerEvents: "none",
                              zIndex: 0,
                            }}
                          />
                          <div
                            style={{
                              position: "relative",
                              zIndex: 1,
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            {routes}
                          </div>
                        </div>
                      ) : (
                        <MarketplaceLayout>{routes}</MarketplaceLayout>
                      )}
                    </MarketplaceProvider>
                  </InformationPopUpProvider>
                </PageTransitionsProvider>
              </GameProvider>
            </CardDataProvider>
          </CardAnimationsProvider>
          <Analytics />
          <SpeedInsights />
        </ZoomPrevention>
      </SeasonPassProvider>
    </RevenueCatProvider>
  );
}

export default App;
