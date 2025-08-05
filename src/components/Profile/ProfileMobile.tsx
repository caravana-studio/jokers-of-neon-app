import { Divider, Flex } from "@chakra-ui/react";
import { ProfileStats } from "./ProfileStats";
import { UserBadges } from "./UserBadges";
import { LogoutMenuBtn } from "../Menu/Buttons/Logout/LogoutMenuBtn";
import { DeleteAccBtn } from "../Menu/Buttons/DeleteAccBtn";
import { ControllerIcon } from "../../icons/ControllerIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { profileMock } from "../../utils/mocks/profileMocks";
import { MobileDecoration } from "../MobileDecoration";

export const ProfileMobile = () => {
  const username = profileMock.username;
  const level = profileMock.level;
  const streak = profileMock.streak;
  const games = profileMock.games;
  const victories = profileMock.victories;
  const currentXp = profileMock.currentXp;
  const levelXp = profileMock.levelXp;
  const currentBadges = profileMock.currentBadges;
  const totalBadges = profileMock.totalBadges;

  const btnWidth = "18px";

  return (
    <>
      <MobileDecoration />
      <Flex flexDirection={"column"} gap={1} w={"100vw"} height={"100%"} p={8}>
        <ProfileStats
          username={username}
          level={level}
          streak={streak}
          games={games}
          victories={victories}
          currentXp={currentXp}
          levelXp={levelXp}
        />

        <UserBadges currentBadges={currentBadges} totalBadges={totalBadges} />

        <Flex flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
          <Divider borderColor="white" borderWidth="1px" my={2} />
          <Flex justifyContent={"space-between"}>
            <LogoutMenuBtn width={btnWidth} label={true} />
            <FontAwesomeIcon icon={faArrowRight} />
          </Flex>
          <Divider borderColor="white" borderWidth="1px" my={2} />
          <Flex justifyContent={"space-between"}>
            <DeleteAccBtn width={btnWidth} label={true} />
            <FontAwesomeIcon icon={faArrowRight} />
          </Flex>
          <Divider borderColor="white" borderWidth="1px" my={2} />
          <Flex justifyContent={"space-between"}>
            <ControllerIcon width={btnWidth} label={true} />
            <FontAwesomeIcon icon={faArrowRight} />
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
