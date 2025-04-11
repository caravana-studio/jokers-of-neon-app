import { Box, Heading } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface PurchasedLblProps {
  purchased: boolean;
  fontSize: number;
  position?: "centered" | "bottom";
  topOffset?: string;
}

export const PurchasedLbl: React.FC<PurchasedLblProps> = ({
  purchased,
  fontSize,
  topOffset,
  position = "centered",
}) => {
  const { t } = useTranslation(["store"]);

  if (!purchased) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        ...(position === "centered" ? { top: topOffset } : { bottom: "15%" }),
      }}
    >
      <Heading variant="italic" fontSize={fontSize} textAlign="center">
        {t("store.labels.purchased").toLocaleUpperCase()}
      </Heading>
    </Box>
  );
};
