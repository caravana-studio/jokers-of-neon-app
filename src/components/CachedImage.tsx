import React, { useEffect, useState } from 'react';
import { getImageFromCache } from "../utils/preloadImages";
import { Image, ImageProps } from "@chakra-ui/react";


interface CachedImageProps extends Omit<ImageProps, 'src'> {
    src: string;
  }

const CachedImage: React.FC<CachedImageProps> = ({ src, alt, ...props }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadImage = async () => {

      const cachedImage = await getImageFromCache(src);
      
      if (cachedImage) {
        setImageSrc(URL.createObjectURL(cachedImage));
      } else {
        setImageSrc(src);
      }
    };

    loadImage();

    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  if (!imageSrc) {
    return null; 
  }

  return <Image src={imageSrc} alt={alt} {...props} />;
};

export default CachedImage;