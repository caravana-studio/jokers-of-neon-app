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
import { ExternalPackTestPage } from "./pages/ExternalPack/ExternalPackTestPage";
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
import { NewHome } from "./pages/NewHome/NewHome";
import { NewLeaderboardPage } from "./pages/NewLeaderboardPage/NewLeaderboardPage";
import { TournamentPage } from "./pages/NewLeaderboardPage/TournamentPage";
import { OpenLootBox } from "./pages/OpenLootBox/Stages/OpenLootBox";
import { OpenLootBoxCardSelection } from "./pages/OpenLootBox/Stages/OpenLootBoxCardSelection";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
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
import { ReferralTestPage } from "./pages/ReferralTestPage";
import { CardHighlightProvider } from "./providers/HighlightProvider/CardHighlightProvider";
import { PowerupHighlightProvider } from "./providers/HighlightProvider/PowerupHighlightProvider";
import { StoreProvider } from "./providers/StoreProvider";
import TutorialGameProvider from "./providers/TutorialGameProvider";
import { LoginGate } from "./utils/LoginGate";

export const AppRoutes = () => {
  const location = useLocation();

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
        path="/test/external-pack/:packId"
        element={
          <AnimatedPage>
            <ExternalPackTestPage />
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
        path="/referral-test"
        element={
          <AnimatedPage>
            <ReferralTestPage />
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
            <GameStoreLoader>
              <GamePage />
            </GameStoreLoader>
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
            <GameStoreLoader>
              <RewardsPage />
            </GameStoreLoader>
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
            <TournamentPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/store"
        element={
          <StoreProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <ShopStoreLoader>
                  <DynamicStorePage />
                </ShopStoreLoader>
              </GameStoreLoader>
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
          <StoreProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <MapPage />
              </GameStoreLoader>
            </AnimatedPage>
          </StoreProvider>
        }
      />
      <Route
        path="/docs"
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
