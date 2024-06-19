import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { FullScreenArcade } from "./components/FullScreenArcade";

import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Store } from "./pages/store/Store";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { GameProvider } from "./providers/GameProvider";
import { StoreProvider } from "./providers/StoreProvider";
import customTheme from "./theme/theme";
import { AudioPlayerProvider } from './providers/AudioPlayerProvider.tsx'

const theme = extendTheme(customTheme);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
        <CardAnimationsProvider>
          <GameProvider>
            <main className="scanlines">
              <div className="screen">
                <canvas id="canvas" className="picture"></canvas>
                <div className="overlay">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/gameover" element={<GameOver />} />
                    <Route
                      path="/demo"
                      element={
                        <AudioPlayerProvider songPath={'/music/track1.mp3'}>
                          <FullScreenArcade>
                            <GamePage />
                          </FullScreenArcade>
                        </AudioPlayerProvider>
                      }
                    />
                    <Route
                      path="/store"
                      element={
                        <AudioPlayerProvider songPath={'/music/track1.mp3'}>
                          <FullScreenArcade>
                            <StoreProvider>
                              <Store />
                            </StoreProvider>
                          </FullScreenArcade>
                        </AudioPlayerProvider>
                      }
                    />
                  </Routes>
                </div>
              </div>
            </main>
          </GameProvider>
        </CardAnimationsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
