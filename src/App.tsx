import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AppTrackingTransparency } from "capacitor-plugin-app-tracking-transparency";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createProfile, fetchProfile } from "./api/profile";
import { AppRoutes } from "./AppRoutes";
import { Background } from "./components/Background";
import { Layout } from "./components/Layout";
import { useDojo } from "./dojo/DojoContext";
import { useGameActions } from "./dojo/useGameActions";
import { useUsername } from "./dojo/utils/useUsername";
import { useAppsFlyerReferral } from "./hooks/useAppsFlyerReferral";
import { initAppsFlyerReferralListener } from "./utils/appsflyerReferral";
import { BackgroundAnimationProvider } from "./providers/BackgroundAnimationProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { RevenueCatProvider } from "./providers/RevenueCatProvider";
import { SeasonPassProvider } from "./providers/SeasonPassProvider";
import ZoomPrevention from "./utils/ZoomPrevention";
import { registerPushListeners } from "./utils/notifications/registerPushListeners";

function App() {
  const {
    account: { account },
  } = useDojo();

  const navigate = useNavigate();
  const username = useUsername();

  const { claimLives } = useGameActions();
  
  // Handle AppsFlyer referral data
  useAppsFlyerReferral();
  
  // Handle AppsFlyer referral data
  useAppsFlyerReferral();

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
    
    // Initialize AppsFlyer referral listener
    initAppsFlyerReferralListener().catch((err) => {
      console.warn("Failed to initialize AppsFlyer listener:", err);
    });

    registerPushListeners(navigate);
  }, []);

  return (
    <RevenueCatProvider>
      <SeasonPassProvider>
        <ZoomPrevention>
          <CardAnimationsProvider>
            <CardDataProvider>
              <GameProvider>
                <PageTransitionsProvider>
                  <InformationPopUpProvider>
                    <Background>
                      <BackgroundAnimationProvider>
                        <Layout>
                          <AnimatePresence mode="wait">
                            <AppRoutes />
                          </AnimatePresence>
                        </Layout>
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
      </SeasonPassProvider>
    </RevenueCatProvider>
  );
}

export default App;
