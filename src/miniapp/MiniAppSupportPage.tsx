import { Box, Link, Text } from "@chakra-ui/react";
import { MiniAppInfoPageLayout } from "./MiniAppInfoPageLayout";

export const MiniAppSupportPage = () => {
  return (
    <MiniAppInfoPageLayout title="Support">
      <Box
        bg="rgba(0, 0, 0, 0.45)"
        border="1px solid rgba(255, 255, 255, 0.12)"
        borderRadius="2xl"
        p={{ base: 5, md: 7 }}
      >
        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall" mb={4}>
          If you have questions, found a bug, or need help with anything in the
          mini app, we are here to help.
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall">
          If you need support, contact{" "}
          <Link href="mailto:gm@jokersofneon.com" color="purple.200">
            gm@jokersofneon.com
          </Link>
          {" "}and include as much detail as you can so we can assist you
          faster.
        </Text>
        <Text fontSize={{ base: "md", md: "lg" }} lineHeight="tall" mt={4}>
          You can also reach us on{" "}
          <Link
            href="https://discord.gg/4y296W6jaq"
            color="purple.200"
            isExternal
          >
            Discord
          </Link>
          {" "}if you prefer to contact us there.
        </Text>
      </Box>
    </MiniAppInfoPageLayout>
  );
};
