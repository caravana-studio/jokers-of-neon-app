import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";

import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { OpenPack } from "./pages/OpenPack";
import PreviewCard from "./pages/PreviewCard";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { Store } from "./pages/store/Store";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { GameProvider } from "./providers/GameProvider";
import { StoreProvider } from "./providers/StoreProvider";
import customTheme from "./theme/theme";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import { isMobile } from "react-device-detect";
import MobilePreviewCard from "./pages/PreviewCardMobile";
import { DeckPage } from "./pages/Deck/DeckPage";

function App() {
  const theme = extendTheme(customTheme);
  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/gameover"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <GameOver />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/demo"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <GamePage />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/rewards"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <RewardsPage />
                </AudioPlayerProvider>
              }
            />

            <Route
              path="/store"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <StoreProvider>
                    <Store />
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/redirect/:page"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <Redirect />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/preview-card"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <StoreProvider>
                    {isMobile? <MobilePreviewCard/>: <PreviewCard />}
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/open-pack"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <StoreProvider>
                    <OpenPack />
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route path="/play" element={<Navigate to="/" />} />
            <Route 
              path="/plays"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                    <PlaysLayout/>
                </AudioPlayerProvider>
              }
            />
            <Route 
              path="/deck"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                    <DeckPage/>
                </AudioPlayerProvider>
              }
            />
          </Routes>
        </GameProvider>
      </CardAnimationsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
