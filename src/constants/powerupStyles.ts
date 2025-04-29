import { BLUE, BLUE_LIGHT, VIOLET, VIOLET_LIGHT } from "../theme/colors";
import { PowerupStyle } from "../types/Powerup/PowerupStyle";
import { VFX_MOTE_MULTI, VFX_MOTE_POINTS } from "./vfx";

const bluePowerUp = {
    vfx: VFX_MOTE_POINTS,
    shadowColor: BLUE,
    shadowLightColor: BLUE_LIGHT,
};
  
const violetPowerUp = {
    vfx: VFX_MOTE_MULTI,
    shadowColor: VIOLET,
    shadowLightColor: VIOLET_LIGHT,
};
  
export const powerupStyles: Record<number, PowerupStyle> = {
    800: bluePowerUp,
    801: bluePowerUp,
    802: bluePowerUp,
    803: bluePowerUp,
    804: violetPowerUp,
    805: violetPowerUp,
    806: violetPowerUp,
    807: violetPowerUp,
};