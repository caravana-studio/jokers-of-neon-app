import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Button, Flex } from "@chakra-ui/react";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";

export const VibrationPage = () => {
  return (
    <DelayedLoading ms={0}>
      <Flex
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="100%"
        gap={6}
      >
        <MobileDecoration />
        <Button
          onClick={async () => {
            await Haptics.impact({ style: ImpactStyle.Light });
          }}
          w="200px"
        >
          LIGHT
        </Button>
        <Button
          onClick={async () => {
            await Haptics.impact({ style: ImpactStyle.Medium });
          }}
          w="200px"
        >
          MEDIUM
        </Button>
        <Button
          onClick={async () => {
            await Haptics.impact({ style: ImpactStyle.Heavy });
          }}
          w="200px"
        >
          HEAVY
        </Button>
      </Flex>
    </DelayedLoading>
  );
};
