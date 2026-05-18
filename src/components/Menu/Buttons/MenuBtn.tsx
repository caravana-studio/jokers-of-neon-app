import { Flex, Tooltip } from "@chakra-ui/react";
import { IconComponent } from "../../IconComponent";
import { FC, ReactSVGElement, SVGProps } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export interface MenuBtnProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  description: string;
  label?: string;
  onClick?: Function;
  width: string;
  disabled?: boolean;
  arrowRight?: boolean;
}

export const MenuBtn: React.FC<MenuBtnProps> = ({
  icon,
  description,
  label,
  onClick,
  width,
  disabled,
  arrowRight,
}) => {
  const opacity = disabled ? 0.5 : 1;
  const cursor = disabled ? "not-allowed" : onClick ? "pointer" : "default";
  const handleClick = () => {
    if (disabled) return;
    onClick?.();
  };

  if (label) {
    return (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        cursor={cursor}
        onClick={handleClick}
        opacity={opacity}
        w="100%"
      >
        <Flex gap={4} alignItems="center">
          <IconComponent icon={icon} width={width} height="auto" />
          {label}
        </Flex>

        {arrowRight && <FontAwesomeIcon icon={faArrowRight} size="sm" />}
      </Flex>
    );
  } else {
    return (
      <Tooltip label={description} placement="right">
        <Flex
          cursor={cursor}
          justifyContent="center"
          onClick={handleClick}
          opacity={opacity}
        >
          <IconComponent icon={icon} width={width} height="auto" />
        </Flex>
      </Tooltip>
    );
  }
};
