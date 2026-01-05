import { PropsWithChildren, ReactNode, createContext, useContext, useState } from "react";
import { InformationPopUp } from "../components/InformationPopUp";

interface IInformationPopUpContext {
  information: InformationPayload | undefined;
  setInformation: (information: ReactNode, options?: { unstyled?: boolean }) => void;
  onClose: () => void;
}

interface InformationPayload {
  content: ReactNode;
  unstyled?: boolean;
}

const InformationPopUpContext = createContext<IInformationPopUpContext>({
  information: undefined,
  setInformation: (_info, _options) => {},
  onClose: () => {},
});
export const useInformationPopUp = () => useContext(InformationPopUpContext);

export const InformationPopUpProvider = ({ children }: PropsWithChildren) => {
  const [information, setInformationState] = useState<InformationPayload | undefined>();

  const setInformation = (info: ReactNode, options?: { unstyled?: boolean }) => {
    setInformationState({ content: info, unstyled: options?.unstyled });
  };

  const onClose = () => {
    setInformationState(undefined);
  };

  return (
    <InformationPopUpContext.Provider
      value={{
        information,
        setInformation,
        onClose,
      }}
    >
      {children}
      {information && (
        <InformationPopUp
          content={information.content}
          unstyled={information.unstyled}
          onClose={() => setInformationState(undefined)}
        />
      )}
    </InformationPopUpContext.Provider>
  );
};
