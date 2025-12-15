import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Icons } from "../constants/icons";
import { useDojo } from "../dojo/useDojo";
import { useProfileStore } from "../state/useProfileStore";

export const LoginGate = ({ children }: { children: React.ReactNode }) => {
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
      <Text textAlign="center" size="lg">
        {t("login-to-access")}
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
