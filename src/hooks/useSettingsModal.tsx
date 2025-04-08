import { useState } from "react";
import { SettingsModal } from "../components/SettingsModal";

export const useSettingsModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openSettings = () => setIsOpen(true);
  const closeSettings = () => setIsOpen(false);

  const Modal = isOpen ? <SettingsModal close={closeSettings} /> : null;

  return { openSettings, Modal };
};
