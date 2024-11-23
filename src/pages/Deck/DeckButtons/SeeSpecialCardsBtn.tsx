import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CurrentSpecialCardsModal } from "../../../components/CurrentSpecialCardsModal";

export const SeeSpecialCardsBtn = () => {
  const { t } = useTranslation(["game"]);
  const [specialCardsModalOpen, setSpecialCardsModalOpen] = useState(false);

  return (
    <>
      {specialCardsModalOpen && (
        <CurrentSpecialCardsModal
          close={() => setSpecialCardsModalOpen(false)}
        />
      )}
      <Button
        variant={"outlinePrimaryGlow"}
        onClick={() => {
          setSpecialCardsModalOpen(true);
        }}
      >
        {t("game.deck.btns.special-cards").toUpperCase()}
      </Button>
    </>
  );
};
