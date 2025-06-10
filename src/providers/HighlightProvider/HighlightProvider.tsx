import {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
  ReactNode,
} from "react";

export interface HighlightContext<T> {
  highlightedItem: T | undefined;
  highlightItem: (item: T) => void;
  onClose: () => void;
}

export function createHighlightContext<T>() {
  const context = createContext<HighlightContext<T>>({
    highlightedItem: undefined,
    highlightItem: () => {},
    onClose: () => {},
  });

  const useHighlight = () => useContext(context);

  const HighlightProvider = ({ children }: PropsWithChildren): ReactNode => {
    const [highlightedItem, setHighlightedItem] = useState<T | undefined>();

    return (
      <context.Provider
        value={{
          highlightedItem,
          highlightItem: setHighlightedItem,
          onClose: () => setHighlightedItem(undefined),
        }}
      >
        {children}
      </context.Provider>
    );
  };

  return {
    useHighlight,
    HighlightProvider,
  };
}
