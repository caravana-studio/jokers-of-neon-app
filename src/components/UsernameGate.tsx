import { useEffect, useMemo, useRef, useState } from "react";
import { LOGGED_USER } from "../constants/localStorage";
import { useDojo } from "../dojo/DojoContext";
import { useCavosSafe } from "../dojo/cavos/CavosConfig";
import { controller } from "../dojo/controller/controller";
import { useCustomToast } from "../hooks/useCustomToast";
import { useUsernameStore } from "../state/useUsernameStore";
import { normalizeStarknetAddress } from "../utils/starknetAddress";
import { UsernameModal } from "./UsernameModal";

function guestUsernameForAddress(address: string): string {
  const normalized = normalizeStarknetAddress(address).replace(/^0x/, "");
  return `guest_${normalized.slice(-8)}`;
}

function isValidStoredGuestUsername(username: string | null): username is string {
  return Boolean(
    username &&
      username.length >= 3 &&
      username.length <= 15 &&
      /^[A-Za-z0-9._-]+$/.test(username)
  );
}

function getValidPrefill(value?: string | null): string {
  const candidate = String(value ?? "")
    .trim()
    .split("@")[0]
    .replace(/[^A-Za-z0-9._-]/g, "")
    .slice(0, 15);

  return candidate.length >= 3 ? candidate : "";
}

export const UsernameGate = () => {
  const {
    account: { account },
    setup: { accountType },
  } = useDojo();
  const status = useUsernameStore((store) => store.status);
  const username = useUsernameStore((store) => store.username);
  const createUsernameForAddress = useUsernameStore(
    (store) => store.createUsernameForAddress
  );
  const cavos = useCavosSafe();
  const { showErrorToast } = useCustomToast();
  const [prefill, setPrefill] = useState("");
  const [saving, setSaving] = useState(false);
  const autoCreatingForRef = useRef<string | null>(null);

  const address = account?.address ?? "";
  const isBurner = accountType === "burner";
  const isMissing = status === "missing" && !username;

  const modalOpen = useMemo(
    () => Boolean(address && isMissing && !isBurner),
    [address, isBurner, isMissing]
  );

  useEffect(() => {
    if (!modalOpen) return;

    if (accountType === "cavos") {
      const cavosPrefill =
        getValidPrefill(cavos?.user?.email) || getValidPrefill(cavos?.user?.name);
      if (cavosPrefill) {
        setPrefill(cavosPrefill);
        return;
      }
    }

    let cancelled = false;
    controller
      ?.username?.()
      ?.then((controllerUsername) => {
        const controllerPrefill = getValidPrefill(controllerUsername);
        if (!cancelled && controllerPrefill) {
          setPrefill(controllerPrefill);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [accountType, cavos?.user?.email, cavos?.user?.name, modalOpen]);

  useEffect(() => {
    if (!address || !isBurner || !isMissing) return;

    const normalizedAddress = normalizeStarknetAddress(address);
    if (autoCreatingForRef.current === normalizedAddress) return;
    autoCreatingForRef.current = normalizedAddress;

    const storedGuestUsername = window.localStorage.getItem(LOGGED_USER);
    const guestUsername = isValidStoredGuestUsername(storedGuestUsername)
      ? storedGuestUsername
      : guestUsernameForAddress(normalizedAddress);

    window.localStorage.setItem(LOGGED_USER, guestUsername);

    createUsernameForAddress(normalizedAddress, guestUsername).catch((error) => {
      const fallbackUsername = guestUsernameForAddress(normalizedAddress);
      if (fallbackUsername !== guestUsername) {
        window.localStorage.setItem(LOGGED_USER, fallbackUsername);
        createUsernameForAddress(normalizedAddress, fallbackUsername).catch(() => {
          showErrorToast("Could not create guest username");
        });
        return;
      }
      console.error("Could not create guest username", error);
      showErrorToast("Could not create guest username");
    });
  }, [address, createUsernameForAddress, isBurner, isMissing, showErrorToast]);

  const handleSave = async (nextUsername: string) => {
    if (!address) return;
    setSaving(true);
    try {
      await createUsernameForAddress(address, nextUsername);
    } catch (error) {
      throw error;
    } finally {
      setSaving(false);
    }
  };

  return (
    <UsernameModal
      isOpen={modalOpen}
      isRequired
      isSaving={saving}
      initialUsername={prefill}
      onSave={handleSave}
    />
  );
};
