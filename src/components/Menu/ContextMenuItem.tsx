import { Flex, Text } from "@chakra-ui/react";
import { FC, ReactSVGElement, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { IconComponent } from "../IconComponent";
import { useTranslation } from "react-i18next";

interface ContextMenuItemProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  url: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  nameKey: string;
}
export const ContextMenuItem = ({
  icon,
  url,
  disabled = false,
  active = false,
  onClick,
  nameKey,
}: ContextMenuItemProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const iconSize = isSmallScreen ? "20px" : "22px";
  const { t } = useTranslation("home", { keyPrefix: "menu" });
  return (
    <Link
      style={{
        height: "100%",
        width: "100%",
        cursor: disabled ? "not-allowed" : undefined,
      }}
      to={url}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={
        disabled || onClick
          ? (e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onClick && !disabled) {
                onClick();
              }
            }
          : undefined
      }
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
          <IconComponent icon={icon} width={iconSize} height={iconSize} />
          {isSmallScreen && <Text fontSize={9}>{t(nameKey)}</Text>}
        </Flex>
      </Flex>
    </Link>
  );
};
