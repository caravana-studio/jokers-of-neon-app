import { useContext } from "react";
import { DojoContext } from "./DojoContext";

export const useDojo = () => {
    const context = useContext(DojoContext);
    if (!context)
        throw new Error(
            "The `useDojo` hook must be used within a `DojoProvider`"
        );

    return {
        setup: context,
        account: context.account,
        syncCall: context.syncCallback,
        torii: context.toriiClient,
        contractComponents: context.contractComponents
    };
};
