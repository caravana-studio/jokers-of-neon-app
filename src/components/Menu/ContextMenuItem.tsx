import { Flex } from "@chakra-ui/react";
import { FC, ReactSVGElement, SVGProps } from "react";
import { Link } from "react-router-dom";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { IconComponent } from "../IconComponent";

interface ContextMenuItemProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  url: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export const ContextMenuItem = ({
  icon,
  url,
  disabled = false,
  active = false,
  onClick,
}: ContextMenuItemProps) => {
  const { isSmallScreen } = useResponsiveValues();
  const iconSize = isSmallScreen ? "26px" : "22px";
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
          justifyContent="center"
          alignItems="center"
          py={isSmallScreen ? 0 : 2.5}
          backgroundColor={active ? "rgba(255,255,255,0.15)" : "none"}
        >
          <IconComponent icon={icon} width={iconSize} height={iconSize} />
        </Flex>
      </Flex>
    </Link>
  );
};
