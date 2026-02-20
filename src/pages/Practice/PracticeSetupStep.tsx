import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Text,
} from "@chakra-ui/react";
import CachedImage from "../../components/CachedImage";
import {
  PRACTICE_AVAILABLE_HAND_CARD_IDS,
  PRACTICE_AVAILABLE_POWER_UP_IDS,
  PRACTICE_AVAILABLE_SPECIAL_CARD_IDS,
  PRACTICE_MAX_HAND_CARDS,
  PRACTICE_MAX_POWER_UPS,
  PRACTICE_MAX_SPECIAL_CARDS,
  usePracticeStore,
} from "../../state/usePracticeStore";

interface PracticeSetupStepProps {
  onStart: () => void;
}

const PreviewRow = ({
  title,
  ids,
  type,
}: {
  title: string;
  ids: number[];
  type: "card" | "powerup";
}) => {
  return (
    <Flex direction="column" gap={2} width="100%">
      <Text fontSize="sm" color="gray.300">
        {title}
      </Text>
      <Flex gap={2} wrap="wrap" minHeight="40px" alignItems="center">
        {ids.length === 0 && (
          <Text fontSize="xs" color="gray.500">
            Nothing selected
          </Text>
        )}
        {ids.map((id) => (
          <Badge
            key={`${title}-${id}`}
            px={2}
            py={1}
            borderRadius="8px"
            colorScheme="green"
            variant="solid"
          >
            {type === "card" ? `#${id}` : `P${id}`}
          </Badge>
        ))}
      </Flex>
    </Flex>
  );
};

const SelectableGrid = ({
  title,
  ids,
  selectedIds,
  max,
  type,
  height = "220px",
  onToggle,
  onDeselectAll,
  onRandomize,
}: {
  title: string;
  ids: number[];
  selectedIds: number[];
  max: number;
  type: "card" | "powerup";
  height?: string;
  onToggle: (id: number) => void;
  onDeselectAll: () => void;
  onRandomize: () => void;
}) => {
  return (
    <Flex direction="column" gap={3} width="100%">
      <Flex justifyContent="space-between" alignItems="center" gap={3}>
        <Flex alignItems="center" gap={2}>
          <Text fontWeight="bold">{title}</Text>
          <Text fontSize="sm" color="gray.300">
            {selectedIds.length}/{max}
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Button size="xs" variant="defaultOutline" onClick={onDeselectAll}>
            Deselect all
          </Button>
          <Button size="xs" variant="secondarySolid" onClick={onRandomize}>
            Randomize
          </Button>
        </Flex>
      </Flex>
      <Box
        border="1px solid"
        borderColor="whiteAlpha.300"
        borderRadius="12px"
        p={3}
        height={height}
        overflowY="auto"
      >
        <Grid templateColumns="repeat(8, minmax(0, 1fr))" gap={2}>
          {ids.map((id) => {
            const selected = selectedIds.includes(id);
            const src =
              type === "powerup" ? `/powerups/${id}.png` : `/Cards/${id}.png`;
            return (
              <Box
                key={`${type}-${id}`}
                borderRadius="8px"
                border="2px solid"
                borderColor={selected ? "green.300" : "whiteAlpha.300"}
                bg={selected ? "green.900" : "blackAlpha.300"}
                p={1}
                cursor="pointer"
                onClick={() => onToggle(id)}
              >
                <CachedImage
                  src={src}
                  alt={`${type}-${id}`}
                  width="100%"
                  borderRadius="6px"
                />
                <Text
                  mt={1}
                  fontSize="10px"
                  textAlign="center"
                  color={selected ? "green.200" : "gray.300"}
                >
                  {type === "powerup" ? `P${id}` : `#${id}`}
                </Text>
              </Box>
            );
          })}
        </Grid>
      </Box>
    </Flex>
  );
};

const toggleWithLimit = (ids: number[], id: number, max: number) => {
  if (ids.includes(id)) {
    return ids.filter((selectedId) => selectedId !== id);
  }
  if (ids.length >= max) {
    return ids;
  }
  return [...ids, id];
};

const shuffle = (values: number[]) => {
  const next = [...values];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [next[i], next[randomIndex]] = [next[randomIndex], next[i]];
  }
  return next;
};

const randomSubset = (values: number[], max: number) =>
  shuffle(values).slice(0, Math.min(max, values.length));

export const PracticeSetupStep = ({ onStart }: PracticeSetupStepProps) => {
  const setupSelections = usePracticeStore((store) => store.setupSelections);
  const setSetupSelections = usePracticeStore((store) => store.setSetupSelections);
  const applySetupSelections = usePracticeStore(
    (store) => store.applySetupSelections,
  );
  const resetScenario = usePracticeStore((store) => store.resetScenario);

  const startDisabled = setupSelections.handCardIds.length === 0;

  return (
    <Flex direction="column" gap={5} px={16} py={12} width="100%" height="100%">
      <Box>
        <Heading size="lg">Practice Setup</Heading>
        <Text color="gray.300" mt={2}>
          Choose hand cards, specials, and power ups before entering practice.
        </Text>
      </Box>

      <Flex gap={8} width="100%" flex={1} minHeight={0}>
        <Flex direction="column" width="50%" gap={5} minHeight={0}>
          <SelectableGrid
            title="Hand Cards"
            ids={PRACTICE_AVAILABLE_HAND_CARD_IDS}
            selectedIds={setupSelections.handCardIds}
            max={PRACTICE_MAX_HAND_CARDS}
            type="card"
            height="595px"
            onDeselectAll={() =>
              setSetupSelections({
                handCardIds: [],
              })
            }
            onRandomize={() =>
              setSetupSelections({
                handCardIds: randomSubset(
                  PRACTICE_AVAILABLE_HAND_CARD_IDS,
                  PRACTICE_MAX_HAND_CARDS,
                ),
              })
            }
            onToggle={(id) =>
              setSetupSelections({
                handCardIds: toggleWithLimit(
                  setupSelections.handCardIds,
                  id,
                  PRACTICE_MAX_HAND_CARDS,
                ),
              })
            }
          />
          <PreviewRow
            title="Selected hand"
            ids={setupSelections.handCardIds}
            type="card"
          />
        </Flex>

        <Flex direction="column" width="50%" gap={5} minHeight={0}>
          <SelectableGrid
            title="Special Cards"
            ids={PRACTICE_AVAILABLE_SPECIAL_CARD_IDS}
            selectedIds={setupSelections.specialCardIds}
            max={PRACTICE_MAX_SPECIAL_CARDS}
            type="card"
            height="360px"
            onDeselectAll={() =>
              setSetupSelections({
                specialCardIds: [],
              })
            }
            onRandomize={() =>
              setSetupSelections({
                specialCardIds: randomSubset(
                  PRACTICE_AVAILABLE_SPECIAL_CARD_IDS,
                  PRACTICE_MAX_SPECIAL_CARDS,
                ),
              })
            }
            onToggle={(id) =>
              setSetupSelections({
                specialCardIds: toggleWithLimit(
                  setupSelections.specialCardIds,
                  id,
                  PRACTICE_MAX_SPECIAL_CARDS,
                ),
              })
            }
          />
          <PreviewRow
            title="Selected specials"
            ids={setupSelections.specialCardIds}
            type="card"
          />
          <SelectableGrid
            title="Power Ups"
            ids={PRACTICE_AVAILABLE_POWER_UP_IDS}
            selectedIds={setupSelections.powerUpIds}
            max={PRACTICE_MAX_POWER_UPS}
            type="powerup"
            height="90px"
            onDeselectAll={() =>
              setSetupSelections({
                powerUpIds: [],
              })
            }
            onRandomize={() =>
              setSetupSelections({
                powerUpIds: randomSubset(
                  PRACTICE_AVAILABLE_POWER_UP_IDS,
                  PRACTICE_MAX_POWER_UPS,
                ),
              })
            }
            onToggle={(id) =>
              setSetupSelections({
                powerUpIds: toggleWithLimit(
                  setupSelections.powerUpIds,
                  id,
                  PRACTICE_MAX_POWER_UPS,
                ),
              })
            }
          />
          <PreviewRow
            title="Selected power ups"
            ids={setupSelections.powerUpIds}
            type="powerup"
          />
        </Flex>
      </Flex>

      <Flex justifyContent="flex-end" gap={3}>
        <Button variant="defaultOutline" onClick={resetScenario}>
          Reset defaults
        </Button>
        <Button
          variant="secondarySolid"
          isDisabled={startDisabled}
          onClick={() => {
            applySetupSelections();
            onStart();
          }}
        >
          Start Practice
        </Button>
      </Flex>
    </Flex>
  );
};
