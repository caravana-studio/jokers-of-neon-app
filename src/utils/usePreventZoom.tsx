import { useEffect } from "react";

export const usePreventZoom = () => {
  useEffect(() => {
    // Reset zoom by updating the viewport meta tag
    const viewport = document.querySelector("meta[name=viewport]");
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      );
    }

    // Alternative method: Reset zoom using transform
    document.body.style.transform = "scale(1)";
    document.body.style.transformOrigin = "0 0";
  }, []);
};
