import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/useDojo";
import { useProfileStore } from "../state/useProfileStore";

interface LoginGateProps {
  children: React.ReactNode;
  translationKey?: string;
}

export const LoginGate = ({ children, translationKey }: LoginGateProps) => {
  const {
    setup: { useBurnerAcc, client },
    switchToController,
  } = useDojo();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "common",
  });

  const { fetchProfileData } = useProfileStore();

  return useBurnerAcc ? (
    <Flex
      w="100%"
      h="100%"
      flexDir="column"
      gap={5}
      justifyContent="center"
      alignItems="center"
    >
      <Text textAlign="center" size="lg" maxW="80%">
        {t(translationKey ?? "login-to-access")}
      </Text>
      <Button
        size={["md", "sm"]}
        onClick={() =>
          switchToController((newUsername) => {
            fetchProfileData(
              client,
              newUsername.account.address,
              newUsername.account,
              newUsername.username
            );
          })
        }
      >
        {t("login")}
        <img
          src={Icons.CARTRIDGE}
          width={"16px"}
          style={{ marginLeft: "8px" }}
        />
      </Button>
    </Flex>
  ) : (
    children
  );
};
