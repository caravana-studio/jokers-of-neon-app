import { Flex, SystemStyleObject } from "@chakra-ui/react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProfilePictureProps {
  profilePictureId?: number | string;
  border?: boolean;
  size?: string;
  onClick?: () => void;
  editMode?: boolean;
  hover?: SystemStyleObject;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePictureId,
  border,
  size = "140px",
  onClick,
  editMode,
  hover,
}) => {
  const pictureUrl =
    typeof profilePictureId === "string"
      ? profilePictureId
      : `url('/profile-pics/${profilePictureId}.png')`;
  return (
    <Flex
      w={size}
      height={size}
      rounded={"full"}
      backgroundColor={"gray"}
      backgroundImage={pictureUrl}
      backgroundSize="cover"
      backgroundPosition="center"
      border={border ? "1px solid white" : "none"}
      cursor={onClick ? "pointer" : "default"}
      onClick={() => onClick?.()}
      justifyContent={"center"}
      alignItems={"center"}
      _hover={hover}
    >
      {editMode && <FontAwesomeIcon icon={faPencil} size="xl" />}
    </Flex>
  );
};
