import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes } from "react-router-dom";
import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Home } from "./pages/Home";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import customTheme from "./theme/theme";

function App() {
  const theme = extendTheme(customTheme);
  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </CardAnimationsProvider>
      <Analytics />
      <SpeedInsights />
    </ChakraBaseProvider>
  );
}

export default App;
