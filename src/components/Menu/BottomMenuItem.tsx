import { Flex } from "@chakra-ui/react";
import { FC, ReactSVGElement, SVGProps } from "react";
import { Link } from "react-router-dom";
import { IconComponent } from "../IconComponent";

const ICON_SIZE = "26px";

interface BottomMenuItemProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  url: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}
export const BottomMenuItem = ({
  icon,
  url,
  disabled = false,
  active = false,
  onClick,
}: BottomMenuItemProps) => {
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
        h="100%"
        align="center"
        justify="center"
        opacity={disabled ? 0.4 : 1}
      >
        <Flex
          h="100%"
          w="100%"
          justifyContent="center"
          alignItems="center"
          backgroundColor={active ? "rgba(255,255,255,0.15)" : "none"}
        >
          <IconComponent icon={icon} width={ICON_SIZE} height={ICON_SIZE} />
        </Flex>
      </Flex>
    </Link>
  );
};
