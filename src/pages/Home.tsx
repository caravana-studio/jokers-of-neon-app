import { useCallback, useEffect, useState } from "react";
import { Menu } from "../components/Menu";

export const Home = () => {
  const [open, setOpen] = useState(false);
  const onKeyDown = useCallback((event: { key: string }) => {
    setOpen(true);
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false);

    return () => {
      document.removeEventListener("keydown", onKeyDown, false);
    };
  }, [onKeyDown]);

  return (
    <>
      <div className="text av1">
        <span>AV-1</span>
      </div>
      {open ? (
        <Menu />
      ) : (
        <div className="text press">
          <span>PRESS A KEY TO START</span>
        </div>
      )}
    </>
  );
};
