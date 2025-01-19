import { Image, ImageProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";
import { CLASSIC_MOD_ID } from "../constants/general";
import { useGameContext } from "../providers/GameProvider";

interface CachedImageProps extends Omit<ImageProps, "src"> {
  src: string;
}

const CachedImage = forwardRef<HTMLImageElement, CachedImageProps>(
  ({ src, alt, ...props }, ref) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const { modId } = useGameContext();
    const baseUrl = import.meta.env.VITE_MOD_URL + modId + "/resources";
    const modAwareSrc = modId !== CLASSIC_MOD_ID ? baseUrl + src : src;

    useEffect(() => {
      const checkImageExists = async (url: string): Promise<boolean> => {
        try {
          const response = await fetch(url, { method: "HEAD" });
          return response.ok;
        } catch {
          return false;
        }
      };

      const loadImage = async () => {
        if (modId !== CLASSIC_MOD_ID) {
          const exists = await checkImageExists(modAwareSrc);
          setImageSrc(exists ? modAwareSrc : src);
        } else {
          setImageSrc(src);
        }
      };

      loadImage();
    }, [modAwareSrc, src, modId]);

    if (!imageSrc) {
      return null;
    }

    return <Image ref={ref} src={imageSrc} alt={alt} {...props} />;
  }
);

export default CachedImage;
