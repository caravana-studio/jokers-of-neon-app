import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";

import { DemoClosedHome } from "./pages/DemoClosedHome.tsx";
import customTheme from "./theme/theme";

function App() {
  const theme = extendTheme(customTheme);
  return (
    <ChakraBaseProvider theme={theme}>
      <Routes>
        <Route path="/" element={<DemoClosedHome />} />
        <Route path="/play" element={<Navigate to="/" />} />
      </Routes>
    </ChakraBaseProvider>
  );
}

export default App;
