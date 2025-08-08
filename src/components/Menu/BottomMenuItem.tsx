import { Flex } from "@chakra-ui/react";
import { FC, ReactSVGElement, SVGProps } from "react";
import { Link } from "react-router-dom";
import { IconComponent } from "../IconComponent";

const ICON_SIZE = "26px";

interface BottomMenuItemProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  url: string;
  active?: boolean;
}
export const BottomMenuItem = ({
  icon,
  url,
  active = false,
}: BottomMenuItemProps) => {
  return (
    <Link style={{ height: "100%", width: "100%" }} to={url}>
      <Flex flex="1" h="100%" align="center" justify="center">
        <Flex
          h="100%"
          w="100%"
          justifyContent="center"
          alignItems="center"
          backgroundColor={active ? "rgba(255,255,255,0.15)" : "none"}
        >
          <IconComponent icon={icon} width={ICON_SIZE} height={ICON_SIZE} />;
        </Flex>
      </Flex>
    </Link>
  );
};
