import { ChakraBaseProvider, extendBaseTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { FullScreenArcade } from "./components/FullScreenArcade";
import { Game } from "./pages/Game";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Store } from "./pages/store/Store";
import { StaticCardsProvider } from "./providers/StaticCardsProvider";
import customTheme from "./theme";

const theme = extendBaseTheme(customTheme);

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <StaticCardsProvider>
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
                      <Game />
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
      </StaticCardsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
