import { create } from "zustand";

interface MapNavigationState {
  activeNodeId: string | null;
  pulsingNodeId: string | null;
  isNodeTransactionPending: boolean;
  setActiveNodeId: (id: string | null) => void;
  setPulsingNodeId: (id: string | null) => void;
  setNodeTransactionPending: (pending: boolean) => void;
}

export const useMapNavigationStore = create<MapNavigationState>((set) => ({
  activeNodeId: null,
  pulsingNodeId: null,
  isNodeTransactionPending: false,
  setActiveNodeId: (id) => set({ activeNodeId: id }),
  setPulsingNodeId: (id) => set({ pulsingNodeId: id }),
  setNodeTransactionPending: (pending) => set({ isNodeTransactionPending: pending }),
}));
