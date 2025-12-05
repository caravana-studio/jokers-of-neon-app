import { Route, Routes, useLocation } from "react-router-dom";
import "../App.scss";

import { AnimatedPage } from "../components/AnimatedPage";
import { ExternalPack } from "../pages/ExternalPack/ExternalPack";
import { PurchasingPackPage } from "../pages/PurchasingPackPage";
import { ShopPage } from "../pages/Shop/ShopPage";

export const AppRoutes = () => {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <ShopPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/shop"
        element={
          <AnimatedPage>
            <ShopPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/external-pack/:packId?"
        element={
          <AnimatedPage>
            <ExternalPack />
          </AnimatedPage>
        }
      />
      <Route
        path="/purchasing-pack"
        element={
          <AnimatedPage>
            <PurchasingPackPage />
          </AnimatedPage>
        }
      />
      <Route
        path="*"
        element={
          <AnimatedPage>
            <ShopPage />
          </AnimatedPage>
        }
      />
    </Routes>
  );
};
