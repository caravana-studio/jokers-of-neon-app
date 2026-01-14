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
      py={1}
      px={4}
      border={"1px"}
      borderColor={"white"}
      rounded={"xl"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      flexGrow={1}
      flex={1}
      width={"80px"}
    >
      <Heading fontSize={"10px"} whiteSpace="nowrap">
        {title}
      </Heading>
      <Heading fontSize={"10px"}>
        {value}{" "}
        <Text as="span" ml={1} fontSize={"6px"}>
          {suffix}
        </Text>
      </Heading>
    </Flex>
  );
};
