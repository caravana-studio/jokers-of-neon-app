import { Box, Button, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { RoundRewards } from '../types/RoundRewards.ts'

interface RewardItemProps {
  label: string;
  value: number;
  maxLabelLength: number;
}

const RewardItem = ({ label, value, maxLabelLength }: RewardItemProps) => {
  const fillCharacters = '_'.repeat(maxLabelLength - label.length + 5);
  return (
    <Heading size='lg' pt={2} pb={2}>
      {label} {fillCharacters} {value}ȼ
    </Heading>
  );
};

interface RewardsDetailProps {
  roundRewards?: RoundRewards;
}

export const RewardsDetail = ( { roundRewards }: RewardsDetailProps) => {

  if(!roundRewards) return null;
  
  const {
    level,
    round_defeat,
    level_bonus,
    hands_left,
    hands_left_cash,
    discard_left,
    discard_left_cash,
    total
  } = roundRewards;


  const labels = [
    `Round ${level} defeat`,
    "Level bonus",
    `${hands_left} Hands left`,
    `${discard_left} Discards left`
  ];

  const maxLabelLength = Math.max(...labels.map(label => label.length));

  const navigate = useNavigate();

  return (
    <Box display="flex" flexDirection="column" alignItems="center" w="100%">
      <Heading size='2xl'>CONGRATS!</Heading>
      <table>
        <tbody>
        <RewardItem label={labels[0]} value={round_defeat} maxLabelLength={maxLabelLength}/>
        <RewardItem label={labels[1]} value={level_bonus} maxLabelLength={maxLabelLength}/>
        <RewardItem label={labels[2]} value={hands_left_cash} maxLabelLength={maxLabelLength}/>
        <RewardItem label={labels[3]} value={discard_left_cash} maxLabelLength={maxLabelLength}/>
        </tbody>
      </table>
      <Heading size='3xl' pt={6} pb={8}>Total: {total}ȼ</Heading>

      <Button variant='outline' size='l' onClick={() => navigate('/store')}>Continue</Button>
    </Box>
  );
}