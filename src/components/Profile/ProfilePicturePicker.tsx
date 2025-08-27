import { CloseIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, IconButton, Text } from "@chakra-ui/react";
import { ProfilePicture } from "./ProfilePicture";
import { BLUE_LIGHT } from "../../theme/colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXTwitter } from "@fortawesome/free-brands-svg-icons";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ProfilePicturePickerProps {
  onClose?: () => void;
  onSelect?: (id: number | string) => void;
}

export const ProfilePicturePicker: React.FC<ProfilePicturePickerProps> = ({
  onClose,
  onSelect,
}) => {
  const ids = useMemo(() => [1, 2, 3, 4, 5, 6, 7], []);
  const iconsSize = "96px";
  const hoverStyle = {
    border: `1px solid rgba(255, 255, 255, 0.6)`,
    boxShadow: `0px 0px 14px 1px ${BLUE_LIGHT}`,
    transform: "scale(1.05)",
    transition: "all 0.2s ease-in-out",
    cursor: "pointer",
  };

  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "profile-menu",
  });

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
          onClick={onClose}
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
          {t("select-profile-picture")}
        </Heading>

        <Flex
          justify="center"
          gap={8}
          wrap={"wrap"}
          height={"40vh"}
          overflowY={"auto"}
          overflowX={"hidden"}
          paddingY={4}
        >
          {ids.map((id) => (
            <ProfilePicture
              key={id}
              profilePictureId={id}
              border
              size={iconsSize}
              onClick={() => onSelect?.(id)}
              hover={hoverStyle}
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
            _hover={hoverStyle}
            justifyContent={"center"}
            alignItems={"center"}
            onClick={() => onSelect?.("")}
          >
            <Text
              fontSize="xs"
              letterSpacing="wide"
              textTransform={"uppercase"}
            >
              {t("connect")}
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
