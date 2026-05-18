import {
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Input,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import {
  Haptics,
  ImpactStyle,
  NotificationType,
} from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";
import { useState } from "react";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { useCustomToast } from "../hooks/useCustomToast";
import { useResponsiveValues } from "../theme/responsiveSettings";

const sleep = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const clampDuration = (value: number) => {
  if (Number.isNaN(value)) return 300;
  return Math.min(5000, Math.max(10, Math.round(value)));
};

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <Box
    bg="rgba(0,0,0,0.45)"
    border="1px solid rgba(255,255,255,0.14)"
    borderRadius="18px"
    p={4}
    backdropFilter="blur(8px)"
  >
    <Flex flexDirection="column" gap={1} mb={4}>
      <Text fontSize="lg" fontFamily="Orbitron" textTransform="uppercase">
        {title}
      </Text>
      {subtitle && (
        <Text fontSize="sm" color="whiteAlpha.700">
          {subtitle}
        </Text>
      )}
    </Flex>
    {children}
  </Box>
);

export const VibrationPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const { showErrorToast } = useCustomToast();
  const [customDuration, setCustomDuration] = useState("300");
  const [lastRun, setLastRun] = useState("Nothing triggered yet");
  const [isRunning, setIsRunning] = useState(false);

  const platform = Capacitor.getPlatform();
  const isNative = Capacitor.isNativePlatform();
  const isPluginAvailable = Capacitor.isPluginAvailable("Haptics");
  const supportsNavigatorVibrate =
    typeof navigator !== "undefined" && typeof navigator.vibrate === "function";

  const runHaptic = async (label: string, action: () => Promise<void>) => {
    if (isRunning) return;

    setIsRunning(true);
    setLastRun(`Running: ${label}`);

    try {
      await action();
      setLastRun(`Last run: ${label}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to trigger haptics";
      setLastRun(`Failed: ${label}`);
      showErrorToast(message, "Haptics error");
    } finally {
      setIsRunning(false);
    }
  };

  const runSelectionSequence = async (steps: number) => {
    await Haptics.selectionStart();
    for (let index = 0; index < steps; index += 1) {
      await Haptics.selectionChanged();
      await sleep(120);
    }
    await Haptics.selectionEnd();
  };

  const runPattern = async (patternName: string) => {
    if (patternName === "heartbeat") {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(90);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (patternName === "stairs") {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(80);
      await Haptics.impact({ style: ImpactStyle.Medium });
      await sleep(90);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (patternName === "triple-pulse") {
      await Haptics.vibrate({ duration: 120 });
      await sleep(90);
      await Haptics.vibrate({ duration: 120 });
      await sleep(90);
      await Haptics.vibrate({ duration: 220 });
      return;
    }

    await runSelectionSequence(4);
  };

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration fadeToBlack />
      <Flex
        m={4}
        flexDirection="column"
        gap={4}
        w="100%"
        color="white"
        h="100%"
        minH={0}
        overflowY="auto"
        pr={2}
        pb={24}
      >
        <Section
          title="Haptics Lab"
          subtitle="Tester de vibracion para Android e iOS con feedback nativo y patrones compuestos."
        >
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
            justifyContent="space-between"
            gap={3}
          >
            <Flex flexWrap="wrap" gap={2}>
              <Badge colorScheme={isNative ? "green" : "orange"} px={2} py={1}>
                {isNative ? "native app" : "web preview"}
              </Badge>
              <Badge colorScheme="purple" px={2} py={1}>
                platform: {platform}
              </Badge>
              <Badge colorScheme={isPluginAvailable ? "green" : "red"} px={2} py={1}>
                plugin: {isPluginAvailable ? "available" : "missing"}
              </Badge>
              {!isNative && (
                <Badge
                  colorScheme={supportsNavigatorVibrate ? "green" : "red"}
                  px={2}
                  py={1}
                >
                  browser vibrate: {supportsNavigatorVibrate ? "yes" : "no"}
                </Badge>
              )}
            </Flex>
            <Text
              fontSize="sm"
              color={isRunning ? "yellow.300" : "whiteAlpha.800"}
              textAlign={{ base: "left", md: "right" }}
            >
              {lastRun}
            </Text>
          </Flex>

          <Divider borderColor="whiteAlpha.300" my={4} />

          <Flex flexDirection="column" gap={2}>
            <Text fontSize="sm" color="whiteAlpha.800">
              `impact` sirve para comparar intensidad percibida. `vibrate(duration)`
              sirve para probar tiempo. La amplitud numerica no es configurable con
              este plugin, asi que la “intensidad” se testea con estilos y patrones.
            </Text>
            <Text fontSize="xs" color="whiteAlpha.600">
              En iOS, la vibracion continua depende del soporte de Core Haptics del
              dispositivo. En Android, este plugin usa la amplitud por defecto del
              sistema.
            </Text>
          </Flex>
        </Section>

        <Section
          title="Impact"
          subtitle="Golpes cortos para comparar intensidad percibida."
        >
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Impact light", async () => {
                  await Haptics.impact({ style: ImpactStyle.Light });
                })
              }
              isDisabled={isRunning}
            >
              Light
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Impact medium", async () => {
                  await Haptics.impact({ style: ImpactStyle.Medium });
                })
              }
              isDisabled={isRunning}
            >
              Medium
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Impact heavy", async () => {
                  await Haptics.impact({ style: ImpactStyle.Heavy });
                })
              }
              isDisabled={isRunning}
            >
              Heavy
            </Button>
          </SimpleGrid>
        </Section>

        <Section
          title="Notifications"
          subtitle="Patrones pensados para exito, advertencia y error."
        >
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Notification success", async () => {
                  await Haptics.notification({ type: NotificationType.Success });
                })
              }
              isDisabled={isRunning}
            >
              Success
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Notification warning", async () => {
                  await Haptics.notification({ type: NotificationType.Warning });
                })
              }
              isDisabled={isRunning}
            >
              Warning
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Notification error", async () => {
                  await Haptics.notification({ type: NotificationType.Error });
                })
              }
              isDisabled={isRunning}
            >
              Error
            </Button>
          </SimpleGrid>
        </Section>

        <Section
          title="Selection"
          subtitle="Util para probar feedback repetido en pickers, sliders o carousels."
        >
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Selection x1", async () => {
                  await runSelectionSequence(1);
                })
              }
              isDisabled={isRunning}
            >
              Single change
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Selection x4", async () => {
                  await runSelectionSequence(4);
                })
              }
              isDisabled={isRunning}
            >
              Sweep x4
            </Button>
          </SimpleGrid>
        </Section>

        <Section
          title="Duration"
          subtitle="Pruebas de vibracion por tiempo para comparar respuesta del hardware."
        >
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3} mb={4}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Vibrate 80ms", async () => {
                  await Haptics.vibrate({ duration: 80 });
                })
              }
              isDisabled={isRunning}
            >
              80 ms
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Vibrate 250ms", async () => {
                  await Haptics.vibrate({ duration: 250 });
                })
              }
              isDisabled={isRunning}
            >
              250 ms
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Vibrate 600ms", async () => {
                  await Haptics.vibrate({ duration: 600 });
                })
              }
              isDisabled={isRunning}
            >
              600 ms
            </Button>
          </SimpleGrid>

          <Flex
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "stretch", md: "end" }}
            gap={3}
          >
            <Box flex="1">
              <Text fontSize="sm" color="whiteAlpha.700" mb={2}>
                Custom duration (10 - 5000 ms)
              </Text>
              <Input
                value={customDuration}
                onChange={(event) => setCustomDuration(event.target.value)}
                inputMode="numeric"
                type="number"
                min={10}
                max={5000}
                step={10}
              />
            </Box>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Custom vibrate", async () => {
                  await Haptics.vibrate({
                    duration: clampDuration(Number(customDuration)),
                  });
                })
              }
              isDisabled={isRunning}
              minW={isSmallScreen ? "100%" : "220px"}
            >
              Run custom vibration
            </Button>
          </Flex>
        </Section>

        <Section
          title="Patterns"
          subtitle="Secuencias compuestas para sentir diferencias mas claras entre plataformas."
        >
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Pattern heartbeat", async () => {
                  await runPattern("heartbeat");
                })
              }
              isDisabled={isRunning}
            >
              Heartbeat
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Pattern stairs", async () => {
                  await runPattern("stairs");
                })
              }
              isDisabled={isRunning}
            >
              Intensity stairs
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Pattern triple pulse", async () => {
                  await runPattern("triple-pulse");
                })
              }
              isDisabled={isRunning}
            >
              Triple pulse
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Pattern selector scrub", async () => {
                  await runPattern("selector-scrub");
                })
              }
              isDisabled={isRunning}
            >
              Selector scrub
            </Button>
          </SimpleGrid>
        </Section>
      </Flex>
    </DelayedLoading>
  );
};
