import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

import { AnimatedPage } from "./components/AnimatedPage";
import { GameStoreLoader } from "./components/GameStoreLoader";
import { ShopStoreLoader } from "./components/ShopStoreLoader";
import { RequireUsername } from "./components/UsernameGate";
import { ClaimMultipleRewardsPage } from "./pages/ClaimMultipleRewardsPage";
import { CavosWalletConnect } from "./pages/CavosWalletConnect/CavosWalletConnect";
import { DeckPage } from "./pages/Deck/DeckPage";
import { DocsPage } from "./pages/Docs/Docs";
import { DynamicStorePage } from "./pages/DynamicStore/DynamicStorePage";
import { ExternalPack } from "./pages/ExternalPack/ExternalPack";
import { FreePackPage } from "./pages/FreePackPage";
import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver/GameOver";
import { ManagePage } from "./pages/Manage/ManagePage";
import { MapPage } from "./pages/Map/MapPage";
import { MyCollectionPage } from "./pages/MyCollection/MyCollectionPage";
import { EnteringTournament } from "./pages/MyGames/EnteringTournament";
import { MyGames } from "./pages/MyGames/MyGames";
import { Tournament } from "./pages/MyGames/Tournament";
import { NewHome } from "./pages/NewHome/NewHome";
import { NewLeaderboardPage } from "./pages/NewLeaderboardPage/NewLeaderboardPage";
import { OpenLootBox } from "./pages/OpenLootBox/Stages/OpenLootBox";
import { OpenLootBoxCardSelection } from "./pages/OpenLootBox/Stages/OpenLootBoxCardSelection";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
import { PracticePage } from "./pages/Practice/PracticePage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { PurchasingPackPage } from "./pages/PurchasingPackPage";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { SeasonPassOfferPage } from "./pages/SeasonPassOffer/SeasonPassOfferPage";
import { MissionsPage } from "./pages/Missions/MissionsPage";
import { SeasonProgressionPage } from "./pages/SeasonProgression/SeasonProgressionPage";
import { SettingsPage } from "./pages/SettingsPage";
import { ShopPage } from "./pages/Shop/ShopPage";
import { ShopTierUnlockedPage } from "./pages/ShopTierUnlocked/ShopTierUnlockedPage";
import { SummaryPage } from "./pages/SummaryPage";
import { TestPage } from "./pages/TestPage";
import { VibrationPage } from "./pages/VibrationPage";
import { ReferralPage } from "./pages/ReferralPage";
import { SimulatePacksPage } from "./pages/SimulatePacks/SimulatePacksPage";
import { StreakIncreasedPage } from "./pages/StreakIncreasedPage";
import { CardHighlightProvider } from "./providers/HighlightProvider/CardHighlightProvider";
import { PowerupHighlightProvider } from "./providers/HighlightProvider/PowerupHighlightProvider";
import { PracticeGameProvider } from "./providers/PracticeGameProvider";
import { StoreProvider } from "./providers/StoreProvider";
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
            <CavosWalletConnect />
          </AnimatedPage>
        }
      />
      <Route
        path="/cavos-wallet-connect"
        element={
          <Navigate to="/login" replace />
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
        path="/streak-increased"
        element={
          <AnimatedPage>
            <StreakIncreasedPage />
          </AnimatedPage>
        }
      />
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
        path="/test/haptics"
        element={
          <AnimatedPage>
            <VibrationPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/test/season-pass-offer"
        element={
          <AnimatedPage>
            <SeasonPassOfferPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/season-pass-offer"
        element={
          <AnimatedPage>
            <SeasonPassOfferPage />
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
              <RequireUsername>
                <ProfilePage />
              </RequireUsername>
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
        path="/round"
        element={
          <AnimatedPage>
            <GameStoreLoader>
              <GamePage />
            </GameStoreLoader>
          </AnimatedPage>
        }
      />
      <Route path="/demo" element={<Navigate to="/round" replace />} />
      <Route
        path="/my-games"
        element={
          <AnimatedPage>
            <RequireUsername>
              <MyGames />
            </RequireUsername>
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
        path="/shop-tier-unlocked/:gameId"
        element={
          <AnimatedPage>
            <ShopTierUnlockedPage />
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
        path="/missions"
        element={
          <AnimatedPage>
            <LoginGate>
              <MissionsPage />
            </LoginGate>
          </AnimatedPage>
        }
      />
      <Route
        path="/missions-game"
        element={
          <AnimatedPage>
            <LoginGate>
              <GameStoreLoader>
                <MissionsPage inGame />
              </GameStoreLoader>
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
