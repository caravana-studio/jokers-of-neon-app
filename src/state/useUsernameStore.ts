import { create } from "zustand";
import {
  createUsername,
  fetchUsernameByAddress,
  updateUsername,
  UsernameApiError,
  UsernameRecord,
} from "../api/usernames";
import { addressKey, normalizeStarknetAddress } from "../utils/starknetAddress";

type UsernameStatus = "idle" | "loading" | "ready" | "missing" | "error";

type UsernameStore = {
  address: string | null;
  username: string | null;
  status: UsernameStatus;
  error: string | null;
  loadUsername: (address: string) => Promise<string | null>;
  createUsernameForAddress: (address: string, username: string) => Promise<UsernameRecord>;
  updateUsernameForAddress: (address: string, username: string) => Promise<UsernameRecord>;
  setUsernameForAddress: (address: string, username: string) => void;
  reset: () => void;
};

export const useUsernameStore = create<UsernameStore>((set, get) => ({
  address: null,
  username: null,
  status: "idle",
  error: null,

  loadUsername: async (address) => {
    const normalizedAddress = normalizeStarknetAddress(address);
    const current = get();

    if (
      current.address === normalizedAddress &&
      (current.status === "loading" || current.status === "ready")
    ) {
      return current.username;
    }

    set({
      address: normalizedAddress,
      username: null,
      status: "loading",
      error: null,
    });

    try {
      const record = await fetchUsernameByAddress(normalizedAddress);
      if (!record) {
        set({
          address: normalizedAddress,
          username: null,
          status: "missing",
          error: null,
        });
        return null;
      }

      set({
        address: addressKey(record.address),
        username: record.username,
        status: "ready",
        error: null,
      });
      return record.username;
    } catch (error) {
      set({
        address: normalizedAddress,
        username: null,
        status: "error",
        error: error instanceof Error ? error.message : "Failed to load username",
      });
      return null;
    }
  },

  createUsernameForAddress: async (address, username) => {
    const normalizedAddress = normalizeStarknetAddress(address);
    set({ address: normalizedAddress, status: "loading", error: null });

    try {
      const record = await createUsername(normalizedAddress, username);
      set({
        address: addressKey(record.address),
        username: record.username,
        status: "ready",
        error: null,
      });
      return record;
    } catch (error) {
      set({
        address: normalizedAddress,
        username: null,
        status: "missing",
        error: error instanceof Error ? error.message : "Failed to create username",
      });
      throw error;
    }
  },

  updateUsernameForAddress: async (address, username) => {
    const normalizedAddress = normalizeStarknetAddress(address);
    set({ address: normalizedAddress, status: "loading", error: null });

    try {
      const record = await updateUsername(normalizedAddress, username);
      set({
        address: addressKey(record.address),
        username: record.username,
        status: "ready",
        error: null,
      });
      return record;
    } catch (error) {
      set({
        address: normalizedAddress,
        status: get().username ? "ready" : "missing",
        error:
          error instanceof UsernameApiError
            ? error.message
            : error instanceof Error
              ? error.message
              : "Failed to update username",
      });
      throw error;
    }
  },

  setUsernameForAddress: (address, username) => {
    set({
      address: normalizeStarknetAddress(address),
      username,
      status: "ready",
      error: null,
    });
  },

  reset: () =>
    set({
      address: null,
      username: null,
      status: "idle",
      error: null,
    }),
}));
