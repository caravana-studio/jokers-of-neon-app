import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Icons } from "../../../constants/icons";
import { MenuBtn } from "./MenuBtn";
import { useGame } from "../../../dojo/queries/useGame";

export const DocsMenuBtn = ({
  width,
  label,
}: {
  width: string;
  label?: boolean;
}) => {
  const { t } = useTranslation("game");
  const navigate = useNavigate();
  const game = useGame();

  return (
    <MenuBtn
      width={width}
      icon={Icons.DOCS}
      description={t("game.game-menu.docs-btn")}
      label={label ? t("game.game-menu.docs-btn") : undefined}
      onClick={() => {
        navigate("/docs");
      }}
    />
  );
};
