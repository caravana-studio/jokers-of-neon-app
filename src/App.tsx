import { ChakraBaseProvider, extendTheme } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { isMobile } from "react-device-detect";
import { GamePage } from "./pages/Game/GamePage";
import { GameOver } from "./pages/GameOver";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { OpenPack } from "./pages/OpenPack";
import { PlaysLayout } from "./pages/Plays/PlaysLayout";
import PreviewCard from "./pages/PreviewCard";
import MobilePreviewCard from "./pages/PreviewCardMobile";
import { Redirect } from "./pages/Redirect";
import { RewardsPage } from "./pages/RewardsPage";
import { Store } from "./pages/store/Store";
import { AudioPlayerProvider } from "./providers/AudioPlayerProvider";
import { CardAnimationsProvider } from "./providers/CardAnimationsProvider";
import { GameProvider } from "./providers/GameProvider";
import { StoreProvider } from "./providers/StoreProvider";
import customTheme from "./theme/theme";
import { DeckPage } from "./pages/Deck/DeckPage";
import { SDK, createDojoStore } from "@dojoengine/sdk";
import { Models, Schema } from "./dojo/typescript/bindings";
import { useDojo } from "./dojo/useDojo";
import { useEffect } from "react";
import { GAME_ID } from "./constants/localStorage";
import useModel from "./dojo/queries/useModel";

export const useDojoStore = createDojoStore<Schema>();

function App({ sdk }: { sdk: SDK<Schema> }) {
  const theme = extendTheme(customTheme);
  const {
    account,
    setup: { client },
} = useDojo();
  const state = useDojoStore((state) => state);
  const entities = useDojoStore((state) => state.entities);
  
  let gameID = localStorage.getItem(GAME_ID) || '';

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const subscribe = async () => {
        const subscription = await sdk.subscribeEntityQuery(
            {
                jokers_of_neon: {
                    DeckCard: {
                        $: {
                            where: {
                                game_id: {
                                    $is: Number(gameID),
                                },
                            },
                        },
                    },
                },
            },
            (response) => {
                if (response.error) {
                    console.error(
                        "Error setting up entity sync:",
                        response.error
                    );
                } else if (
                    response.data &&
                    response.data[0].entityId !== "0x0"
                ) {
                    state.setEntities(response.data);
                    console.log(response.data);
                }
            },
            { logging: false }
        );

        unsubscribe = () => subscription.cancel();
    };

    subscribe();

    return () => {
        if (unsubscribe) {
            unsubscribe();
        }
    };
}, [sdk, gameID]);

useEffect(() => {
    const fetchEntities = async () => {
        try {
            await sdk.getEntities(
                {
                    jokers_of_neon: {
                        DeckCard: {
                            $: {
                                where: {
                                    game_id: {
                                        $eq: Number(gameID),
                                    },
                                    idx: {
                                      $gte: 0
                                    }
                                },
                            },
                        },
                    },
                },
                (resp) => {
                    if (resp.error) {
                        console.error(
                            "resp.error.message:",
                            resp.error.message
                        );
                        return;
                    }
                    if (resp.data) {
                      console.log(resp.data);
                        state.setEntities(resp.data);
                    }
                },
                10000, 0
            );
        } catch (error) {
            console.error("Error querying entities:", error);
        }
    };

    fetchEntities();
}, [sdk, gameID]);
  
  return (
    <ChakraBaseProvider theme={theme}>
      <CardAnimationsProvider>
        <GameProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/gameover"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <GameOver />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/demo"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <GamePage />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/rewards"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <RewardsPage />
                </AudioPlayerProvider>
              }
            />

            <Route
              path="/store"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <StoreProvider>
                    <Store />
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/redirect/:page"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <Redirect />
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/preview-card"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <StoreProvider>
                    {isMobile ? <MobilePreviewCard /> : <PreviewCard />}
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route
              path="/open-pack"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <StoreProvider>
                    <OpenPack />
                  </StoreProvider>
                </AudioPlayerProvider>
              }
            />
            <Route path="/play" element={<Navigate to="/" />} />
            <Route
              path="/plays"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                  <PlaysLayout />
                </AudioPlayerProvider>
              }
            />
            <Route 
              path="/deck"
              element={
                <AudioPlayerProvider songPath={"/music/new-track.mp3"}>
                    <DeckPage/>
                </AudioPlayerProvider>
              }
            />
          </Routes>
        </GameProvider>
      </CardAnimationsProvider>
      <Analytics />
      <SpeedInsights />
    </ChakraBaseProvider>
  );
}

export default App;
