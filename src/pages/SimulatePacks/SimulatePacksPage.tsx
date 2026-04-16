import { Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { DelayedLoading } from "../../components/DelayedLoading";
import { MobileDecoration } from "../../components/MobileDecoration";
import { BLUE } from "../../theme/colors";
import { useResponsiveValues } from "../../theme/responsiveSettings";
import { SimulatePackRow } from "./SimulatePackRow";

interface Season {
  label: string;
  packIds: number[];
}

const SEASONS: Season[] = [
  { label: "Season 1", packIds: [1, 2, 3, 4, 5, 6] },
  { label: "Season 2", packIds: [21, 22, 23, 24, 25, 26] },
  { label: "Season 3", packIds: [31, 32, 33, 34, 35, 36] },
];

export const SimulatePacksPage = () => {
  const { isSmallScreen } = useResponsiveValues();
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  return (
    <DelayedLoading ms={0}>
      <MobileDecoration fadeToBlack />
      <Flex
        flexDir={"column"}
        w="100%"
        h="100%"
        overflowY={"auto"}
        overflowX={"hidden"}
      >
        <Flex
          w="100%"
          borderBottom={`1px solid ${BLUE}`}
          height={isSmallScreen ? "60px" : "140px"}
          pt={isSmallScreen ? "25px" : "70px"}
          px={isSmallScreen ? "15px" : "30px"}
          pb={3}
          alignItems="flex-end"
          justifyContent="space-between"
        >
          <Heading
            zIndex={10}
            fontSize={isSmallScreen ? "sm" : "lg"}
            variant="italic"
          >
            Simulate Packs
          </Heading>
          {selectedSeason !== null && (
            <Button
              variant="ghost"
              color="white"
              fontSize={isSmallScreen ? 12 : 16}
              fontFamily="Oxanium"
              onClick={() => setSelectedSeason(null)}
              _hover={{ bg: "whiteAlpha.200" }}
              mb={-1}
            >
              Back
            </Button>
          )}
        </Flex>

        {selectedSeason === null ? (
          <Flex flexDir="column" gap={4} p={isSmallScreen ? 4 : 8}>
            {SEASONS.map((season, index) => (
              <Button
                key={index}
                variant="secondarySolid"
                fontFamily="Oxanium"
                fontSize={isSmallScreen ? 18 : 28}
                h={isSmallScreen ? "80px" : "120px"}
                onClick={() => setSelectedSeason(index)}
              >
                {season.label}
              </Button>
            ))}
          </Flex>
        ) : (
          <Flex flexDir="column">
            {SEASONS[selectedSeason].packIds.map((packId) => (
              <SimulatePackRow key={packId} packId={packId} />
            ))}
          </Flex>
        )}
      </Flex>
    </DelayedLoading>
  );
};
