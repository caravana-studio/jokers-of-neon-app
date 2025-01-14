import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { DeckPage } from "./pages/Deck/DeckPage";
import { GamePage } from "./pages/Game/GamePage";
import { GamePageTutorial } from "./pages/Game/GamePageTutorial";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { OpenLootBox } from "./pages/OpenLootBox";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { PreviewPage } from "./pages/Preview/PreviewPage";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { SpecialCardsPage } from "./pages/SpecialCardsPage";
import { Store } from "./pages/store/Store";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { GameProvider } from "./providers/GameProvider";
import { InformationPopUpProvider } from "./providers/InformationPopUpProvider";
import { StoreProvider } from "./providers/StoreProvider";
import TutorialGameProvider from "./providers/TutorialGameProvider";
import customTheme from "./theme/theme";
import { DocsContentMobile } from "./pages/Docs/Docs";
import { CardHighlightProvider } from "./providers/CardHighlightProvider";

function App() {
  const theme = extendTheme(customTheme);
  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
        <GameProvider>
          <InformationPopUpProvider>
            <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/gameover/:gameId" element={<GameOver />} />
                <Route path="/demo" element={<GamePage />} />
                <Route path="/rewards" element={<RewardsPage />} />

                <Route
                  path="/store"
                  element={
                    <StoreProvider>
                      <Store />
                    </StoreProvider>
                  }
                />

                <Route
                  path="/tutorial"
                  element={
                    <TutorialGameProvider>
                      <GamePageTutorial />
                    </TutorialGameProvider>
                  }
                />

                <Route path="/redirect/:page" element={<Redirect />} />
                <Route
                  path="/preview/:type"
                  element={
                    <StoreProvider>
                      <PreviewPage />
                    </StoreProvider>
                  }
                />
                <Route
                  path="/open-loot-box"
                  element={
                    <StoreProvider>
                      <OpenLootBox />
                    </StoreProvider>
                  }
                />
                <Route
                  path="/special-cards"
                  element={
                    <StoreProvider>
                      <SpecialCardsPage />
                    </StoreProvider>
                  }
                />
                <Route path="/play" element={<Navigate to="/" />} />
                <Route path="/plays" element={<PlaysLayout />} />
                <Route
                  path="/deck"
                  element={
                    <StoreProvider>
                      <DeckPage />
                    </StoreProvider>
                  }
                />
                <Route
                  path="/docs"
                  element={
                    <CardHighlightProvider>
                      <DocsContentMobile lastIndexTab={0} />
                    </CardHighlightProvider>
                  }
                />
              </Routes>
            </AudioPlayerProvider>
          </InformationPopUpProvider>
        </GameProvider>
      </CardAnimationsProvider>
      <Analytics />
      <SpeedInsights />
    </ChakraBaseProvider>
  );
}

export default App;
