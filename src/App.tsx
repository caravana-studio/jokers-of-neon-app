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
import { UsernameGate } from "./components/UsernameGate";
import { useDojo } from "./dojo/DojoContext";
import { useGameActions } from "./dojo/useGameActions";
import { useUsername } from "./dojo/utils/useUsername";
import { useAppsFlyerReferral } from "./hooks/useAppsFlyerReferral";
import { initAppsFlyerReferralListener, initWebReferralDetection } from "./utils/appsflyerReferral";
import { fetchAndStoreAgeSignals } from "./utils/ageSignals";
import { BackgroundAnimationProvider } from "./providers/BackgroundAnimationProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardDataProvider } from "./providers/CardDataProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { RevenueCatProvider } from "./providers/RevenueCatProvider";
import { SeasonPassProvider } from "./providers/SeasonPassProvider";
import { useSkinPreferencesStore } from "./state/useSkinPreferencesStore";
import { useTutorialStore } from "./state/useTutorialStore";
import { useUsernameStore } from "./state/useUsernameStore";
import { normalizeStarknetAddress } from "./utils/starknetAddress";
import ZoomPrevention from "./utils/ZoomPrevention";
import { registerPushListeners } from "./utils/notifications/registerPushListeners";

function App() {
  const {
    account: { account },
  } = useDojo();
  const refetchSkinPreferences = useSkinPreferencesStore(
    (store) => store.refetchSkinPreferences
  );
  const resetSkinPreferences = useSkinPreferencesStore((store) => store.reset);
  const lastSkinPreferencesAddress = useSkinPreferencesStore(
    (store) => store.lastUserAddress
  );
  const initializeTutorials = useTutorialStore((store) => store.initialize);
  const resetTutorials = useTutorialStore((store) => store.reset);

  const navigate = useNavigate();
  const username = useUsername();
  const usernameStatus = useUsernameStore((store) => store.status);

  const { claimLives } = useGameActions();
  
  // Handle AppsFlyer referral data
  useAppsFlyerReferral();

  useEffect(() => {
    if (!account?.address) {
      if (lastSkinPreferencesAddress) {
        resetSkinPreferences();
      }
      return;
    }

    if (lastSkinPreferencesAddress !== account.address) {
      void refetchSkinPreferences(account.address);
    }
  }, [
    account?.address,
    lastSkinPreferencesAddress,
    refetchSkinPreferences,
    resetSkinPreferences,
  ]);

  useEffect(() => {
    if (!account?.address) {
      resetTutorials();
      void initializeTutorials();
      return;
    }

    void initializeTutorials(account.address);
  }, [account?.address, initializeTutorials, resetTutorials]);

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

    // Fetch Play Age Signals once at startup for compliance checks
    fetchAndStoreAgeSignals().catch((error) => {
      console.warn("[Age Signals] Startup fetch failed:", error);
    });
    
    // Initialize AppsFlyer referral listener (native platforms)
    initAppsFlyerReferralListener().catch((err) => {
      console.warn("Failed to initialize AppsFlyer listener:", err);
    });

    // Detect web referrals from URL params (?ref=username)
    initWebReferralDetection();

    registerPushListeners(navigate);
  }, [navigate]);

  useEffect(() => {
    if (!account?.address || !username || usernameStatus !== "ready") {
      return;
    }

    claimLives().catch(() => {});

    fetchProfile(account.address)
      .then((profile) => {
        const profileLooksEmpty =
          profile.avatarId <= 0 &&
          profile.maxAvailableGames <= 0 &&
          profile.totalXp <= 0 &&
          profile.currentXp <= 0;

        if (
          normalizeStarknetAddress(profile.address) !==
            normalizeStarknetAddress(account.address) ||
          profileLooksEmpty
        ) {
          createProfile(account.address, 1).catch((error) => {
            console.warn("Failed to create profile", error);
          });
        }
      })
      .catch((error) => {
        console.warn("Failed to fetch profile", error);
      });
  }, [account?.address, username, usernameStatus]);

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
                          <UsernameGate />
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
