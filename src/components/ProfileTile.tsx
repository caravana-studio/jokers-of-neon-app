import { Flex, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Icons } from "../constants/icons";
import { BLUE } from "../theme/colors";
import CachedImage from "./CachedImage";
import { IconComponent } from "./IconComponent";
import { useResponsiveValues } from "../theme/responsiveSettings";


export const ProfileTile = () => {
  const navigate = useNavigate();
  const { isSmallScreen } = useResponsiveValues();
  const PROFILE_IMG_SIZE = isSmallScreen ? 70 : 150;
  const ICON_SIZE = isSmallScreen ? "18px" : "30px";
  return (
    <Flex position="relative">
      <Flex
        position="absolute"
        borderRadius="full"
        right={-0.5}
        top={-1}
        p={1.5}
        bg={BLUE}
        boxShadow={`0 0 15px 2px ${BLUE}`}
        onClick={() => navigate("/settings")}
        cursor="pointer"
      >
        <IconComponent
          icon={Icons.SETTINGS}
          width={ICON_SIZE}
          height={ICON_SIZE}
        />
      </Flex>
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
            backgroundImage="url('/Cards/211.png')"
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
            LEVEL <span style={{ fontFamily: "Sonara" }}>3</span>
          </Heading>
        </Flex>
        <Flex width="75px" justifyContent={"flex-end"}>
          <CachedImage width={isSmallScreen ? "50px" : "70px"} src="/borders/profile-level.png" />
        </Flex>
      </Flex>
    </Flex>
  );
};
