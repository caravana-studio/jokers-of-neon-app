import { FC, ReactSVGElement, SVGProps } from "react";
import CachedImage from "./CachedImage";

interface IconComponentProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  width: string;
  height: string;
  color?: string;
}

export const IconComponent: FC<IconComponentProps> = ({
  icon,
  width,
  height,
  color
}) => {
  const Icon = icon;

  return typeof icon === "string" ? (
    <CachedImage src={icon} width={width} height={height} />
  ) : (
    <Icon width={width} height={height} fill={color ??"white"} />
  );
};
