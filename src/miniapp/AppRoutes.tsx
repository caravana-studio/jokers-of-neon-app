import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "../App.scss";

import { AnimatedPage } from "../components/AnimatedPage";
import { GameStoreLoader } from "../components/GameStoreLoader";
import { ShopStoreLoader } from "../components/ShopStoreLoader";
import { DeckPage } from "../pages/Deck/DeckPage";
import { GamePage } from "../pages/Game/GamePage";
import { GameOver } from "../pages/GameOver/GameOver";
import { ManagePage } from "../pages/Manage/ManagePage";
import { MapPage } from "../pages/Map/MapPage";
import { EnteringTournament } from "../pages/MyGames/EnteringTournament";
import { OpenLootBox } from "../pages/OpenLootBox/Stages/OpenLootBox";
import { OpenLootBoxCardSelection } from "../pages/OpenLootBox/Stages/OpenLootBoxCardSelection";
import { PlaysLayout } from "../pages/Plays/PlaysLayout";
import { PreviewPage } from "../pages/Preview/PreviewPage";
import { PurchasingPackPage } from "../pages/PurchasingPackPage";
import { RewardsPage } from "../pages/RewardsPage";
import { ShopTierUnlockedPage } from "../pages/ShopTierUnlocked/ShopTierUnlockedPage";
import { SummaryPage } from "../pages/SummaryPage";
import { DynamicStorePage } from "../pages/DynamicStore/DynamicStorePage";
import { ExternalPack } from "../pages/ExternalPack/ExternalPack";
import { DocsPage } from "../pages/Docs/Docs";
import { CardHighlightProvider } from "../providers/HighlightProvider/CardHighlightProvider";
import { PowerupHighlightProvider } from "../providers/HighlightProvider/PowerupHighlightProvider";
import { StoreProvider } from "../providers/StoreProvider";
import { MiniAppMyGamesPage } from "./MiniAppMyGamesPage";
import { MiniAppProfilePage } from "./MiniAppProfilePage";
import { MiniAppSettingsPage } from "./MiniAppSettingsPage";
import { MiniAppWeeklyLeaderboardPage } from "./MiniAppWeeklyLeaderboardPage";
import { MiniAppHome } from "./MiniAppHome";
import { RequireMiniAppUsername } from "./session/useMiniAppUsernameRequirement";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <MiniAppHome />
          </AnimatedPage>
        }
      />
      <Route
        path="/my-games"
        element={
          <AnimatedPage>
            <RequireMiniAppUsername requireCompletion>
              <MiniAppMyGamesPage />
            </RequireMiniAppUsername>
          </AnimatedPage>
        }
      />
      <Route
        path="/profile"
        element={
          <AnimatedPage>
            <RequireMiniAppUsername requireCompletion>
              <MiniAppProfilePage />
            </RequireMiniAppUsername>
          </AnimatedPage>
        }
      />
      <Route
        path="/settings"
        element={
          <AnimatedPage>
            <MiniAppSettingsPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/settings-game"
        element={
          <AnimatedPage>
            <MiniAppSettingsPage />
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
        path="/entering-tournament"
        element={
          <AnimatedPage>
            <EnteringTournament />
          </AnimatedPage>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <AnimatedPage>
            <MiniAppWeeklyLeaderboardPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/round"
        element={
          <AnimatedPage>
            <GameStoreLoader>
              <GamePage />
            </GameStoreLoader>
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
        path="/gameover/:gameId"
        element={
          <AnimatedPage>
            <GameOver />
          </AnimatedPage>
        }
      />
      <Route
        path="/shop-tier-unlocked/:gameId"
        element={
          <AnimatedPage>
            <ShopTierUnlockedPage />
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
      <Route
        path="/external-pack/:packId?"
        element={
          <AnimatedPage>
            <ExternalPack />
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
      <Route path="/play" element={<Navigate to="/" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
