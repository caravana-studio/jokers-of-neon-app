import { Flex } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { Loading } from "./Loading";

interface DelayedLoadingProps extends PropsWithChildren {
  ms?: number;
  loading?: boolean;
}
export const DelayedLoading = ({
  children,
  ms = 500,
  loading = false,
}: DelayedLoadingProps) => {
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        setDelayedLoading(false);
      }, ms);
    }
  }, [loading]);

  return (
    <>
      {delayedLoading && <Loading />}
      <Flex
        h="100%"
        w="100%"
        opacity={delayedLoading ? 0 : 1}
        transform={delayedLoading ? "translateY(10px)" : "translateY(0px)"}
        transition="all 0.5s ease-in-out"
      >
        {children}
      </Flex>
    </>
  );
};
