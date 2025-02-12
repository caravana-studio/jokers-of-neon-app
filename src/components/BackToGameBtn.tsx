import { Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useResponsiveValues } from "../theme/responsiveSettings";

export const BackToGameBtn: React.FC<{ state?: { inStore: boolean } }> = ({
  state,
}) => {
  const { t } = useTranslation(["game"]);
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <Button
      minWidth={"100px"}
      size={isSmallScreen ? "xs" : "md"}
      lineHeight={1.6}
      variant="secondarySolid"
      fontSize={isSmallScreen ? 10 : [10, 10, 10, 14, 14]}
      onClick={() => {
        if (state) {
          state.inStore
            ? navigate("/store", { state: { lastTabIndex: 2 } })
            : navigate("/demo", {
                state: { skipRageAnimation: true },
              });
        } else navigate(-1);
      }}
    >
      {t("game.deck.btns.back").toUpperCase()}
    </Button>
  );
};
