import { Flex } from "@chakra-ui/react";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ProfilePictureProps {
  profilePictureId?: number;
  border?: boolean;
  size?: string;
  onClick?: () => void;
  editMode?: boolean;
}

export const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profilePictureId,
  border,
  size = "140px",
  onClick,
  editMode,
}) => {
  return (
    <Flex
      w={size}
      height={size}
      rounded={"full"}
      backgroundColor={"gray"}
      backgroundImage={`url('/profile-pics/${profilePictureId}.png')`}
      backgroundSize="cover"
      backgroundPosition="center"
      border={border ? "1px solid white" : "none"}
      cursor={onClick ? "pointer" : "default"}
      onClick={() => onClick?.()}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {editMode && <FontAwesomeIcon icon={faPencil} size="xl" />}
    </Flex>
  );
};
