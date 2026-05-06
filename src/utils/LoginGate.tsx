import { Button, Flex, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDojo } from "../dojo/useDojo";

interface LoginGateProps {
  children: React.ReactNode;
  translationKey?: string;
}

export const LoginGate = ({ children, translationKey }: LoginGateProps) => {
  const {
    setup: { useBurnerAcc },
  } = useDojo();
  const navigate = useNavigate();
  const { t } = useTranslation("intermediate-screens", {
    keyPrefix: "common",
  });

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
        onClick={() => navigate("/login")}
      >
        {t("login")}
      </Button>
    </Flex>
  ) : (
    children
  );
};
