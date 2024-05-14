import {
  Box,
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { Game } from "./pages/Game";
import { Home } from "./pages/Home";
import { Poc } from "./pages/Poc";

const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <main className="scanlines">
        <div className="screen">
          <canvas id="canvas" className="picture"></canvas>
          <div className="overlay">
            <Routes>
              <Route path="/" element={<Home />} />
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
                    <Game />
                  </Box>
                }
              />
              <Route path="/poc" element={<Poc />} />
            </Routes>
          </div>
        </div>
      </main>
    </ChakraBaseProvider>
  );
}

export default App;
