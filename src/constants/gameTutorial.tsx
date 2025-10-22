import i18n from "i18next";
import { isMobile } from "react-device-detect";
import { Trans } from "react-i18next";
import { Step } from "react-joyride";
import {
  BLUE_LIGHT,
  CLUBS,
  HEARTS,
  NEON_GREEN,
  VIOLET_LIGHT,
} from "../theme/colors.tsx";

const COMMON_SETTINGS: Partial<Step> = {
  disableBeacon: true,
  placement: "auto",
  disableScrollParentFix: isMobile ? true : false,
  hideBackButton: true,
  data: { timeout: 0 },
  showSkipButton: true,
};

export const TUTORIAL_STEPS: Step[] = [];

export const GAME_TUTORIAL_STEPS: Step[] = [];

export const STORE_TUTORIAL_STEPS: Step[] = [];

export const SPECIAL_CARDS_TUTORIAL_STEPS: Step[] = [];

export const MODIFIERS_TUTORIAL_STEPS: Step[] = [];

export const JOYRIDE_LOCALES = {};

export const TUTORIAL_STYLE = {
  options: {
    arrowColor: "#DAA1E8",
    backgroundColor: "#1A1A1A",
    overlayColor: "rgba(0, 0, 0, 0.7)",
    primaryColor: "#DAA1E8",
    textColor: "#FFFFFF",
    width: 350,
    zIndex: 1000,
  },
  buttonClose: {
    color: "#DAA1E8",
  },
  buttonNext: {
    backgroundColor: "#DAA1E8",
    color: "#000000",
  },
  buttonBack: {
    color: "#DAA1E8",
  },
  tooltip: {
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(218, 161, 232, 0.5)",
  },
  spotlight: {
    borderRadius: "12px",
    boxShadow: "0 0 15px rgba(255, 255, 255, 0.9)",
  },
};

const loadTutorialTranslations = async () => {
  await i18n.loadNamespaces(["tutorials"]);

  Object.assign(TUTORIAL_STEPS, [
    {
      target: ".game-tutorial-intro",
      title: i18n.t("gameTutorial.intro.title", { ns: "tutorials" }),
      content: (
        <Trans
          i18nKey="gameTutorial.intro.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "center",
      spotlightPadding: 0,
      offset: 0,
      styles: {
        options: {
          arrowColor: "none",
        },
      },
    },
    {
      target: ".store-tutorial-step-1",
      title: i18n.t("gameTutorial.pointsTarget.title", { ns: "tutorials" }),
      content: (
        <Trans
          i18nKey="gameTutorial.pointsTarget.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "auto",
    },
    {
      target: ".game-tutorial-step-2",
      content: (
        <Trans
          i18nKey="gameTutorial.playableHand.step-1"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-btn-plays",
      content: i18n.t("gameTutorial.playableHand.plays", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
      placement: "auto",
    },
    {
      target: ".game-tutorial-step-3",
      content: (
        <Trans
          i18nKey="gameTutorial.playableHand.step-2"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: BLUE_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "right",
    },
    {
      target: ".hand-element-0",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-1",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".game-tutorial-step-3",
      content: (
        <Trans
          i18nKey="gameTutorial.discardCards.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: BLUE_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "right",
      spotlightClicks: true,
      hideFooter: true,
    },
    {
      target: ".game-tutorial-step-2",
      content: (
        <Trans
          i18nKey="gameTutorial.playableHand.pair"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "right",
      hideCloseButton: true,
    },
    {
      target: ".hand-element-2",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-3",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".game-tutorial-step-6",
      title: i18n.t("gameTutorial.pointsMultiplier.title", { ns: "tutorials" }),
      content: (
        <Trans
          i18nKey="gameTutorial.pointsMultiplier.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: NEON_GREEN,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            2: (
              <span
                style={{
                  color: VIOLET_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-4",
      content: (
        <Trans
          i18nKey="gameTutorial.playCards.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: VIOLET_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "left",
      spotlightClicks: true,
      hideFooter: true,
    },
    {
      target: ".game-tutorial-intro",
      ...COMMON_SETTINGS,
      placement: isMobile ? "top" : "auto",
      hideFooter: true,
      offset: isMobile ? 1000 : 10,
    },
    {
      target: ".game-tutorial-step-2",
      content: (
        <Trans
          i18nKey="gameTutorial.playableHand.secondPair"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "right",
      hideCloseButton: true,
    },
    {
      target: ".hand-element-0",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-1",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".special-cards-step-3",
      title: i18n.t("gameTutorial.specialCards.title", { ns: "tutorials" }),
      content: (
        <Trans
          i18nKey="gameTutorial.specialCards.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            2: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
    },
    // power ups
    {
      target: ".game-tutorial-power-up",
      title: i18n.t("gameTutorial.power-ups.title", { ns: "tutorials" }),
      content: (
        <Trans
          i18nKey="gameTutorial.power-ups.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            2: (
              <span
                style={{
                  color: NEON_GREEN,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            3: (
              <span
                style={{
                  color: VIOLET_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "auto",
    },
    {
      target: ".game-tutorial-power-up-0",
      content: i18n.t("gameTutorial.power-ups.select", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
      placement: isMobile ? "bottom" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
    },
    {
      target: ".game-tutorial-power-up-1",
      content: i18n.t("gameTutorial.power-ups.select", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
      placement: isMobile ? "bottom" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
    },
    // play
    {
      target: ".game-tutorial-step-4",
      content: (
        <Trans
          i18nKey="gameTutorial.playCards.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: VIOLET_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "left",
      spotlightClicks: true,
      hideFooter: true,
    },
    {
      target: ".game-tutorial-intro",
      ...COMMON_SETTINGS,
      placement: isMobile ? "top" : "auto",
      hideFooter: true,
      offset: isMobile ? 1000 : 10,
    },
    // FLUSH W MODIFIER
    {
      target: ".hand-element-7",
      title: i18n.t("gameTutorial.modifiers.title", { ns: "tutorials" }),
      content: (
        <Trans
          i18nKey="gameTutorial.modifiers.content"
          ns="tutorials"
          components={{
            1: <br />,
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "auto",
      disableScrollParentFix: true,
      spotlightPadding: 0,
      offset: 0,
      spotlightClicks: false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".game-tutorial-step-2",
      content: (
        <Trans
          i18nKey="gameTutorial.playableHand.flush"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            2: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            5: (
              <span
                style={{
                  color: CLUBS,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            3: <br />,
          }}
        />
      ),

      ...COMMON_SETTINGS,
      placement: "right",
      hideCloseButton: true,
    },
    {
      target: ".hand-element-2",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "right-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-3",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "left-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-4",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "left-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-5",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "left-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".hand-element-6",
      content: i18n.t(
        isMobile
          ? "gameTutorial.action.select-mobile"
          : "gameTutorial.action.select",
        {
          ns: "tutorials",
        }
      ),
      ...COMMON_SETTINGS,
      placement: isMobile ? "left-end" : "auto",
      disableScrollParentFix: true,
      hideFooter: true,
      spotlightClicks: true,
      spotlightPadding: 0,
      offset: 0,
      disableOverlay: isMobile ? true : false,
      styles: !isMobile
        ? {
            options: {
              arrowColor: "none",
              width: "100%",
            },
          }
        : {},
    },
    {
      target: ".game-tutorial-intro",
      content: (
        <Trans
          i18nKey="gameTutorial.modifiers.drag"
          ns="tutorials"
          components={{
            4: (
              <span
                style={{
                  color: HEARTS,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            5: (
              <span
                style={{
                  color: CLUBS,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "bottom",
      offset: isMobile ? 0 : -100,
      disableScrollParentFix: true,
      spotlightClicks: true,
      spotlightPadding: 0,
    },
    {
      target: ".game-tutorial-step-4",
      content: (
        <Trans
          i18nKey="gameTutorial.playCards.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: VIOLET_LIGHT,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
      placement: "left",
      spotlightClicks: true,
      hideFooter: true,
    },
    {
      target: ".game-tutorial-intro",
      ...COMMON_SETTINGS,
      placement: isMobile ? "top" : "auto",
      hideFooter: true,
      offset: isMobile ? 1000 : 10,
    },
    {
      target: ".game-tutorial-step-7",
      content: (
        <Trans
          i18nKey="gameTutorial.score.content"
          ns="tutorials"
          components={{
            1: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
            2: (
              <span
                style={{
                  color: "#fffff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            ),
          }}
        />
      ),
      ...COMMON_SETTINGS,
    },
  ]);

  Object.assign(GAME_TUTORIAL_STEPS, [
    {
      target: ".game-tutorial-step-1",
      title: i18n.t("gameTutorial.pointsTarget.title", { ns: "tutorials" }),
      content: i18n.t("gameTutorial.pointsTarget.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
      disableBeacon: true,
      placement: "auto",
      disableScrollParentFix: i18n.t("commonSettings.disableScrollParentFix", {
        ns: "tutorials",
      }),
    },
    {
      target: ".game-tutorial-step-2",
      title: i18n.t("gameTutorial.playableHand.title", { ns: "tutorials" }),
      content: i18n.t("gameTutorial.playableHand.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-3",
      content: i18n.t("gameTutorial.discardCards.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
      placement: "right",
    },
    {
      target: ".game-tutorial-step-4",
      content: i18n.t("gameTutorial.playCards.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
      placement: "left",
    },
    {
      target: ".game-tutorial-step-6",
      title: i18n.t("gameTutorial.pointsMultiplier.title", { ns: "tutorials" }),
      content: i18n.t("gameTutorial.pointsMultiplier.content", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
    },
  ]);

  Object.assign(STORE_TUTORIAL_STEPS, [
    {
      target: ".store-tutorial-step-1",
      title: i18n.t("storeTutorial.coins.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.coins.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-2",
      title: i18n.t("storeTutorial.levelUpHands.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.levelUpHands.content", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-packs",
      title: i18n.t("storeTutorial.buyPacks.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.buyPacks.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-3",
      title: i18n.t("storeTutorial.buyCards.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.buyCards.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-4",
      title: i18n.t("storeTutorial.modifiers.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.modifiers.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-5",
      title: i18n.t("storeTutorial.specialCards.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.specialCards.content", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-6",
      title: i18n.t("storeTutorial.rerollStore.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.rerollStore.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".game-tutorial-step-7",
      title: i18n.t("storeTutorial.nextLevel.title", { ns: "tutorials" }),
      content: i18n.t("storeTutorial.nextLevel.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
  ]);

  Object.assign(SPECIAL_CARDS_TUTORIAL_STEPS, [
    {
      target: ".special-cards-step-1",
      title: i18n.t("specialCardsTutorial.specialCards.title", {
        ns: "tutorials",
      }),
      content: i18n.t("specialCardsTutorial.specialCards.content", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".special-cards-step-3",
      title: i18n.t("specialCardsTutorial.discardingCards.title", {
        ns: "tutorials",
      }),
      content: isMobile
        ? i18n.t("specialCardsTutorial.discardingCards.content-mobile", {
            ns: "tutorials",
          })
        : i18n.t("specialCardsTutorial.discardingCards.content", {
            ns: "tutorials",
          }),
      ...COMMON_SETTINGS,
    },
  ]);

  Object.assign(MODIFIERS_TUTORIAL_STEPS, [
    {
      target: ".tutorial-modifiers-step-1",
      title: i18n.t("modifiersTutorial.modifierCard.title", {
        ns: "tutorials",
      }),
      content: i18n.t("modifiersTutorial.modifierCard.content", {
        ns: "tutorials",
      }),
      ...COMMON_SETTINGS,
    },
    {
      target: ".tutorial-modifiers-step-2",
      title: i18n.t("modifiersTutorial.discard.title", { ns: "tutorials" }),
      content: isMobile
        ? i18n.t("modifiersTutorial.discard.content-mobile", {
            ns: "tutorials",
          })
        : i18n.t("modifiersTutorial.discard.content", { ns: "tutorials" }),
      ...COMMON_SETTINGS,
    },
  ]);

  Object.assign(JOYRIDE_LOCALES, {
    back: i18n.t("joyride.back", { ns: "tutorials" }),
    next: i18n.t("joyride.next", { ns: "tutorials" }),
    skip: i18n.t("joyride.skip", { ns: "tutorials" }),
    close: i18n.t("joyride.close", { ns: "tutorials" }),
    last: i18n.t("joyride.last", { ns: "tutorials" }),
  });
};

i18n.on("initialized", loadTutorialTranslations);
i18n.on("languageChanged", loadTutorialTranslations);
