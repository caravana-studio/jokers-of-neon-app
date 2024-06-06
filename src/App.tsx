import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { FullScreenArcade } from "./components/FullScreenArcade";
import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Store } from "./pages/store/Store";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import customTheme from "./theme/theme";

const theme = extendTheme(customTheme);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
        <main className="scanlines">
          <div className="screen">
            <canvas id="canvas" className="picture"></canvas>
            <div className="overlay">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/gameover" element={<GameOver />} />
                <Route
                  path="/demo"
                  element={
                    <FullScreenArcade>
                      <GamePage />
                    </FullScreenArcade>
                  }
                />
                <Route
                  path="/store"
                  element={
                    <FullScreenArcade>
                      <Store />
                    </FullScreenArcade>
                  }
                />
              </Routes>
            </div>
          </div>
        </main>
      </CardAnimationsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
