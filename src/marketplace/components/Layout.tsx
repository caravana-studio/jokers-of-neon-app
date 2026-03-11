import { Box, Flex, Button, HStack, Text } from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { truncateAddress } from "../utils/formatPrice";
import { BetaBanner } from "./BetaBanner";
import { controller } from "../../dojo/controller/controller";

const NAV_ITEMS = [
  { label: "Browse", path: "/" },
  { label: "Sell", path: "/sell" },
  { label: "My Listings", path: "/my-listings" },
  { label: "Shop", path: "/shop" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { address, status } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const location = useLocation();
  const isFullBleedRoute = location.pathname === "/shop";
  const [username, setUsername] = useState<string | null>(null);
  const [isHoveringUser, setIsHoveringUser] = useState(false);

  useEffect(() => {
    if (status === "connected") {
      controller.username()?.then((name) => {
        if (name) setUsername(name);
      });
    } else {
      setUsername(null);
    }
  }, [status]);

  return (
    <Box minH="100vh" position="relative" overflowX="hidden">
      {/* Video background */}
      <Box
        as="video"
        // @ts-ignore
        src="/bg/store-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
        position="fixed"
        top={0}
        left={0}
        w="100%"
        h="100%"
        objectFit="cover"
        zIndex={0}
        pointerEvents="none"
      />
      {/* Dark overlay */}
      <Box
        position="fixed"
        inset={0}
        bg="rgba(6, 15, 38, 0.6)"
        zIndex={0}
        pointerEvents="none"
      />

      {/* Header */}
      <Flex
        as="nav"
        w="100%"
        align="center"
        justify="space-between"
        px={{ base: 4, md: 8 }}
        py={3}
        bg="rgba(6, 38, 64, 0.9)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="rgba(32, 198, 237, 0.25)"
        boxShadow="0 1px 24px 0 rgba(32, 198, 237, 0.08)"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <HStack spacing={0}>
          <Link to="/">
            <Box
              as="img"
              src="/logos/jn.png"
              alt="Jokers of Neon"
              h="26px"
              cursor="pointer"
              mr={6}
            />
          </Link>

          {/* Separator */}
          <Box
            w="1px"
            h="20px"
            bg="whiteAlpha.200"
            mr={6}
            display={{ base: "none", sm: "block" }}
          />

          <HStack spacing={1} display={{ base: "none", sm: "flex" }}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Box
                    position="relative"
                    px={3}
                    py={2}
                    cursor="pointer"
                    role="group"
                  >
                    <Text
                      fontFamily="Orbitron"
                      textTransform="uppercase"
                      color={isActive ? "neonGreen" : "white"}
                      opacity={isActive ? 1 : 0.65}
                      _groupHover={{ opacity: 1 }}
                      fontSize={{ base: 10, md: 13 }}
                      letterSpacing="0.08em"
                    >
                      {item.label}
                    </Text>
                    {/* Active underline */}
                    {isActive && (
                      <Box
                        position="absolute"
                        bottom={0}
                        left="50%"
                        transform="translateX(-50%)"
                        w="60%"
                        h="2px"
                        bg="neonGreen"
                        borderRadius="full"
                        boxShadow="0 0 8px rgba(32, 198, 237, 0.8)"
                      />
                    )}
                  </Box>
                </Link>
              );
            })}
          </HStack>
        </HStack>

        <Box>
          {status === "connected" && address ? (
            <HStack spacing={2}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => disconnect()}
                onMouseEnter={() => setIsHoveringUser(true)}
                onMouseLeave={() => setIsHoveringUser(false)}
                color={isHoveringUser ? "red.300" : undefined}
                borderColor={isHoveringUser ? "red.300" : undefined}
              >
                {isHoveringUser ? "DISCONNECT" : (username ?? truncateAddress(address))}
              </Button>
              <Button
                size="sm"
                variant="unstyled"
                onClick={() => (controller as any).controller?.openProfile?.()}
                border="1px solid #FBCB4A"
                color="#FBCB4A"
                px={3}
                _hover={{ bg: "rgba(251,203,74,0.12)" }}
              >
                PROFILE
              </Button>
            </HStack>
          ) : (
            <Button
              size="sm"
              variant="solid"
              onClick={() => connectors[0] && connect({ connector: connectors[0] })}
            >
              Connect
            </Button>
          )}
        </Box>
      </Flex>

      {/* Mobile nav */}
      <Flex
        w="100%"
        display={{ base: "flex", sm: "none" }}
        justify="center"
        gap={1}
        py={2}
        bg="rgba(6, 38, 64, 0.9)"
        backdropFilter="blur(12px)"
        borderBottom="1px solid"
        borderColor="rgba(32, 198, 237, 0.15)"
        overflowX="auto"
        position="relative"
        zIndex={1}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path}>
              <Box position="relative" px={3} py={1.5}>
                <Text
                  fontFamily="Orbitron"
                  textTransform="uppercase"
                  color={isActive ? "neonGreen" : "white"}
                  opacity={isActive ? 1 : 0.6}
                  fontSize={10}
                  letterSpacing="0.06em"
                >
                  {item.label}
                </Text>
                {isActive && (
                  <Box
                    position="absolute"
                    bottom={0}
                    left="50%"
                    transform="translateX(-50%)"
                    w="60%"
                    h="1.5px"
                    bg="neonGreen"
                    borderRadius="full"
                    boxShadow="0 0 6px rgba(32, 198, 237, 0.7)"
                  />
                )}
              </Box>
            </Link>
          );
        })}
      </Flex>

      {/* Content */}
      <Box
        w="100%"
        px={isFullBleedRoute ? 0 : { base: 4, md: 8 }}
        py={isFullBleedRoute ? 0 : 6}
        pb={isFullBleedRoute ? 0 : 16}
        position="relative"
        zIndex={1}
      >
        {children}
      </Box>

      <BetaBanner />
    </Box>
  );
}
