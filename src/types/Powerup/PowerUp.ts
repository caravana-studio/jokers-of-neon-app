import { PowerUpItem } from "../../dojo/typescript/models.gen";
import { PowerupStyle } from "./PowerupStyle";

export interface PowerUp extends PowerUpItem {
  img: string;
  style?: PowerupStyle;
}
