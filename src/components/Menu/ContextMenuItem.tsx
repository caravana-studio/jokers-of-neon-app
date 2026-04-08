import { Flex, Text, Tooltip } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FC, ReactSVGElement, SVGProps, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { IconComponent } from "../IconComponent";

interface ContextMenuItemProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  url: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  nameKey?: string;
  notificationCount?: number;
  pulse?: boolean;
  onHoldChange?: (isHolding: boolean) => void;
}

const pulseKeyframes = keyframes`
  0% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.25)); }
  50% {
    filter:
      drop-shadow(0 0 10px rgba(255, 255, 255, 0.95))
      drop-shadow(0 0 5px rgba(255, 255, 255, 0.95));
  }
  100% { filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.25)); }
`;

export const ContextMenuItem = ({
  icon,
  url,
  disabled = false,
  active = false,
  onClick,
  nameKey,
  notificationCount,
  pulse = false,
  onHoldChange,
}: ContextMenuItemProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const iconSize = isSmallScreen ? "20px" : "22px";
  const badgeValue =
    typeof notificationCount === "number" && notificationCount > 0
      ? notificationCount > 9
        ? "9+"
        : String(notificationCount)
      : null;
  const badgeSize = isSmallScreen ? "12px" : "14px";
  const badgeFontSize = isSmallScreen ? "8px" : "9px";
  const { t } = useTranslation("home", { keyPrefix: "menu" });
  const pulseAnimation = `${pulseKeyframes} 1.6s ease-in-out infinite`;
  const holdTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdActivatedRef = useRef(false);
  const HOLD_DELAY_MS = 300;

  const clearHoldTimeout = () => {
    if (holdTimeoutRef.current) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  };

  const handleTouchStart = () => {
    if (!onHoldChange || disabled) return;
    holdActivatedRef.current = false;
    clearHoldTimeout();
    holdTimeoutRef.current = setTimeout(() => {
      holdActivatedRef.current = true;
      onHoldChange(true);
      holdTimeoutRef.current = null;
    }, HOLD_DELAY_MS);
  };

  const handleTouchEnd = () => {
    if (!onHoldChange) return;
    clearHoldTimeout();
    if (holdActivatedRef.current) {
      onHoldChange(false);
    }
  };
  const content = (
    <Link
      style={{
        height: "100%",
        width: "100%",
        cursor: disabled ? "not-allowed" : undefined,
      }}
      to={url}
      aria-disabled={disabled}
      className={"game-tutorial-step-btn-" + nameKey}
      tabIndex={disabled ? -1 : 0}
      onClick={(e) => {
        if (holdActivatedRef.current) {
          holdActivatedRef.current = false;
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        if (disabled || onClick) {
          e.preventDefault();
          e.stopPropagation();
          if (onClick && !disabled) {
            onClick();
          }
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <Flex
        flex="1"
        h={isSmallScreen ? "100%" : "auto"}
        w={isSmallScreen ? "auto" : "100%"}
        align="center"
        justify="center"
        opacity={disabled ? 0.4 : 1}
      >
        <Flex
          h="100%"
          w="100%"
          flexDir="column"
          gap={1}
          justifyContent="center"
          alignItems="center"
          py={isSmallScreen ? 0 : 2.5}
          backgroundColor={active ? "rgba(255,255,255,0.15)" : "none"}
        >
          <Flex position="relative" align="center" justify="center">
            <Flex
              align="center"
              justify="center"
              animation={pulse ? pulseAnimation : undefined}
              sx={{ willChange: pulse ? "filter" : undefined }}
            >
              <IconComponent icon={icon} width={iconSize} height={iconSize} />
            </Flex>
            {badgeValue && (
              <Flex
                position="absolute"
                top={isSmallScreen ? "-4px" : "-5px"}
                right={isSmallScreen ? "-6px" : "-7px"}
                minW={badgeSize}
                h={badgeSize}
                px={badgeValue === "9+" ? 1 : 0}
                borderRadius="999px"
                backgroundColor="red.500"
                alignItems="center"
                justifyContent="center"
                zIndex={1}
                pointerEvents="none"
              >
                <Text
                  fontSize={badgeFontSize}
                  lineHeight="1"
                  color="white"
                  fontWeight="700"
                >
                  {badgeValue}
                </Text>
              </Flex>
            )}
          </Flex>
          {isSmallScreen && nameKey && <Text fontSize={9}>{t(nameKey)}</Text>}
        </Flex>
      </Flex>
    </Link>
  );

  if (!isSmallScreen && nameKey) {
    return (
      <Tooltip label={t(nameKey)} placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};
