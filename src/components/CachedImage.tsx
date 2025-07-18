import { Image, ImageProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";
import { SUPPORTED_EXTENSIONS } from "../constants/general";
import { useGameStore } from "../state/useGameStore";
import { getImageFromCache } from "../utils/cacheUtils";

interface CachedImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

export const checkImageExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: "HEAD" });
    return response.ok;
  } catch {
    return false;
  }
};

export const findValidImagePath = async (
  baseSrc: string,
  extensions: string[]
): Promise<string | null> => {
  const baseWithoutExtension = baseSrc.replace(/\.[^/.]+$/, "");

  for (const ext of extensions) {
    const srcWithExtension = `${baseWithoutExtension}${ext}`;
    const exists = await checkImageExists(srcWithExtension);
    if (exists) {
      return srcWithExtension;
    }
  }

  return null;
};

const CachedImage = forwardRef<HTMLImageElement, CachedImageProps>(
  ({ src, alt, ...props }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const { modId, isClassic } = useGameStore();
    const baseUrl = import.meta.env.VITE_MOD_URL + modId + "/resources";
    const modAwareSrc = !isClassic ? baseUrl + src : src;

    useEffect(() => {
      const loadImage = async () => {
        const cachedImage = await getImageFromCache(src);

        if (!isClassic) {
          const validModSrc = await findValidImagePath(
            modAwareSrc,
            SUPPORTED_EXTENSIONS
          );

          setImageSrc(validModSrc || src);
        } else if (cachedImage) {
          setImageSrc(URL.createObjectURL(cachedImage));
        } else {
          setImageSrc(src);
        }
      };

      loadImage();
    }, [modAwareSrc, src, modId]);

    if (!imageSrc) {
      return null;
    }

    return (
      <Image
        ref={ref}
        src={imageSrc}
        onContextMenu={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
        alt={alt}
        {...props}
      />
    );
  }
);

export default CachedImage;
