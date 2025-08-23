import {
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { ProfileStats } from "./ProfileStats";
import { UserBadges } from "./UserBadges";
import { LogoutMenuBtn } from "../Menu/Buttons/Logout/LogoutMenuBtn";
import { DeleteAccBtn } from "../Menu/Buttons/DeleteAccBtn";
import { ControllerIcon } from "../../icons/ControllerIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDojo } from "../../dojo/DojoContext";
import { DelayedLoading } from "../DelayedLoading";

export const ProfileDesktop = ({ data }: { data: ProfileData }) => {
  const {
    username,
    level,
    streak,
    games,
    victories,
    currentXp,
    levelXp,
    currentBadges,
    totalBadges,
  } = data;

  const btnWidth = "18px";
  const { setup } = useDojo();

  return (
    <DelayedLoading ms={100}>
      <Flex
        width={"100%"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        p={16}
        overflowY={"scroll"}
      >
        <Flex
          width={"50%"}
          flexDirection={"row"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <ProfileStats
            username={username}
            level={level}
            streak={streak}
            games={games}
            victories={victories}
            currentXp={currentXp}
            levelXp={levelXp}
          />
        </Flex>

        <Flex
          flexDirection={"row"}
          width={"50%"}
          gap={4}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Flex
            gap={2}
            w={"100%"}
            flexDirection={"column"}
            justifyContent={"center"}
          >
            <UserBadges
              currentBadges={currentBadges}
              totalBadges={totalBadges}
            />

            <Flex flexDirection={"column"} gap={2} w={"100%"} color={"white"}>
              {!setup.useBurnerAcc && (
                <>
                  <Flex justifyContent={"space-between"}>
                    <LogoutMenuBtn width={btnWidth} label={true} />
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Flex>
                </>
              )}

              <Flex justifyContent={"space-between"}>
                <DeleteAccBtn width={btnWidth} label={true} />
                <FontAwesomeIcon icon={faArrowRight} />
              </Flex>
              {!setup.useBurnerAcc && (
                <>
                  <Flex justifyContent={"space-between"}>
                    <ControllerIcon width={btnWidth} label={true} />
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Flex>
                </>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </DelayedLoading>
  );
};
