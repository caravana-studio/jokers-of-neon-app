import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

import { AnimatedPage } from "./components/AnimatedPage";
import { GameStoreLoader } from "./components/GameStoreLoader";
import { ShopStoreLoader } from "./components/ShopStoreLoader";
import { ClaimMultipleRewardsPage } from "./pages/ClaimMultipleRewardsPage";
import { DeckPage } from "./pages/Deck/DeckPage";
import { DocsPage } from "./pages/Docs/Docs";
import { DynamicStorePage } from "./pages/DynamicStore/DynamicStorePage";
import { ExternalPack } from "./pages/ExternalPack/ExternalPack";
import { FreePackPage } from "./pages/FreePackPage";
import { GamePage } from "./pages/Game/GamePage";
import { GamePageTutorial } from "./pages/Game/GamePageTutorial";
import { GameOver } from "./pages/GameOver/GameOver";
import { Login } from "./pages/Login";
import { ManagePage } from "./pages/Manage/ManagePage";
import { MapPage } from "./pages/Map/MapPage";
import { MyCollectionPage } from "./pages/MyCollection/MyCollectionPage";
import { EnteringTournament } from "./pages/MyGames/EnteringTournament";
import { MyGames } from "./pages/MyGames/MyGames";
import { Tournament } from "./pages/MyGames/Tournament";
import { NewHome } from "./pages/NewHome/NewHome";
import { NewLeaderboardPage } from "./pages/NewLeaderboardPage/NewLeaderboardPage";
import { PostRunUnlockView } from "./pages/Roguelike/PostRunUnlockView";
import { PrepareRunView } from "./pages/Roguelike/PrepareRunView";
import { RoguelikeHome } from "./pages/Roguelike/RoguelikeHome";
import { RoguelikeRewardsPage } from "./pages/Roguelike/RoguelikeRewardsPage";
import { RoguelikeRunView } from "./pages/Roguelike/RoguelikeRunView";
import { OpenLootBox } from "./pages/OpenLootBox/Stages/OpenLootBox";
import { OpenLootBoxCardSelection } from "./pages/OpenLootBox/Stages/OpenLootBoxCardSelection";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
import { PracticePage } from "./pages/Practice/PracticePage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { PurchasingPackPage } from "./pages/PurchasingPackPage";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { SeasonProgressionPage } from "./pages/SeasonProgression/SeasonProgressionPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ShopPage } from "./pages/Shop/ShopPage";
import { SummaryPage } from "./pages/SummaryPage";
import { TestPage } from "./pages/TestPage";
import { VibrationPage } from "./pages/VibrationPage";
import { ReferralPage } from "./pages/ReferralPage";
import { SimulatePacksPage } from "./pages/SimulatePacks/SimulatePacksPage";
import { CardHighlightProvider } from "./providers/HighlightProvider/CardHighlightProvider";
import { PowerupHighlightProvider } from "./providers/HighlightProvider/PowerupHighlightProvider";
import { PracticeGameProvider } from "./providers/PracticeGameProvider";
import { RoguelikeRoundProvider } from "./providers/RoguelikeRoundProvider";
import { StoreProvider } from "./providers/StoreProvider";
import TutorialGameProvider from "./providers/TutorialGameProvider";
import { RoguelikeBootstrap } from "./pages/Roguelike/components/RoguelikeBootstrap";
import { isMockGameApiMode } from "./config/gameMode";
import { LoginGate } from "./utils/LoginGate";

export const AppRoutes = () => {
  const location = useLocation();
  const isMockMode = isMockGameApiMode;

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <NewHome />
          </AnimatedPage>
        }
      />
      <Route
        path="/roguelike"
        element={
          <AnimatedPage>
            <RoguelikeBootstrap>
              <RoguelikeHome />
            </RoguelikeBootstrap>
          </AnimatedPage>
        }
      />
      <Route
        path="/roguelike/prepare"
        element={
          <AnimatedPage>
            <RoguelikeBootstrap>
              <PrepareRunView />
            </RoguelikeBootstrap>
          </AnimatedPage>
        }
      />
      <Route
        path="/roguelike/run"
        element={
          <AnimatedPage>
            <RoguelikeBootstrap>
              <RoguelikeRunView />
            </RoguelikeBootstrap>
          </AnimatedPage>
        }
      />
      <Route
        path="/roguelike/shop"
        element={
          <AnimatedPage>
            <Navigate to="/store" replace />
          </AnimatedPage>
        }
      />
      <Route
        path="/roguelike/post-run"
        element={
          <AnimatedPage>
            <RoguelikeBootstrap>
              <PostRunUnlockView />
            </RoguelikeBootstrap>
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
        path="/test"
        element={
          <AnimatedPage>
            <TestPage />
          </AnimatedPage>
        }
      />{" "}
      <Route
        path="/test/simulate-packs"
        element={
          <AnimatedPage>
            <LoginGate>
              <SimulatePacksPage />
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/vibration"
        element={
          <AnimatedPage>
            <VibrationPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/referral"
        element={
          <AnimatedPage>
            <ReferralPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/my-collection"
        element={
          <AnimatedPage>
            <LoginGate>
              <CardHighlightProvider>
                <MyCollectionPage />
              </CardHighlightProvider>
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/profile"
        element={
          <AnimatedPage>
            <LoginGate>
              <ProfilePage />
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/settings"
        element={
          <AnimatedPage>
            <SettingsPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/settings-game"
        element={
          <AnimatedPage>
            <SettingsPage />
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
            {isMockMode ? (
              <RoguelikeBootstrap>
                <RoguelikeRoundProvider>
                  <GamePage />
                </RoguelikeRoundProvider>
              </RoguelikeBootstrap>
            ) : (
              <GameStoreLoader>
                <GamePage />
              </GameStoreLoader>
            )}
          </AnimatedPage>
        }
      />
      <Route
        path="/my-games"
        element={
          <AnimatedPage>
            <MyGames />
          </AnimatedPage>
        }
      />
      <Route
        path="/entering-tournament"
        element={
          <AnimatedPage>
            <EnteringTournament />
          </AnimatedPage>
        }
      />
      <Route
        path="/rewards"
        element={
          <AnimatedPage>
            {isMockMode ? (
              <RoguelikeBootstrap>
                <RoguelikeRewardsPage />
              </RoguelikeBootstrap>
            ) : (
              <GameStoreLoader>
                <RewardsPage />
              </GameStoreLoader>
            )}
          </AnimatedPage>
        }
      />
      <Route
        path="/win"
        element={
          <AnimatedPage>
            <GameStoreLoader>
              <SummaryPage win />
            </GameStoreLoader>
          </AnimatedPage>
        }
      />      
      <Route
        path="/loose"
        element={
          <AnimatedPage>
            <GameStoreLoader>
              <SummaryPage win={false} />
            </GameStoreLoader>
          </AnimatedPage>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <AnimatedPage>
            <NewLeaderboardPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/tournament"
        element={
          <AnimatedPage>
            <Tournament />
          </AnimatedPage>
        }
      />
      <Route
        path="/store"
        element={
          <AnimatedPage>
            {isMockMode ? (
              <RoguelikeBootstrap>
                <RoguelikeRoundProvider>
                  <StoreProvider>
                    <GameStoreLoader>
                      <ShopStoreLoader>
                        <DynamicStorePage />
                      </ShopStoreLoader>
                    </GameStoreLoader>
                  </StoreProvider>
                </RoguelikeRoundProvider>
              </RoguelikeBootstrap>
            ) : (
              <StoreProvider>
                <GameStoreLoader>
                  <ShopStoreLoader>
                    <DynamicStorePage />
                  </ShopStoreLoader>
                </GameStoreLoader>
              </StoreProvider>
            )}
          </AnimatedPage>
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
        path="/practice"
        element={
          <PracticeGameProvider>
            <AnimatedPage>
              <PracticePage />
            </AnimatedPage>
          </PracticeGameProvider>
        }
      />
      <Route path="/redirect" element={<Redirect />} />
      <Route
        path="/preview/:type"
        element={
          <StoreProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <GameStoreLoader>
                  <PreviewPage />
                </GameStoreLoader>
              </GameStoreLoader>
            </AnimatedPage>
          </StoreProvider>
        }
      />
      <Route
        path="/open-loot-box"
        element={
          <StoreProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <OpenLootBox />
              </GameStoreLoader>
            </AnimatedPage>
          </StoreProvider>
        }
      />
      <Route
        path="/external-pack/:packId?"
        element={
          <AnimatedPage>
            <ExternalPack />
          </AnimatedPage>
        }
      />
      <Route
        path="/loot-box-cards-selection"
        element={
          <StoreProvider>
            <CardHighlightProvider>
              <AnimatedPage>
                <GameStoreLoader>
                  <OpenLootBoxCardSelection />
                </GameStoreLoader>
              </AnimatedPage>
            </CardHighlightProvider>
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
        path="/season"
        element={
          <AnimatedPage>
            <LoginGate>
              <SeasonProgressionPage />
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/free-pack"
        element={
          <AnimatedPage>
            <LoginGate>
              <FreePackPage />
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/purchasing-pack"
        element={
          <AnimatedPage>
            <PurchasingPackPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/claim-season-pack/:level/:premium"
        element={
          <AnimatedPage>
            <ClaimMultipleRewardsPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/unclaimed-rewards"
        element={
          <AnimatedPage>
            <ClaimMultipleRewardsPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/shop"
        element={
          <AnimatedPage>
            <LoginGate translationKey="login-purchases">
              <ShopPage />
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/deck"
        element={
          <StoreProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <DeckPage />
              </GameStoreLoader>
            </AnimatedPage>
          </StoreProvider>
        }
      />
      <Route
        path="/map"
        element={
          <AnimatedPage>
            {isMockMode ? (
              <RoguelikeBootstrap>
                <RoguelikeRoundProvider>
                  <StoreProvider>
                    <GameStoreLoader>
                      <MapPage />
                    </GameStoreLoader>
                  </StoreProvider>
                </RoguelikeRoundProvider>
              </RoguelikeBootstrap>
            ) : (
              <StoreProvider>
                <GameStoreLoader>
                  <MapPage />
                </GameStoreLoader>
              </StoreProvider>
            )}
          </AnimatedPage>
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
        path="/docs-game"
        element={
          <CardHighlightProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <DocsPage lastIndexTab={0} />
              </GameStoreLoader>
            </AnimatedPage>
          </CardHighlightProvider>
        }
      />
      <Route
        path="/manage"
        element={
          <StoreProvider>
            <CardHighlightProvider>
              <PowerupHighlightProvider>
                <AnimatedPage>
                  <GameStoreLoader>
                    <GameStoreLoader>
                      <ManagePage />
                    </GameStoreLoader>
                  </GameStoreLoader>
                </AnimatedPage>
              </PowerupHighlightProvider>
            </CardHighlightProvider>
          </StoreProvider>
        }
      />
    </Routes>
  );
};
