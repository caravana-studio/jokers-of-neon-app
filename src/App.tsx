import {
  Box,
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";
import { useEffect } from "react";
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
  useEffect(() => {
    var main = document.querySelector("main");
    var canvas: HTMLCanvasElement = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement;
    var ctx = canvas.getContext("2d");
    var av1 = document.querySelector(".av1");
    var strk = document.querySelector(".strk");
    var press = document.querySelector(".press");
    var ww = window.innerWidth;
    var menu = document.querySelector(".menu");
    var ul = menu?.querySelector("ul");
    var count;

    if (ul) {
      count = ul?.childElementCount - 1;
    }
    var toggle = true;
    var frame;

    // Set canvas size
    canvas.width = ww / 3;
    canvas.height = (ww * 0.5625) / 3;

    // Generate CRT noise
    function snow(ctx: CanvasRenderingContext2D) {
      var w = ctx.canvas.width,
        h = ctx.canvas.height,
        d = ctx.createImageData(w, h),
        b = new Uint32Array(d.data.buffer),
        len = b.length;

      for (var i = 0; i < len; i++) {
        b[i] = ((255 * Math.random()) | 0) << 24;
      }

      ctx.putImageData(d, 0, 0);
    }

    function animate() {
      if (ctx) {
        snow(ctx);
        frame = requestAnimationFrame(animate);
      }
    }

    // Glitch
    for (let i = 0; i < 4; i++) {
      if (av1?.firstElementChild) {
        var av1Span = av1.firstElementChild.cloneNode(true);
        av1.appendChild(av1Span);
      }
      if (strk?.firstElementChild) {
        var strkSpan = strk.firstElementChild.cloneNode(true);
        strk.appendChild(strkSpan);
      }
      if (press?.firstElementChild) {
        var pressSpan = press.firstElementChild.cloneNode(true);
        press.appendChild(pressSpan);
      }
    }

    setTimeout(function () {
      if (main) {
        main.classList.add("on");
        main.classList.remove("off");
        animate();
      }
    }, 1000);
  }, []);

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
                      p: 10,
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
