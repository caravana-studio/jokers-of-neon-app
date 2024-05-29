import { CARD_WIDTH_PX, TILT_OPTIONS } from '../constants/visualProps.ts'
import { Box, Image } from '@chakra-ui/react'
import { Tilt } from 'react-tilt'
import { Deck } from '../types/Deck.ts'

export interface IDeckProps {
  deck: Deck;
}

export const GameDeck = ({deck} : IDeckProps) => {

  return (
    <Box sx={{
      position: 'absolute',
      bottom: 14,
      right: 10
    }} >
      <Tilt options={TILT_OPTIONS}>
        <Image
          sx={{ maxWidth: "unset" }}
          src={`Cards/Backs/B1.png`}
          alt={`Cards/Backs/B1.png`}
          width={CARD_WIDTH_PX}
        />
      </Tilt>
      <Box pt={'5px'} textAlign={"left"}>
        {`${deck.currentLength}/${deck.size}`}
      </Box>
    </Box>
  );
};
