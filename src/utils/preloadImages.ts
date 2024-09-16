import { MODIFIER_CARDS_DATA } from "../data/modifiers";
import { PACKS_DATA } from "../data/packs";
import { SPECIAL_CARDS_DATA } from "../data/specialCards";
import { TRADITIONAL_CARDS_DATA } from "../data/traditionalCards";

export const preloadImages = () => {
  const imageUrls: string[] = [];

  //traditional cards
  Object.keys(TRADITIONAL_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/${key}.png`);
  });

  //modifier cards
  Object.keys(MODIFIER_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/effect/${key}.png`);
  });

  //special cards
  Object.keys(SPECIAL_CARDS_DATA).forEach((key) => {
    imageUrls.push(`Cards/effect/${key}.png`);
  });

  //packs
  Object.keys(PACKS_DATA).forEach((key) => {
    imageUrls.push(`Cards/packs/${key}.png`);
  });

  //backgrounds
  imageUrls.push("bg/game-bg.jpg");
  imageUrls.push("bg/home-bg.jpg");
  imageUrls.push("bg/store-bg.jpg");
  imageUrls.push("redirect/bg/store-bg.jpg");
  imageUrls.push("redirect/bg/game-bg.jpg");

  //logos
  imageUrls.push("logos/jn-logo.png");
  imageUrls.push("logos/joker-logo.png");
  imageUrls.push("logos/logo-variant.svg");
  imageUrls.push("logos/logo.png");

  //vfx
  imageUrls.push("vfx/explosion_blue.gif");
  imageUrls.push("vfx/glow_particle.gif");
  imageUrls.push("vfx/glow2.gif");
  imageUrls.push("vfx/holo.png");
  imageUrls.push("vfx/particle2.gif");
  imageUrls.push("vfx/sparkles.gif");

  const promises = imageUrls.map((url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  return Promise.all(promises);
};
