import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";

import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Redirect } from "./pages/Redirect.tsx";
import { RewardsPage } from "./pages/RewardsPage";
import { Store } from "./pages/store/Store";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { GameProvider } from "./providers/GameProvider";
import { StoreProvider } from "./providers/StoreProvider";
import customTheme from "./theme/theme";

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
                <AudioPlayerProvider songPath={"/music/track1.mp3"}>
                  <GameOver />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/demo"
              element={
                <AudioPlayerProvider songPath={"/music/track1.mp3"}>
                  <GamePage />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/rewards"
              element={
                <AudioPlayerProvider songPath={"/music/track1.mp3"}>
                  <RewardsPage />
                </AudioPlayerProvider>
              }
            />

            <Route
              path="/store"
              element={
                <AudioPlayerProvider songPath={"/music/track1.mp3"}>
                  <StoreProvider>
                    <Store />
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/redirect/:page"
              element={
                <AudioPlayerProvider songPath={"/music/track1.mp3"}>
                  <Redirect />
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
