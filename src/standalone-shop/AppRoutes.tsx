import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import "../App.scss";

import { AnimatedPage } from "../components/AnimatedPage";
import { BrowseListingsPage } from "../marketplace/pages/Marketplace/BrowseListingsPage";
import { CardDetailPage } from "../marketplace/pages/Marketplace/CardDetailPage";
import { CreateListingPage } from "../marketplace/pages/Marketplace/CreateListingPage";
import { MyListingsPage } from "../marketplace/pages/Marketplace/MyListingsPage";
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
            <BrowseListingsPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/listing/:id"
        element={
          <AnimatedPage>
            <CardDetailPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/sell"
        element={
          <AnimatedPage>
            <CreateListingPage />
          </AnimatedPage>
        }
      />
      <Route
        path="/my-listings"
        element={
          <AnimatedPage>
            <MyListingsPage />
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
      <Route path="/external-packs" element={<Navigate to="/shop" replace />} />
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
};
