import { createContext, useContext } from "react";

export const CavosBridgeContext = createContext<any | null>(null);

export const useCavosSafe = () => useContext(CavosBridgeContext);
