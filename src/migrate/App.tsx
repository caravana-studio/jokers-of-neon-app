import "../App.scss";

import { Toaster } from "sonner";
import { MigrateWalletPage } from "../pages/MigrateWallet/MigrateWalletPage";
import ZoomPrevention from "../utils/ZoomPrevention";

function App() {
  return (
    <ZoomPrevention>
      <MigrateWalletPage />
      <Toaster />
    </ZoomPrevention>
  );
}

export default App;
