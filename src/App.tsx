import { Box, ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Poc } from "./pages/Poc";
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
                <Route path="/login" element={<Login />} />
                <Route path="/gameover" element={<GameOver />} />
                <Route
                  path="/demo"
                  element={
                    <Box
                      sx={{
                        backgroundImage: "url(arcade-neon.gif)",
                        boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.3)",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        height: "100vh",
                        width: "100vw",
                        imageRendering: "pixelated !important",
                        fontFamily: "Sys",
                        pointerEvents: "all",
                        color: "#FFF",
                      }}
                    >
                      <GamePage />
                    </Box>
                  }
                />
                <Route path="/poc" element={<Poc />} />
              </Routes>
            </div>
          </div>
        </main>
      </CardAnimationsProvider>
    </ChakraBaseProvider>
  );
}

export default App;
