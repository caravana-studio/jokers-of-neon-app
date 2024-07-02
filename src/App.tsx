import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";

import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Redirect } from "./pages/Redirect.tsx";
import { Store } from "./pages/store/Store";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider.tsx";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { GameProvider } from "./providers/GameProvider";
import { StoreProvider } from "./providers/StoreProvider";
import customTheme from "./theme/theme";

const theme = extendTheme(customTheme);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
        <GameProvider>
          <AudioPlayerProvider songPath={"/music/track1.mp3"}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/gameover" element={<GameOver />} />
              <Route path="/demo" element={<GamePage />} />
              <Route
                path="/store"
                element={
                  <StoreProvider>
                    <Store />
                  </StoreProvider>
                }
              />
              <Route path="/redirect/:page" element={<Redirect />} />
            </Routes>
          </AudioPlayerProvider>
        </GameProvider>
      </CardAnimationsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
