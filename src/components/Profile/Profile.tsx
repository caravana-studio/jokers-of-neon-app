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
import { profileMock } from "../../utils/mocks/profileMocks";
import { useDojo } from "../../dojo/DojoContext";
import { ModalProps } from "../../types/Modals";

export const Profile = ({ close }: ModalProps) => {
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
  const { setup } = useDojo();

  return (
    <>
      <Modal isOpen={true} onClose={() => {}} isCentered>
        <ModalOverlay
          bg="blackAlpha.400"
          backdropFilter="auto"
          backdropBlur="5px"
        />
        <ModalContent width={"70%"}>
          <ModalCloseButton onClick={close} />
          <ModalBody>
            <ProfileStats
              username={username}
              level={level}
              streak={streak}
              games={games}
              victories={victories}
              currentXp={currentXp}
              levelXp={levelXp}
            />

            <Divider borderColor="white" borderWidth="1px" my={2} />

            <Flex
              gap={4}
              flexDirection={"row"}
              justifyContent={"space-between"}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
