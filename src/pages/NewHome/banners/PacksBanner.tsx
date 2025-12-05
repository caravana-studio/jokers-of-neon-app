import { Flex } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CachedImage from "../../../components/CachedImage";
import { packAnimation } from "../../../constants/animations";
import { useResponsiveValues } from "../../../theme/responsiveSettings";
import { RegularBanner } from "./RegularBanner";

interface PacksBannerProps {
  packs: number[];
}

export const PacksBanner = ({ packs }: PacksBannerProps) => {
  const { t } = useTranslation("home", {
    keyPrefix: "packs",
  });
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();

  return (
    <RegularBanner title={t("title")} onClick={() => navigate("/shop")}>
      <Flex
        w="100%"
        justifyContent="center"
        alignItems="center"
        gap={isSmallScreen ? 4 : 8}
        mb={isSmallScreen ? 3 : 5}
      >
        {packs.map((packId, index) => (
          <CachedImage
            key={index}
            animation={`${packAnimation} ${index === 0 ? 3.5 : index === 1 ? 4.5 : 4}s ease-in-out infinite`}
            w={"25%"}
            maxWidth={"150px"}
            src={`/packs/${packId}.png`}
            boxShadow={
              "0 0 7px 0px rgba(255,255,255,0.5), inset 0 0 3px 0 rgba(255,255,255,0.5)"
            }
          />
        ))}
      </Flex>
    </RegularBanner>
  );
};
