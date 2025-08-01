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
    <Flex py={2} px={4} border={"1px"} borderColor={"white"} rounded={"md"}>
      <Heading mb={2}>{title}</Heading>
      <Heading>
        {value} <Text as="span">{suffix}</Text>
      </Heading>
    </Flex>
  );
};
