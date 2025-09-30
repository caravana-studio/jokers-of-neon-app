import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

import { AnimatedPage } from "./components/AnimatedPage";
import { GameStoreLoader } from "./components/GameStoreLoader";
import { ShopStoreLoader } from "./components/ShopStoreLoader";
import { BudokanEndpoint } from "./pages/BudokanEndpoint";
import { DeckPage } from "./pages/Deck/DeckPage";
import { DocsPage } from "./pages/Docs/Docs";
import { DynamicStorePage } from "./pages/DynamicStore/DynamicStorePage";
import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver/GameOver";
import { Home } from "./pages/Home";
import { LeaderBoardPage } from "./pages/LeaderboardPage";
import { Login } from "./pages/Login";
import { ManagePage } from "./pages/Manage/ManagePage";
import { MapPage } from "./pages/Map/MapPage";
import { MyCollectionPage } from "./pages/MyCollection/MyCollectionPage";
import { EnteringTournament } from "./pages/MyGames/EnteringTournament";
import { MyGames } from "./pages/MyGames/MyGames";
import { OpenLootBox } from "./pages/OpenLootBox/Stages/OpenLootBox";
import { OpenLootBoxCardSelection } from "./pages/OpenLootBox/Stages/OpenLootBoxCardSelection";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { CardHighlightProvider } from "./providers/HighlightProvider/CardHighlightProvider";
import { PowerupHighlightProvider } from "./providers/HighlightProvider/PowerupHighlightProvider";
import { StoreProvider } from "./providers/StoreProvider";
import { Profile } from "./components/Profile/Profile";
import TutorialGameProvider from "./providers/TutorialGameProvider";
import { GamePageTutorial } from "./pages/Game/GamePageTutorial";
import { NewHome } from "./pages/NewHome/NewHome";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/play/:gameId" element={<BudokanEndpoint />} />
      <Route
        path="/"
        element={
          <AnimatedPage>
            <NewHome />
          </AnimatedPage>
        }
      />
      {/*       <Route
        path="/mods"
        element={
          <AnimatedPage>
            <SelectMod />
          </AnimatedPage>
        }
      /> */}
      <Route
        path="/login"
        element={
          <AnimatedPage>
            <Login />
          </AnimatedPage>
        }
      />
      <Route
        path="/my-collection"
        element={
          <AnimatedPage>
            <CardHighlightProvider>
              <MyCollectionPage />
            </CardHighlightProvider>
          </AnimatedPage>
        }
      />
      <Route
        path="/profile"
        element={
          <AnimatedPage>
            <Profile />
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
        path="/loot-box-cards-selection"
        element={
          <StoreProvider>
            <AnimatedPage>
              <GameStoreLoader>
                <OpenLootBoxCardSelection />
              </GameStoreLoader>
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
