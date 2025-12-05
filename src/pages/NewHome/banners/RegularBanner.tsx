import { Flex, Heading } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Clock } from "../../../components/Clock";
import { useResponsiveValues } from "../../../theme/responsiveSettings";

interface RegularBannerProps extends PropsWithChildren {
  title: string;
  date?: Date;
  onClick?: () => void;
}

export const RegularBanner = ({
  title,
  children,
  date,
  onClick,
}: RegularBannerProps) => {
  const { isSmallScreen } = useResponsiveValues();
  return (
    <Flex
      w="100%"
      h="auto"
      backgroundColor="rgba(0,0,0,0.5)"
      borderRadius={"15px"}
      px={isSmallScreen ? 4 : 6}
      py={isSmallScreen ? 1 : 4}
      flexDir={"column"}
      onClick={onClick}
      cursor={onClick ? "pointer" : "default"}
    >
      <Flex w="100%" justifyContent="space-between" alignItems="center">
        <Heading
          mt={1}
          fontSize={isSmallScreen ? 12 : 16}
          mb={2}
          variant="italic"
        >
          {title}
        </Heading>
        {date && <Clock date={date} />}
      </Flex>
      <Flex w="100%" flexDir="column">
        {children}
      </Flex>
    </Flex>
  );
};
