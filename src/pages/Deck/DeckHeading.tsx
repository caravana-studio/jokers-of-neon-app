import { Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { BLUE_LIGHT } from "../../theme/colors";

export const DeckHeading = () => {
  const { t } = useTranslation(["game"]);

  return (
    <Heading
      variant="italic"
      size="l"
      width={"100%"}
      ml={4}
      textAlign={"center"}
      sx={{
        position: "relative",
        _after: {
          content: '""',
          position: "absolute",
          top: "-12px",
          left: 0,
          width: "100%",
          height: "1px",
          background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
          boxShadow:
            "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
        },
        _before: {
          content: '""',
          position: "absolute",
          bottom: "-12px",
          left: 0,
          width: "100%",
          height: "1px",
          background: `linear-gradient(to right, rgba(255, 255, 255, 0) 0%, ${BLUE_LIGHT} 50%, rgba(255, 255, 255, 0) 100%)`,
          boxShadow:
            "0 0 10px rgba(255, 255, 255, 0.5), 0 0 10px rgba(255, 255, 255, 0.5)",
        },
      }}
    >
      {t("game.deck.title")}
    </Heading>
  );
};
