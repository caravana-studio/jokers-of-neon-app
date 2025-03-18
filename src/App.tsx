import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence } from "framer-motion";
import { AnimatedPage } from "./components/AnimatedPage";
import { Background } from "./components/Background";
import { FeatureFlagProvider } from "./featureManagement/FeatureFlagProvider";
import { PositionedControllerIcon } from "./icons/ControllerIcon";
import { DeckPage } from "./pages/Deck/DeckPage";
import { DocsPage } from "./pages/Docs/Docs";
import { GamePage } from "./pages/Game/GamePage";
import { GamePageTutorial } from "./pages/Game/GamePageTutorial";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { LeaderBoardPage } from "./pages/LeaderboardPage";
import { Login } from "./pages/Login";
import { ManagePage } from "./pages/Manage/ManagePage";
import { OpenLootBox } from "./pages/OpenLootBox";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { SelectMod } from "./pages/SelectMod";
import { Store } from "./pages/store/Store";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { CardHighlightProvider } from "./providers/CardHighlightProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { PageTransitionsProvider } from "./providers/PageTransitionsProvider";
import { StoreProvider } from "./providers/StoreProvider";
import TutorialGameProvider from "./providers/TutorialGameProvider";
import customTheme from "./theme/theme";
import ZoomPrevention from "./utils/ZoomPrevention";
import { SidebarMenu } from "./components/BarMenu/SidebarMenu";

const IS_DEV = import.meta.env.VITE_DEV === "true";

function App() {
  const location = useLocation();
  const theme = extendTheme(customTheme);

  return (
    <ZoomPrevention>
      <ChakraBaseProvider theme={theme}>
        <FeatureFlagProvider>
          <CardAnimationsProvider>
            <GameProvider>
              <PageTransitionsProvider>
                <InformationPopUpProvider>
                  <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                    <Background>
                      <SidebarMenu></SidebarMenu>
                      <AnimatePresence mode="wait">
                        <Routes location={location} key={location.pathname}>
                          <Route
                            path="/"
                            element={
                              <AnimatedPage>
                                <Home />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/mods"
                            element={
                              <AnimatedPage>
                                <SelectMod />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/login"
                            element={
                              <AnimatedPage>
                                <Login />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/gameover/:gameId"
                            element={
                              <AnimatedPage>
                                <GameOver />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/demo"
                            element={
                              <AnimatedPage>
                                <GamePage />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/rewards"
                            element={
                              <AnimatedPage>
                                <RewardsPage />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/leaderboard"
                            element={
                              <AnimatedPage>
                                <LeaderBoardPage />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/store"
                            element={
                              <StoreProvider>
                                <AnimatedPage>
                                  <Store />
                                </AnimatedPage>
                              </StoreProvider>
                            }
                          />

                          <Route
                            path="/tutorial"
                            element={
                              <TutorialGameProvider>
                                <AnimatedPage>
                                  <GamePageTutorial />
                                </AnimatedPage>
                              </TutorialGameProvider>
                            }
                          />

                          <Route
                            path="/redirect/:page"
                            element={<Redirect />}
                          />
                          <Route
                            path="/preview/:type"
                            element={
                              <StoreProvider>
                                <AnimatedPage>
                                  <PreviewPage />
                                </AnimatedPage>
                              </StoreProvider>
                            }
                          />
                          <Route
                            path="/open-loot-box"
                            element={
                              <StoreProvider>
                                <AnimatedPage>
                                  <OpenLootBox />
                                </AnimatedPage>
                              </StoreProvider>
                            }
                          />
                          <Route path="/play" element={<Navigate to="/" />} />
                          <Route
                            path="/plays"
                            element={
                              <AnimatedPage>
                                <PlaysLayout />
                              </AnimatedPage>
                            }
                          />
                          <Route
                            path="/deck"
                            element={
                              <StoreProvider>
                                <AnimatedPage>
                                  <DeckPage />
                                </AnimatedPage>
                              </StoreProvider>
                            }
                          />
                          <Route
                            path="/docs"
                            element={
                              <CardHighlightProvider>
                                <AnimatedPage>
                                  <DocsPage lastIndexTab={0} />
                                </AnimatedPage>
                              </CardHighlightProvider>
                            }
                          />
                          <Route
                            path="/manage"
                            element={
                              <StoreProvider>
                                <AnimatedPage>
                                  <ManagePage />
                                </AnimatedPage>
                              </StoreProvider>
                            }
                          />
                        </Routes>
                        {!IS_DEV && <PositionedControllerIcon />}
                      </AnimatePresence>
                    </Background>
                  </AudioPlayerProvider>
                </InformationPopUpProvider>
              </PageTransitionsProvider>
            </GameProvider>
          </CardAnimationsProvider>
        </FeatureFlagProvider>
        <Analytics />
        <SpeedInsights />
      </ChakraBaseProvider>
    </ZoomPrevention>
  );
}

export default App;
