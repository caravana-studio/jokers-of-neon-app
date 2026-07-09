import { ChakraBaseProvider } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter } from "react-router-dom";
import { FadeInOut } from "../components/animations/FadeInOut";
import { Background } from "../components/Background";
import { CavosWrapper } from "../dojo/cavos/CavosConfig";
import { I18nextProvider } from "react-i18next";
import localI18n from "../i18n";
import { BackgroundAnimationProvider } from "../providers/BackgroundAnimationProvider";
import {
  AppContextProvider,
  AppType,
} from "../providers/AppContextProvider";
import { StarknetProvider } from "../providers/StarknetProvider";
import App from "./App";

interface MigrateProvidersAppProps {
  fadeInDelay: number;
  theme: any;
}

const queryClient = new QueryClient();

export const MigrateProvidersApp = ({
  fadeInDelay,
  theme,
}: MigrateProvidersAppProps) => (
  <FadeInOut isVisible fadeInDelay={fadeInDelay}>
    <AppContextProvider appType={AppType.SHOP}>
      <StarknetProvider>
        <CavosWrapper>
          <I18nextProvider i18n={localI18n} defaultNS={undefined}>
            <QueryClientProvider client={queryClient}>
              <ChakraBaseProvider theme={theme}>
                <BrowserRouter>
                  <Background>
                    <BackgroundAnimationProvider>
                      <App />
                    </BackgroundAnimationProvider>
                  </Background>
                </BrowserRouter>
              </ChakraBaseProvider>
            </QueryClientProvider>
          </I18nextProvider>
        </CavosWrapper>
      </StarknetProvider>
    </AppContextProvider>
  </FadeInOut>
);
