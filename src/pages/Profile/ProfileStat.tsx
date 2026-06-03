import { Flex, Heading, Text } from "@chakra-ui/react";

interface ProfileStatProps {
  title: string;
  value: number;
  suffix?: string;
}

export const ProfileStat: React.FC<ProfileStatProps> = ({
  title,
  value,
  suffix,
}) => {
  return (
    <Flex
      py={2}
      px={4}
      borderRadius="12px"
      bg="rgba(0, 0, 0, 0.5)"
      boxShadow="0px 0px 8px rgba(255, 255, 255, 0.45), inset 0 0 5px rgba(255, 255, 255, 0.4)"
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      flexGrow={1}
      flex={1}
      width={"80px"}
    >
      <Heading fontSize={"9px"} whiteSpace="nowrap" fontFamily="Sonara">
        {title}
      </Heading>
      <Heading fontSize={"15px"}>
        {value}{" "}
        <Text as="span" ml={1} fontSize={"6px"}>
          {suffix}
        </Text>
      </Heading>
    </Flex>
  );
};
