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
import { useState, type ReactNode } from "react";
import { DelayedLoading } from "../components/DelayedLoading";
import { MobileDecoration } from "../components/MobileDecoration";
import { useCustomToast } from "../hooks/useCustomToast";
import { useResponsiveValues } from "../theme/responsiveSettings";

type RawPattern =
  | "impact-light"
  | "impact-medium"
  | "impact-heavy"
  | "notify-success"
  | "notify-warning"
  | "notify-error"
  | "selection-single"
  | "selection-sweep"
  | "vibrate-10"
  | "vibrate-25"
  | "vibrate-10x4"
  | "vibrate-80"
  | "vibrate-250"
  | "vibrate-600"
  | "stairs"
  | "stairs-quick"
  | "heartbeat"
  | "triple-pulse"
  | "engine-rev"
  | "warning-siren"
  | "success-celebration"
  | "error-crash"
  | "morse-sos"
  | "door-knock"
  | "ramp-drop"
  | "carousel-spin"
  | "pack-slider-ios"
  | "pack-slider-android"
  | "pack-open"
  | "pack-open-soft"
  | "card-pass"
  | "score-low-ios"
  | "score-low-android"
  | "score-mid-ios"
  | "score-mid-android"
  | "score-high-ios"
  | "score-high-android"
  | "score-xhigh-ios"
  | "score-xhigh-android"
  | "win-burst";

type ScenarioButton = {
  label: string;
  runLabel: string;
  variant?: "outlinePrimaryGlow" | "secondarySolid";
  run: () => Promise<void>;
};

type ScenarioCard = {
  title: string;
  description: string;
  ios: string;
  android: string;
  buttons: ScenarioButton[];
};

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
  children: ReactNode;
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

const ScenarioCardView = ({
  title,
  description,
  ios,
  android,
  buttons,
  currentPlatform,
  isRunning,
  onRun,
}: ScenarioCard & {
  currentPlatform: string;
  isRunning: boolean;
  onRun: (label: string, action: () => Promise<void>) => void;
}) => (
  <Box
    bg="rgba(255,255,255,0.04)"
    border="1px solid rgba(255,255,255,0.1)"
    borderRadius="16px"
    p={4}
  >
    <Flex flexDirection="column" gap={3}>
      <Flex flexDirection="column" gap={1}>
        <Text fontFamily="Orbitron" fontSize="md" textTransform="uppercase">
          {title}
        </Text>
        <Text fontSize="sm" color="whiteAlpha.700">
          {description}
        </Text>
      </Flex>

      <Flex flexWrap="wrap" gap={2}>
        <Badge colorScheme="purple" px={2} py={1}>
          iOS: {ios}
        </Badge>
        <Badge colorScheme="green" px={2} py={1}>
          Android: {android}
        </Badge>
        <Badge colorScheme="orange" px={2} py={1}>
          current: {currentPlatform}
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={2}>
        {buttons.map((button) => (
          <Button
            key={`${title}-${button.label}`}
            variant={button.variant ?? "outlinePrimaryGlow"}
            isDisabled={isRunning}
            onClick={() => onRun(button.runLabel, button.run)}
          >
            {button.label}
          </Button>
        ))}
      </SimpleGrid>
    </Flex>
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
  const isIOS = platform === "ios";
  const isAndroid = platform === "android";
  const platformLabel = isIOS ? "iOS" : isAndroid ? "Android" : "Web";

  const runSelectionSequence = async (steps: number, pause = 120) => {
    await Haptics.selectionStart();
    for (let index = 0; index < steps; index += 1) {
      await Haptics.selectionChanged();
      await sleep(pause);
    }
    await Haptics.selectionEnd();
  };

  const runPulseSequence = async (durations: number[], pause = 70) => {
    for (let index = 0; index < durations.length; index += 1) {
      await Haptics.vibrate({ duration: durations[index] });
      if (index < durations.length - 1) {
        await sleep(pause);
      }
    }
  };

  const runPattern = async (pattern: RawPattern) => {
    if (pattern === "impact-light") {
      await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    if (pattern === "impact-medium") {
      await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }

    if (pattern === "impact-heavy") {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (pattern === "notify-success") {
      await Haptics.notification({ type: NotificationType.Success });
      return;
    }

    if (pattern === "notify-warning") {
      await Haptics.notification({ type: NotificationType.Warning });
      return;
    }

    if (pattern === "notify-error") {
      await Haptics.notification({ type: NotificationType.Error });
      return;
    }

    if (pattern === "selection-single") {
      await runSelectionSequence(1);
      return;
    }

    if (pattern === "selection-sweep") {
      await runSelectionSequence(4);
      return;
    }

    if (pattern === "vibrate-10") {
      await Haptics.vibrate({ duration: 10 });
      return;
    }

    if (pattern === "vibrate-25") {
      await Haptics.vibrate({ duration: 25 });
      return;
    }

    if (pattern === "vibrate-10x4") {
      await runPulseSequence([10, 10, 10, 10], 35);
      return;
    }

    if (pattern === "vibrate-80") {
      await Haptics.vibrate({ duration: 80 });
      return;
    }

    if (pattern === "vibrate-250") {
      await Haptics.vibrate({ duration: 250 });
      return;
    }

    if (pattern === "vibrate-600") {
      await Haptics.vibrate({ duration: 600 });
      return;
    }

    if (pattern === "stairs") {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(80);
      await Haptics.impact({ style: ImpactStyle.Medium });
      await sleep(90);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (pattern === "stairs-quick") {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(45);
      await Haptics.impact({ style: ImpactStyle.Medium });
      await sleep(55);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (pattern === "heartbeat") {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(90);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (pattern === "triple-pulse") {
      await runPulseSequence([120, 120, 220], 90);
      return;
    }

    if (pattern === "engine-rev") {
      await runPulseSequence([70, 120, 180, 260], 60);
      return;
    }

    if (pattern === "warning-siren") {
      await Haptics.notification({ type: NotificationType.Warning });
      await sleep(140);
      await Haptics.notification({ type: NotificationType.Warning });
      return;
    }

    if (pattern === "success-celebration") {
      await Haptics.notification({ type: NotificationType.Success });
      await sleep(80);
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(80);
      await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }

    if (pattern === "error-crash") {
      await Haptics.impact({ style: ImpactStyle.Heavy });
      await sleep(110);
      await Haptics.notification({ type: NotificationType.Error });
      await sleep(90);
      await Haptics.vibrate({ duration: 260 });
      return;
    }

    if (pattern === "morse-sos") {
      await runPulseSequence([70, 70, 70], 55);
      await sleep(120);
      await runPulseSequence([220, 220, 220], 80);
      await sleep(120);
      await runPulseSequence([70, 70, 70], 55);
      return;
    }

    if (pattern === "door-knock") {
      await Haptics.impact({ style: ImpactStyle.Medium });
      await sleep(90);
      await Haptics.impact({ style: ImpactStyle.Medium });
      await sleep(240);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (pattern === "ramp-drop") {
      await Haptics.vibrate({ duration: 260 });
      await sleep(90);
      await Haptics.impact({ style: ImpactStyle.Heavy });
      await sleep(60);
      await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    if (pattern === "carousel-spin") {
      await runSelectionSequence(2, 100);
      await sleep(120);
      await runSelectionSequence(5, 80);
      await sleep(80);
      await Haptics.impact({ style: ImpactStyle.Medium });
      return;
    }

    if (pattern === "pack-slider-ios") {
      await runSelectionSequence(8, 35);
      return;
    }

    if (pattern === "pack-slider-android") {
      await runPulseSequence([10, 10, 10, 10, 10, 10, 10, 10], 16);
      return;
    }

    if (pattern === "pack-open") {
      await runPattern("success-celebration");
      return;
    }

    if (pattern === "pack-open-soft") {
      await Haptics.notification({ type: NotificationType.Success });
      await sleep(70);
      await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    if (pattern === "card-pass") {
      await Haptics.impact({ style: ImpactStyle.Light });
      await sleep(75);
      await Haptics.impact({ style: ImpactStyle.Light });
      return;
    }

    if (pattern === "score-low-ios") {
      await runSelectionSequence(10, 40);
      return;
    }

    if (pattern === "score-low-android") {
      await runPulseSequence(
        [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        16
      );
      return;
    }

    if (pattern === "score-mid-ios") {
      await runSelectionSequence(14, 40);
      return;
    }

    if (pattern === "score-mid-android") {
      await runPulseSequence(
        [
          10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
          10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
        ],
        16
      );
      return;
    }

    if (pattern === "score-high-ios") {
      await Haptics.vibrate({ duration: 850 });
      return;
    }

    if (pattern === "score-high-android") {
      await Haptics.vibrate({ duration: 950 });
      return;
    }

    if (pattern === "score-xhigh-ios") {
      await Haptics.vibrate({ duration: 1300 });
      await Haptics.impact({ style: ImpactStyle.Heavy });
      return;
    }

    if (pattern === "score-xhigh-android") {
      await Haptics.vibrate({ duration: 1450 });
      return;
    }

    await Haptics.notification({ type: NotificationType.Success });
    await sleep(100);
    await Haptics.impact({ style: ImpactStyle.Medium });
    await sleep(80);
    await Haptics.impact({ style: ImpactStyle.Heavy });
  };

  const runPlatformPattern = async (
    iosPattern: RawPattern,
    androidPattern: RawPattern,
    fallbackPattern: RawPattern = iosPattern
  ) => {
    const pattern = isIOS
      ? iosPattern
      : isAndroid
        ? androidPattern
        : fallbackPattern;

    await runPattern(pattern);
  };

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

  const appScenarios: ScenarioCard[] = [
    {
      title: "Repartir cartas",
      description:
        "Mapea la sensacion del deal inicial con defaults distintos por plataforma.",
      ios: "Sweep x4",
      android: "Custom 10ms x4",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Deal cards suggested",
          variant: "secondarySolid",
          run: () =>
            runPlatformPattern("selection-sweep", "vibrate-10x4", "selection-sweep"),
        },
        {
          label: "Sweep x4",
          runLabel: "Deal cards sweep x4",
          run: () => runPattern("selection-sweep"),
        },
        {
          label: "10ms x4",
          runLabel: "Deal cards 10ms x4",
          run: () => runPattern("vibrate-10x4"),
        },
        {
          label: "Carousel spin",
          runLabel: "Deal cards carousel spin",
          run: () => runPattern("carousel-spin"),
        },
      ],
    },
    {
      title: "Puntos",
      description: "Feedback para una suma normal de puntos.",
      ios: "Impact heavy",
      android: "Custom 25ms",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Points suggested",
          variant: "secondarySolid",
          run: () => runPlatformPattern("impact-heavy", "vibrate-25"),
        },
        {
          label: "Light",
          runLabel: "Points light",
          run: () => runPattern("impact-light"),
        },
        {
          label: "Heavy",
          runLabel: "Points heavy",
          run: () => runPattern("impact-heavy"),
        },
        {
          label: "Stairs",
          runLabel: "Points stairs",
          run: () => runPattern("stairs"),
        },
      ],
    },
    {
      title: "Multi",
      description: "Caso separado para ajustar el feedback propio del multiplicador.",
      ios: "Impact heavy",
      android: "Custom 25ms",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Multi suggested",
          variant: "secondarySolid",
          run: () => runPlatformPattern("impact-heavy", "vibrate-25"),
        },
        {
          label: "Light",
          runLabel: "Multi light",
          run: () => runPattern("impact-light"),
        },
        {
          label: "Heavy",
          runLabel: "Multi heavy",
          run: () => runPattern("impact-heavy"),
        },
        {
          label: "Heartbeat",
          runLabel: "Multi heartbeat",
          run: () => runPattern("heartbeat"),
        },
      ],
    },
    {
      title: "Cash",
      description: "Comparador de vibracion para premio y economia.",
      ios: "Impact heavy",
      android: "Custom 25ms",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Cash suggested",
          variant: "secondarySolid",
          run: () => runPlatformPattern("impact-heavy", "vibrate-25"),
        },
        {
          label: "Light",
          runLabel: "Cash light",
          run: () => runPattern("impact-light"),
        },
        {
          label: "Heavy",
          runLabel: "Cash heavy",
          run: () => runPattern("impact-heavy"),
        },
        {
          label: "Success alt",
          runLabel: "Cash success alt",
          run: () => runPattern("success-celebration"),
        },
      ],
    },
    {
      title: "Click boton",
      description: "Accion corta y frecuente para ajustar la sensacion base de UI.",
      ios: "Selection single change",
      android: "Custom 10ms",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Button click suggested",
          variant: "secondarySolid",
          run: () => runPlatformPattern("selection-single", "vibrate-10"),
        },
        {
          label: "Selection",
          runLabel: "Button click selection",
          run: () => runPattern("selection-single"),
        },
        {
          label: "10ms",
          runLabel: "Button click 10ms",
          run: () => runPattern("vibrate-10"),
        },
        {
          label: "Impact light",
          runLabel: "Button click impact light",
          run: () => runPattern("impact-light"),
        },
      ],
    },
    {
      title: "Reroll",
      description: "Default igual en ambos, con alternativas mas energicas.",
      ios: "Intensity stairs",
      android: "Quick stairs",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Reroll suggested",
          variant: "secondarySolid",
          run: () => runPlatformPattern("stairs", "stairs-quick"),
        },
        {
          label: "Stairs",
          runLabel: "Reroll stairs",
          run: () => runPattern("stairs"),
        },
        {
          label: "Engine rev",
          runLabel: "Reroll engine rev",
          run: () => runPattern("engine-rev"),
        },
        {
          label: "Triple pulse",
          runLabel: "Reroll triple pulse",
          run: () => runPattern("triple-pulse"),
        },
      ],
    },
    {
      title: "Comprar item",
      description: "Compra positiva y clara, con variantes para ajustar la fuerza.",
      ios: "Notification success",
      android: "Notification success",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Buy item suggested",
          variant: "secondarySolid",
          run: () => runPattern("notify-success"),
        },
        {
          label: "Success",
          runLabel: "Buy item success",
          run: () => runPattern("notify-success"),
        },
        {
          label: "Celebration",
          runLabel: "Buy item celebration",
          run: () => runPattern("success-celebration"),
        },
        {
          label: "Heavy alt",
          runLabel: "Buy item heavy alt",
          run: () => runPattern("impact-heavy"),
        },
      ],
    },
    {
      title: "Sumar puntos",
      description: "Escalado de feedback por intensidad.",
      ios: "Low mas largo / Mid aun mas largo / High largo / Extra high muy largo",
      android: "Low-mid tipo slider pero mas largos / High largo / Extra high aun mas largo",
      buttons: [
        {
          label: "Low",
          runLabel: "Score gain low",
          variant: "secondarySolid",
          run: () =>
            runPlatformPattern("score-low-ios", "score-low-android", "score-low-ios"),
        },
        {
          label: "Mid",
          runLabel: "Score gain mid",
          run: () =>
            runPlatformPattern("score-mid-ios", "score-mid-android", "score-mid-ios"),
        },
        {
          label: "High",
          runLabel: "Score gain high",
          run: () =>
            runPlatformPattern("score-high-ios", "score-high-android", "score-high-ios"),
        },
        {
          label: "Extra high",
          runLabel: "Score gain extra high",
          run: () =>
            runPlatformPattern(
              "score-xhigh-ios",
              "score-xhigh-android",
              "score-xhigh-ios"
            ),
        },
      ],
    },
    {
      title: "Lose",
      description: "Resultado negativo con una opcion mas dramatica.",
      ios: "Notification error",
      android: "Notification error",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Lose suggested",
          variant: "secondarySolid",
          run: () => runPattern("notify-error"),
        },
        {
          label: "Error",
          runLabel: "Lose error",
          run: () => runPattern("notify-error"),
        },
        {
          label: "Error crash",
          runLabel: "Lose error crash",
          run: () => runPattern("error-crash"),
        },
      ],
    },
    {
      title: "Win",
      description: "Victoria o cierre positivo grande.",
      ios: "Success celebration",
      android: "Win burst",
      buttons: [
        {
          label: "Suggested",
          runLabel: "Win suggested",
          variant: "secondarySolid",
          run: () => runPlatformPattern("success-celebration", "win-burst"),
        },
        {
          label: "Success",
          runLabel: "Win success",
          run: () => runPattern("notify-success"),
        },
        {
          label: "Celebration",
          runLabel: "Win celebration",
          run: () => runPattern("success-celebration"),
        },
        {
          label: "Burst",
          runLabel: "Win burst",
          run: () => runPattern("win-burst"),
        },
      ],
    },
    {
      title: "Open pack",
      description: "Tres momentos separados del flujo de apertura.",
      ios: "Short slider pulses / Open celebration / Two light impacts",
      android: "Very short slider pulses / Soft open / 10ms pass",
      buttons: [
        {
          label: "Abriendo pack",
          runLabel: "Open pack slider",
          variant: "secondarySolid",
          run: () =>
            runPlatformPattern(
              "pack-slider-ios",
              "pack-slider-android",
              "pack-slider-ios"
            ),
        },
        {
          label: "Pack abierto",
          runLabel: "Open pack opened",
          run: () => runPlatformPattern("pack-open", "pack-open-soft", "pack-open"),
        },
        {
          label: "Pasando cartas",
          runLabel: "Open pack passing cards",
          run: () => runPlatformPattern("card-pass", "vibrate-10", "card-pass"),
        },
        {
          label: "Carousel alt",
          runLabel: "Open pack carousel alt",
          run: () => runPattern("carousel-spin"),
        },
      ],
    },
    {
      title: "Sumar XP",
      description: "Feedback positivo secundario con opcion un poco mas celebratoria.",
      ios: "Notification success",
      android: "Notification success",
      buttons: [
        {
          label: "Suggested",
          runLabel: "XP suggested",
          variant: "secondarySolid",
          run: () => runPattern("notify-success"),
        },
        {
          label: "Success",
          runLabel: "XP success",
          run: () => runPattern("notify-success"),
        },
        {
          label: "Celebration",
          runLabel: "XP celebration",
          run: () => runPattern("success-celebration"),
        },
      ],
    },
  ];

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration fadeToBlack />
      <Flex
        m={4}
        flexDirection="column"
        gap={4}
        w="100%"
        data-haptic-ignore-global="true"
        color="white"
        h="100%"
        minH={0}
        overflowY="auto"
        pr={2}
        pb={24}
      >
        <Section
          title="App Actions"
          subtitle="Mapa de vibraciones para acciones reales de la app, con defaults distintos por plataforma y varias alternativas por accion."
        >
          <Flex
            flexDirection={{ base: "column", md: "row" }}
            alignItems={{ base: "flex-start", md: "center" }}
            justifyContent="space-between"
            gap={3}
            mb={4}
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

          <Text fontSize="sm" color="whiteAlpha.800" mb={4}>
            Cada tarjeta tiene un boton `Suggested` que ya resuelve distinto en iOS y
            Android cuando hace falta. Al lado quedan opciones alternativas para afinar
            la sensacion antes de llevarla al flujo real.
          </Text>

          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
            {appScenarios.map((scenario) => (
              <ScenarioCardView
                key={scenario.title}
                {...scenario}
                currentPlatform={platformLabel}
                isRunning={isRunning}
                onRun={(label, action) => {
                  void runHaptic(label, action);
                }}
              />
            ))}
          </SimpleGrid>
        </Section>

        <Section
          title="Raw Impact"
          subtitle="Comparador basico de intensidad."
        >
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Impact light", () => runPattern("impact-light"))}
              isDisabled={isRunning}
            >
              Light
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Impact medium", () => runPattern("impact-medium"))}
              isDisabled={isRunning}
            >
              Medium
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() => void runHaptic("Impact heavy", () => runPattern("impact-heavy"))}
              isDisabled={isRunning}
            >
              Heavy
            </Button>
          </SimpleGrid>
        </Section>

        <Section
          title="Notifications"
          subtitle="Patrones pensados para exito, warning y error."
        >
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Notification success", () => runPattern("notify-success"))
              }
              isDisabled={isRunning}
            >
              Success
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Notification warning", () => runPattern("notify-warning"))
              }
              isDisabled={isRunning}
            >
              Warning
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Notification error", () => runPattern("notify-error"))
              }
              isDisabled={isRunning}
            >
              Error
            </Button>
          </SimpleGrid>
        </Section>

        <Section
          title="Selection"
          subtitle="Util para pickers, sliders y carousels."
        >
          <SimpleGrid columns={{ base: 1, sm: 3 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Selection single", () => runPattern("selection-single"))
              }
              isDisabled={isRunning}
            >
              Single change
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Selection sweep", () => runPattern("selection-sweep"))
              }
              isDisabled={isRunning}
            >
              Sweep x4
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() =>
                void runHaptic("Carousel spin", () => runPattern("carousel-spin"))
              }
              isDisabled={isRunning}
            >
              Carousel spin
            </Button>
          </SimpleGrid>
        </Section>

        <Section
          title="Duration"
          subtitle="Pruebas de vibracion por tiempo para comparar respuesta del hardware."
        >
          <SimpleGrid columns={{ base: 1, sm: 4 }} spacing={3} mb={4}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Vibrate 10ms", () => runPattern("vibrate-10"))}
              isDisabled={isRunning}
            >
              10 ms
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Vibrate 80ms", () => runPattern("vibrate-80"))}
              isDisabled={isRunning}
            >
              80 ms
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Vibrate 250ms", () => runPattern("vibrate-250"))}
              isDisabled={isRunning}
            >
              250 ms
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() => void runHaptic("Vibrate 600ms", () => runPattern("vibrate-600"))}
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
          title="Combined Patterns"
          subtitle="Patrones compuestos para comparar motores hapticos y sensaciones mas largas."
        >
          <SimpleGrid columns={{ base: 1, sm: 2, xl: 3 }} spacing={3}>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Heartbeat", () => runPattern("heartbeat"))}
              isDisabled={isRunning}
            >
              Heartbeat
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Intensity stairs", () => runPattern("stairs"))}
              isDisabled={isRunning}
            >
              Intensity stairs
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Triple pulse", () => runPattern("triple-pulse"))}
              isDisabled={isRunning}
            >
              Triple pulse
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Engine rev", () => runPattern("engine-rev"))}
              isDisabled={isRunning}
            >
              Engine rev
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Warning siren", () => runPattern("warning-siren"))}
              isDisabled={isRunning}
            >
              Warning siren
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() =>
                void runHaptic("Success celebration", () => runPattern("success-celebration"))
              }
              isDisabled={isRunning}
            >
              Success celebration
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Morse SOS", () => runPattern("morse-sos"))}
              isDisabled={isRunning}
            >
              Morse SOS
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Door knock", () => runPattern("door-knock"))}
              isDisabled={isRunning}
            >
              Door knock
            </Button>
            <Button
              variant="outlinePrimaryGlow"
              onClick={() => void runHaptic("Ramp drop", () => runPattern("ramp-drop"))}
              isDisabled={isRunning}
            >
              Ramp drop
            </Button>
            <Button
              variant="secondarySolid"
              onClick={() => void runHaptic("Error crash", () => runPattern("error-crash"))}
              isDisabled={isRunning}
            >
              Error crash
            </Button>
          </SimpleGrid>
        </Section>
      </Flex>
    </DelayedLoading>
  );
};
