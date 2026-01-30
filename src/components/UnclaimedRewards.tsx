import { Button, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../api/profile";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/DojoContext";
import { VIOLET } from "../theme/colors";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { IconComponent } from "./IconComponent";

export const UnclaimedRewards = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { t } = useTranslation("home", {
    keyPrefix: "packs",
  });
  const {
    account: { account },
  } = useDojo();

  const navigate = useNavigate();

  const [rewardsLeftToClaim, setRewardsLeftToClaim] = useState<number[]>([]);

  useEffect(() => {
    if (account?.address) {
      fetchProfile(account.address)
        .then((profile) => {
          setRewardsLeftToClaim(profile.claimablePacks ?? []);
        })
        .catch(() => {
          setRewardsLeftToClaim([]);
        });
    }
  }, [account?.address]);

  return (
    rewardsLeftToClaim.length > 0 && (
      <Flex
        zIndex={999}
        position="absolute"
        left="0"
        bottom={isSmallScreen ? "110px" : "190px"}
        backgroundColor="black"
        w={isSmallScreen ? "140px" : "240px"}
        h={isSmallScreen ? "70px" : "110px"}
        borderRadius="0 50px 50px 0"
        justifyContent="center"
        alignItems="center"
        boxShadow={`0 0 10px 5px ${VIOLET}`}
      >
        <Flex gap={3} alignItems="center">
          <IconComponent
            icon={Icons.GIFT}
            height={isSmallScreen ? "40px" : "60px"}
            width="auto"
          />
          <Flex
            flexDir="column"
            gap={2}
            h={isSmallScreen ? "40px" : "80px"}
            justifyContent="center"
            alignItems="center"
            w={isSmallScreen ? "75px" : "120px"}
          >
            <Text
              fontSize={isSmallScreen ? 10 : 14}
              w={isSmallScreen ? "65px" : "80px"}
              lineHeight={1}
              textAlign={"center"}
              fontWeight={"bold"}
            >
              {t("rewards-left-to-claim")}
            </Text>

            <Button
              h={isSmallScreen ? "16px" : "30px"}
              fontSize={isSmallScreen ? 10 : 14}
              size="xs"
              variant="secondarySolid"
              onClick={() => {
                navigate("/unclaimed-rewards")
                setRewardsLeftToClaim([]);
              }}
            >
              {t("claim-now")}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    )
  );
};
