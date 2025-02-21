import { FC, SVGProps, ReactSVGElement } from "react";

interface IconComponentProps {
  icon: string | FC<SVGProps<ReactSVGElement>>;
  width: string;
  height: string;
}

export const IconComponent: FC<IconComponentProps> = ({
  icon,
  width,
  height,
}) => {
  const Icon = icon;

  return typeof icon === "string" ? (
    <img src={icon} width={width} height={height} />
  ) : (
    <Icon width={width} height={height} fill="white" />
  );
};
