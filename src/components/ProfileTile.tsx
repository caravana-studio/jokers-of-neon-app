import { Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../constants/icons";
import { BLUE } from "../theme/colors";
import CachedImage from "./CachedImage";
import { IconComponent } from "./IconComponent";
import { useResponsiveValues } from "../theme/responsiveSettings";
import { useEffect } from "react";
import { useProfileStore } from "../state/useProfileStore";
import { useDojo } from "../dojo/DojoContext";
import { useUsername } from "../dojo/utils/useUsername";

export const ProfileTile = () => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const PROFILE_IMG_SIZE = isSmallScreen ? 70 : 150;
  const ICON_SIZE = isSmallScreen ? "18px" : "30px";

  const loggedInUser = useUsername();

  const {
    setup: { account, client },
  } = useDojo();
  const { profileData, fetchProfileData, loading } = useProfileStore();

  useEffect(() => {
    if (client && account && loggedInUser && !loading) {
      fetchProfileData(
        client,
        account.account.address,
        account.account,
        loggedInUser
      );
    }
  }, [client, account, loggedInUser, profileData?.profile.username]);

  return (
    <Flex position="relative">
      <Flex
        p="3px"
        border={`1px solid ${BLUE}`}
        borderRadius="full"
        onClick={() => navigate("/profile")}
        cursor="pointer"
      >
        <Flex p="5px" border={`1px solid ${BLUE}`} borderRadius="full">
          <Flex
            borderRadius="full"
            backgroundImage={`url('/profile-pics/${profileData?.profile.avatarId}.png')`}
            backgroundSize="cover"
            backgroundPosition="center"
            height={`${PROFILE_IMG_SIZE}px`}
            width={`${PROFILE_IMG_SIZE}px`}
            justifyContent="center"
            alignItems="center"
          ></Flex>
        </Flex>
      </Flex>
      <Flex
        position="absolute"
        bottom={-1}
        w={`${PROFILE_IMG_SIZE + 20}px`}
        alignItems="center"
        flexDir={"column"}
      >
        <Flex
          backgroundColor="black"
          py={0.5}
          width={`${PROFILE_IMG_SIZE + 15}px`}
          borderRadius="full"
          border={`1px solid ${BLUE}`}
          justifyContent="center"
        >
          <Heading fontSize={isSmallScreen ? 9 : 12} textAlign="center">
            LEVEL{" "}
            <span style={{ fontFamily: "Sonara" }}>
              {profileData?.profile.level}
            </span>
          </Heading>
        </Flex>
        <Flex width="75px" justifyContent={"flex-end"}>
          <CachedImage
            width={isSmallScreen ? "50px" : "70px"}
            src="/borders/profile-level.png"
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
