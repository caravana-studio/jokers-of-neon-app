import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { MotionBox } from "../components/MotionBox";

interface IPageTransitionsContext {
  transitionTo: (page: string) => void;
}

interface PageTransitionsProviderProps extends PropsWithChildren {
  color?: string;
}

const PageTransitionsContext = createContext<IPageTransitionsContext>({
  transitionTo: (_) => {},
});
export const usePageTransitions = () => useContext(PageTransitionsContext);

export const PageTransitionsProvider = ({
  children,
  color,
}: PageTransitionsProviderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const bgColor = color ?? "white";

  useEffect(() => {
    if (isTransitioning) {
      setOverlayVisible(true);
    } else {
      setTimeout(() => {
        setOverlayVisible(false);
      }, 1000);
    }
  }, [isTransitioning]);

  const transitionTo = async (page: string) => {
    setIsTransitioning(true);

    setTimeout(() => {
      navigate(page);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
    }, 500);
  };

  return (
    <PageTransitionsContext.Provider value={{ transitionTo }}>
      {children}
      {overlayVisible && (
        <MotionBox
          position="fixed"
          top="0"
          left="0"
          width="100vw"
          height="100vh"
          backgroundColor={bgColor}
          zIndex="9999"
          initial={{ opacity: 0 }}
          animate={{ opacity: isTransitioning ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      )}
    </PageTransitionsContext.Provider>
  );
};
