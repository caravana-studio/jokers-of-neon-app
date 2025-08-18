import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { ProfilePicture } from "./ProfilePicture";
import { BLUE_LIGHT } from "../../theme/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";

export const ProfilePicturePicker = () => {
  const ids = [1, 2, 3, 4, 5, 6, 7];
  const iconsSize = "96px";

  return (
    <Box
      width={"100%"}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        position="relative"
        rounded="2xl"
        py={4}
        px={4}
        border="1px solid"
        borderColor="cyan.700"
        sx={{
          border: `1px solid rgba(255, 255, 255, 0.6)`,
          boxShadow: `0px 0px 14px 1px rgba(255, 255, 255, 0.6)`,
          backgroundColor: "rgba(0, 0, 0, 0.23)",
          borderRadius: "25px",
        }}
      >
        <IconButton
          aria-label="Close"
          icon={<CloseIcon />}
          position="absolute"
          top={"5%"}
          right={4}
          size="xl"
          color="white"
          variant="ghost"
          _hover={{ color: "white" }}
        />

        <Heading
          as="h2"
          fontSize="md"
          color="white"
          mb={6}
          borderBottom="1px solid"
          borderColor="white"
          pb={2}
          variant="italic"
        >
          SELECT PROFILE PICTURE
        </Heading>

        <Flex
          justify="center"
          gap={8}
          wrap={"wrap"}
          height={"40vh"}
          overflowY={"auto"}
          overflowX={"hidden"}
        >
          {ids.map((id) => (
            <ProfilePicture
              key={id}
              profilePictureId={id}
              border
              size={iconsSize}
            />
          ))}
          <Flex
            rounded="full"
            w={iconsSize}
            h={iconsSize}
            border="1px solid"
            borderColor="white"
            flexDir="column"
            color="white"
            _hover={{ borderColor: BLUE_LIGHT }}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Text fontSize="xs" letterSpacing="wide">
              CONNECT
            </Text>
            <Box backgroundColor={"black"} p={1} rounded={"sm"}>
              <FontAwesomeIcon icon={faXTwitter} style={{ color: "white" }} />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};
