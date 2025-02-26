import { PropsWithChildren, useEffect } from "react";

const ZoomPrevention = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    // Prevent pinch zoom
    const handleTouchMove = (e: any) => {
      // Allow scrolling but prevent zooming
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add passive: false to ensure preventDefault works
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return <div style={{ touchAction: "pan-x pan-y" }}>{children}</div>;
};

export default ZoomPrevention;
