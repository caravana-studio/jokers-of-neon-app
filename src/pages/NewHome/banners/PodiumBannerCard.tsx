import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import CachedImage from "../../../components/CachedImage";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

type PodiumBannerCardProps = {
  leaders: string[];
  title: string;
  buttonLabel: string;
  onButtonClick: () => void;
  headingExtras?: ReactNode;
};

export const PodiumBannerCard = ({
  leaders,
  title,
  buttonLabel,
  onButtonClick,
  headingExtras,
}: PodiumBannerCardProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const [firstLeader, secondLeader, thirdLeader] = leaders;

  return (
    <Flex
      w="100%"
      position="relative"
      overflow="hidden"
      h={isSmallScreen ? "140px" : "300px"}
      backgroundImage={"url('/banners/leaderboard-tile-bg.png')"}
      backgroundSize={"cover"}
      backgroundPosition={"center"}
      borderRadius={"15px"}
      p={4}
      flexDir={"column"}
    >
      <CachedImage
        position="absolute"
        bottom={isSmallScreen ? "-30px" : "-60px"}
        height={isSmallScreen ? "170px" : "350px"}
        src="/leaderboard/podium.png"
      />
      {firstLeader && (
        <Text
          position="absolute"
          left={isSmallScreen ? "68px" : "125px"}
          top={isSmallScreen ? "7px" : "35px"}
          width={isSmallScreen ? "70px" : "140px"}
          textAlign="center"
          lineHeight={0.9}
        >
          {firstLeader}
        </Text>
      )}
      {secondLeader && (
        <Text
          position="absolute"
          left={isSmallScreen ? "10px" : "8px"}
          top={isSmallScreen ? "44px" : "112px"}
          width={isSmallScreen ? "70px" : "140px"}
          textAlign="center"
          lineHeight={0.9}
        >
          {secondLeader}
        </Text>
      )}
      {thirdLeader && (
        <Text
          position="absolute"
          left={isSmallScreen ? "125px" : "245px"}
          top={isSmallScreen ? "63px" : "160px"}
          width={isSmallScreen ? "70px" : "140px"}
          textAlign="center"
          lineHeight={0.9}
        >
          {thirdLeader}
        </Text>
      )}
      <Flex w="100%" h="100%" flexDir="column" justifyContent="space-between">
        <Flex flexDir="column">
          <Heading
            fontSize={isSmallScreen ? "xs" : "lg"}
            mb={1}
            variant="italic"
            textAlign="right"
          >
            {title}
          </Heading>
          {headingExtras}
        </Flex>
        <Flex justifyContent={"flex-end"}>
          <Button
            size={isSmallScreen ? "sm" : "md"}
            height={isSmallScreen ? "20px" : "unset"}
            variant="secondarySolid"
            onClick={onButtonClick}
          >
            {buttonLabel}{" "}
            <FontAwesomeIcon
              style={{ marginLeft: "5px", marginTop: "2px" }}
              color="white"
              fontSize={isSmallScreen ? 7 : 15}
              icon={faArrowRight}
            />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
