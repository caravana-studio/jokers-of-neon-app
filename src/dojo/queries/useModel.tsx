import { useDojoStore } from "../setupSdk";
import { Schema } from "../typescript/bindings";

/**
 * Custom hook to retrieve a specific model for a given entityId within a specified namespace.
 *
 * @param entityId - The ID of the entity.
 * @param model - The model to retrieve, specified as a string in the format "namespace-modelName".
 * @returns The model structure if found, otherwise undefined.
 */
export function useModel<N extends keyof Schema, M extends keyof Schema[N] & string>(
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

    return modelData;
}

export function useModels<N extends keyof Schema, M extends keyof Schema[N] & string>(
    model: `${N}-${M}`
): Array<Schema[N][M]> | undefined {
    const [namespace, modelName] = model.split("-") as [N, M];

    // Get all entities from the state
    const modelDataArray = useDojoStore(
        (state) => 
            Object.values(state.entities) 
                .map((entity) => entity.models?.[namespace]?.[modelName]) 
                .filter((modelData): modelData is Schema[N][M] => modelData !== undefined)
    );

    return modelDataArray.length > 0 ? modelDataArray : [];
}
