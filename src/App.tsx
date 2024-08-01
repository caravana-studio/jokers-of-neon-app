import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
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
import PWAPrompt from 'react-ios-pwa-prompt'
import { useEffect, useState } from 'react';
import InstallPWA from './utils/InstallPWA'; // Import the new component

function App() {
  const theme = extendTheme(customTheme);

  // State to track device type
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      setIsIOS(true);
    }
  }, []);

  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
      
      {/* {isIOS && <PWAPrompt isShown={true} />} */}
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
            <Route path="/play" element={<Navigate to="/" />} />
          </Routes>
        </GameProvider>
      </CardAnimationsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
