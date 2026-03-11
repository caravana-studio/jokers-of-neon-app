import { ChakraProvider } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import theme from "./theme/theme";
import { StarknetProvider } from "./providers/StarknetProvider";
import { RevenueCatProvider } from "../providers/RevenueCatProvider";
import { SeasonPassProvider } from "../providers/SeasonPassProvider";
import { MarketplaceProvider } from "./providers/MarketplaceProvider";
import { BrowseListingsPage } from "./pages/Marketplace/BrowseListingsPage";
import { CardDetailPage } from "./pages/Marketplace/CardDetailPage";
import { CreateListingPage } from "./pages/Marketplace/CreateListingPage";
import { MyListingsPage } from "./pages/Marketplace/MyListingsPage";
import { ShopPage } from "./pages/Shop/ShopPage";
import { ExternalPacksPage } from "./pages/Shop/ExternalPacksPage";
import { Layout } from "./components/Layout";
import { AnimatedPage } from "./components/AnimatedPage";

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<AnimatedPage><BrowseListingsPage /></AnimatedPage>} />
        <Route path="/listing/:id" element={<AnimatedPage><CardDetailPage /></AnimatedPage>} />
        <Route path="/sell" element={<AnimatedPage><CreateListingPage /></AnimatedPage>} />
        <Route path="/my-listings" element={<AnimatedPage><MyListingsPage /></AnimatedPage>} />
        <Route path="/shop" element={<AnimatedPage><ShopPage /></AnimatedPage>} />
        <Route path="/external-packs" element={<AnimatedPage><ExternalPacksPage /></AnimatedPage>} />
        <Route path="/external-pack/:packId" element={<AnimatedPage><ExternalPacksPage /></AnimatedPage>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <StarknetProvider>
        <RevenueCatProvider>
          <SeasonPassProvider>
          <MarketplaceProvider>
            <BrowserRouter>
              <Layout>
                <AppRoutes />
              </Layout>
            </BrowserRouter>
          </MarketplaceProvider>
          </SeasonPassProvider>
        </RevenueCatProvider>
      </StarknetProvider>
    </ChakraProvider>
  );
}
