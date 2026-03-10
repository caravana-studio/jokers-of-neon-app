import { Flex, Spinner, Text } from "@chakra-ui/react";
import { PropsWithChildren, useEffect } from "react";
import { useProgressStore } from "../../../state/roguelike/useProgressStore";
import { useRunStore } from "../../../state/roguelike/useRunStore";

export const RoguelikeBootstrap = ({ children }: PropsWithChildren) => {
  const initialized = useProgressStore((state) => state.initialized);
  const loadingProgress = useProgressStore((state) => state.loading);
  const progressError = useProgressStore((state) => state.error);
  const loadingRun = useRunStore((state) => state.loading);

  useEffect(() => {
    const progressStore = useProgressStore.getState();
    const runStore = useRunStore.getState();
    void progressStore.bootstrap();
    void runStore.bootstrapRun();
  }, []);

  if (!initialized && (loadingProgress || loadingRun)) {
    return (
      <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="white" />
      </Flex>
    );
  }

  if (progressError) {
    return (
      <Flex h="100%" w="100%" alignItems="center" justifyContent="center">
        <Text color="white">{progressError}</Text>
      </Flex>
    );
  }

  return <>{children}</>;
};
