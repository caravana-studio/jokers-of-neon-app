import { useEffect, useMemo, useRef, useState } from "react";
import { LOGGED_USER } from "../constants/localStorage";
import { useDojo } from "../dojo/DojoContext";
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

    let cancelled = false;
    controller
      ?.username?.()
      ?.then((controllerUsername) => {
        if (!cancelled && controllerUsername) {
          setPrefill(controllerUsername.slice(0, 15));
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [modalOpen]);

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
