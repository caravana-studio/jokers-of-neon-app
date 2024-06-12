import {
  Box,
  Button,
  GridItem,
  Heading,
  IconButton,
  SimpleGrid,
  Tooltip,
  useDisclosure
} from "@chakra-ui/react"
import { AccountAddress } from "../../components/AccountAddress.tsx";
import { CurrentPlay } from "../../components/CurrentPlay.tsx";
import { LevelPoints } from "../../components/LevelPoints.tsx";
import { MultiPoints } from "../../components/MultiPoints.tsx";
import { Score } from "../../components/Score.tsx";
import { useGameContext } from "../../providers/GameProvider.tsx";
import { InfoIcon } from '@chakra-ui/icons';
import {PlaysModal} from '../../components/Plays/PlaysModal.tsx'

export const TopSection = () => {
  const { gameId, executeCreateGame } = useGameContext();
  const { isOpen: isPlaysModalOpen, onOpen, onClose } = useDisclosure();

  return (
    <SimpleGrid columns={3}>
      <GridItem>
        <LevelPoints />
      </GridItem>
      <GridItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Score />
          <Box sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            mb: 2
          }}>
            <Tooltip label={"Show plays"} variant="outline" placement={"left"}>
              <IconButton
                aria-label={"Show plays"}
                icon={<InfoIcon />}
                variant="outline"
                onClick={() => onOpen()}
              />
            </Tooltip>
            <PlaysModal isOpen={isPlaysModalOpen} onClose={onClose}/>
            <CurrentPlay />
          </Box>
          <MultiPoints />
        </Box>
      </GridItem>
      <GridItem>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            right: 10,
            top: 10,
            gap: 2,
            alignItems: "end",
          }}
        >
          <AccountAddress />
          <Heading size="s" textAlign={"right"}>
            game id: {gameId}
          </Heading>
          <Button
            variant="outline"
            sx={{ width: 300 }}
            onClick={(e) => {
              e.stopPropagation();
              executeCreateGame();
            }}
          >
            START NEW GAME
          </Button>
        </Box>
      </GridItem>
    </SimpleGrid>
  );
};
