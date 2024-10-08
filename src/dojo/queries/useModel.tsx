import { useDojoStore } from "../setupSdk";
import { Schema } from "../typescript/bindings";

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
function useModel<N extends keyof Schema, M extends keyof Schema[N] & string>(
    entityId: string,
    model: `${N}-${M}`
): Schema[N][M] | undefined {
    const [namespace, modelName] = model.split("-") as [N, M];

    // Select only the specific model data for the given entityId
    const modelData = useDojoStore(
        (state) => 
                state.entities[entityId]?.models?.[namespace]?.[modelName] as
                | Schema[N][M]
                | undefined

            
    );

    console.log(Object.keys(useDojoStore().entities).length);

    return modelData;
}

export default useModel;