import { Box, Button, Collapse, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
  getPlayerTier,
  getUnlockList,
  UnlockEntryView,
} from "../dojo/queries/getShopUnlockProgress";
import { useDojo } from "../dojo/useDojo";

interface DebugState {
  tier: number;
  entries: UnlockEntryView[];
}

const PANEL_Z_INDEX = 9999;

const getAddress = (value: unknown): string => {
  if (typeof value === "string") return value;
  if (typeof value === "bigint") return `0x${value.toString(16)}`;
  if (value && typeof value === "object" && "toString" in value) {
    return (value as { toString: () => string }).toString();
  }
  return "";
};

export const UnlockProgressDebugWidget = () => {
  const { setup, account } = useDojo();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<DebugState>({ tier: 0, entries: [] });

  const playerAddress = useMemo(
    () => getAddress(account?.account?.address),
    [account?.account?.address]
  );

  useEffect(() => {
    if (!isOpen) return;
    if (!setup?.client || !playerAddress) return;

    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [playerTier, unlockEntries] = await Promise.all([
          getPlayerTier(setup.client, playerAddress),
          getUnlockList(setup.client),
        ]);

        if (cancelled) return;

        setData({
          tier: playerTier.tier,
          entries: unlockEntries,
        });
      } catch (err) {
        if (cancelled) return;
        console.error("[unlock-debug] failed to load unlock progress", err);
        setError("Failed to load unlock progress");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    return () => {
      cancelled = true;
    };
  }, [isOpen, setup?.client, playerAddress]);

  return (
    <Box position="absolute" top={{ base: 2, md: 3 }} right={{ base: 2, md: 3 }} zIndex={PANEL_Z_INDEX}>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        UNLOCK DEBUG
      </Button>

      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={2}
          width={{ base: "calc(100vw - 16px)", md: "360px" }}
          maxHeight={{ base: "58vh", md: "70vh" }}
          overflowY="auto"
          border="1px solid"
          borderColor="whiteAlpha.400"
          borderRadius="10px"
          bg="blackAlpha.800"
          p={3}
          backdropFilter="blur(6px)"
        >
          <Flex justifyContent="space-between" alignItems="center" mb={2}>
            <Text fontSize="xs" color="whiteAlpha.900">
              player tier: {data.tier}
            </Text>
            {isLoading && <Spinner size="xs" />}
          </Flex>

          {!playerAddress && (
            <Text fontSize="xs" color="orange.200">
              wallet not connected
            </Text>
          )}

          {error && (
            <Text fontSize="xs" color="red.200" mb={2}>
              {error}
            </Text>
          )}

          <Flex direction="column" gap={1}>
            {data.entries.map((entry) => {
              const isUnlocked = entry.order <= data.tier;
              return (
                <Flex
                  key={`${entry.order}-${entry.unlockId}`}
                  justifyContent="space-between"
                  alignItems="center"
                  px={2}
                  py={1}
                  borderRadius="6px"
                  bg={isUnlocked ? "green.900" : "whiteAlpha.100"}
                >
                  <Text fontSize="xs" color="whiteAlpha.900" pr={2}>
                    #{entry.order} {entry.unlockId}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={isUnlocked ? "green.200" : "whiteAlpha.700"}
                    whiteSpace="nowrap"
                  >
                    {isUnlocked ? "unlocked" : "locked"}
                  </Text>
                </Flex>
              );
            })}
          </Flex>
        </Box>
      </Collapse>
    </Box>
  );
};
