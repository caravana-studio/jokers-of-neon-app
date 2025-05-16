import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "./App.scss";

import { AnimatedPage } from "./components/AnimatedPage";
import { DeckPage } from "./pages/Deck/DeckPage";
import { DocsPage } from "./pages/Docs/Docs";
import { DynamicStorePage } from "./pages/DynamicStore/DynamicStorePage";
import { GamePage } from "./pages/Game/GamePage";
import { GamePageTutorial } from "./pages/Game/GamePageTutorial";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { LeaderBoardPage } from "./pages/LeaderboardPage";
import { Login } from "./pages/Login";
import { ManagePage } from "./pages/Manage/ManagePage";
import { EnteringTournament } from "./pages/MyGames/EnteringTournament";
import { MyGames } from "./pages/MyGames/MyGames";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { SelectMod } from "./pages/SelectMod";
import { CardHighlightProvider } from "./providers/CardHighlightProvider";
import { StoreProvider } from "./providers/StoreProvider";
import TutorialGameProvider from "./providers/TutorialGameProvider";
import { MapPage } from "./pages/Map/MapPage";
import { OpenLootBoxCardSelection } from "./pages/OpenLootBox/Stages/OpenLootBoxCardSelection";
import { OpenLootBox } from "./pages/OpenLootBox/Stages/OpenLootBox";
import { BudokanEndpoint } from "./pages/BudokanEndpoint";
import { GG } from "./pages/GG";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route path="/play/:gameId" element={<BudokanEndpoint />} />
      <Route
        path="/"
        element={
          <AnimatedPage>
            <Home />
          </AnimatedPage>
        }
        />
        <Route
        path="/gg"
        element={
          <GG />
        } />
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
              <DynamicStorePage />
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

      <Route path="/redirect/:page" element={<Redirect />} />
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
      <Route
        path="/loot-box-cards-selection"
        element={
          <StoreProvider>
            <AnimatedPage>
              <OpenLootBoxCardSelection />
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
        path="/map"
        element={
          <StoreProvider>
            <AnimatedPage>
              <MapPage />
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
            <CardHighlightProvider>
              <AnimatedPage>
                <ManagePage />
              </AnimatedPage>
            </CardHighlightProvider>
          </StoreProvider>
        }
      />
    </Routes>
  );
};
