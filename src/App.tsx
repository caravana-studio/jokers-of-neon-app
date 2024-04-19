import {
  Box,
  ChakraBaseProvider,
  theme as chakraTheme,
  extendBaseTheme,
} from "@chakra-ui/react";
import "./App.css";
import { Game } from "./pages/Game";

const { Button } = chakraTheme.components;

const theme = extendBaseTheme({
  components: {
    Button,
  },
});

function App() {
  return (
    <ChakraBaseProvider theme={theme}>
      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#000",
          color: "#FFF",
          p: 10,
          imageRendering: "pixelated !important",
        }}
      >
        <Game />
      </Box>
    </ChakraBaseProvider>
  );
}

export default App;
