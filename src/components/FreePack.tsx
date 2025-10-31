import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getNextFreePackTime } from "../api/getNextFreePackTime";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/DojoContext";
import { BLUE } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { Clock } from "./Clock";
import { IconComponent } from "./IconComponent";

export const FreePack = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("home", {
    keyPrefix: "packs",
  });
  const {
    account: { account },
  } = useDojo();

  const navigate = useNavigate();

  const [nextTime, setNextTime] = useState<Date | undefined>(undefined);
  const [canClaim, setCanClaim] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (account?.address) {
      getNextFreePackTime(account.address).then((date) => {
        console.log("Free pack date", date);
        setNextTime(date.nextTime);
        setCanClaim(date.canClaim);
        setIsLoading(false);
      });
    }
  }, [account?.address]);

  return (
    <Flex
      zIndex={999}
      position="absolute"
      left="0"
      bottom={isSmallScreen ? "30px" : "70px"}
      backgroundColor="black"
      w={isSmallScreen ? "140px" : "240px"}
      h={isSmallScreen ? (canClaim ? "70px" : "60px") : "110px"}
      borderRadius="0 50px 50px 0"
      justifyContent="center"
      alignItems="center"
      boxShadow={
        canClaim ? `0 0 10px 5px ${BLUE}` : "0 0 10px 0px rgba(255,255,255,0.5)"
      }
    >
      {isLoading ? (
        <Spinner color="white" size="sm" />
      ) : (
        <Flex gap={3}>
          <IconComponent
            icon={Icons.FREEPACK}
            height={isSmallScreen ? "40px" : "80px"}
            width="auto"
          />
          <Flex
            flexDir="column"
            gap={canClaim ? 2 : 1}
            h={isSmallScreen ? "40px" : "80px"}
            justifyContent="center"
            alignItems="center"
            w={isSmallScreen ? "75px" : "120px"}
          >
            {!canClaim && (
              <Text
                fontSize={isSmallScreen ? 9 : 14}
                w={isSmallScreen ? "50px" : "70px"}
                lineHeight={1}
                textAlign={"center"}
              >
                {t("free-pack-in")}
              </Text>
            )}
            {!canClaim && nextTime && (
              <Clock
                date={nextTime}
                fontSize={isSmallScreen ? 9 : 14}
                iconSize={isSmallScreen ? "10px" : "14px"}
              />
            )}
            {canClaim && (
              <Text
                fontSize={isSmallScreen ? 10 : 14}
                w={isSmallScreen ? "65px" : "80px"}
                lineHeight={1}
                textAlign={"center"}
                fontWeight={"bold"}
              >
                {t("free-pack-ready")}
              </Text>
            )}
            {canClaim && (
              <Button
                h={isSmallScreen ? "16px" : "30px"}
                fontSize={isSmallScreen ? 10 : 14}
                size="xs"
                onClick={() => navigate("/free-pack")}
              >
                {t("claim-now")}
              </Button>
            )}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
