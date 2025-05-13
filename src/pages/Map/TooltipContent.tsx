import { Flex, Heading, Text } from "@chakra-ui/react";

interface TooltipContentProps {
  title: string;
  content?: string;
}

export const TooltipContent = ({ title, content }: TooltipContentProps) => {
  return (
    <Flex px={4} py={2} textAlign="left" justifyContent="left" flexDir="column">
      <Heading fontSize={{ base: "12px", sm: "14px" }} flexWrap="nowrap">
        {title}
      </Heading>
      {content && (
        <Text color="lightViolet" fontSize={{ base: "10px", sm: "15px" }}>
          {content}
        </Text>
      )}
    </Flex>
  );
};
