import { Collection } from "../../pages/MyCollection/types";
import { fillCollections } from "../../pages/MyCollection/utils";
import { transformTxResultToCollection } from "../../utils/transformers/transformTxResultToCollection";

export const getUserSpecialCards = async (
  client: any,
  userAddress: string
): Promise<Collection[]> => {
  try {
    let tx_result: any =
      await client.nft_special_cards_views.getUserSpecialCards(userAddress);

    return fillCollections(transformTxResultToCollection(tx_result));
  } catch (e) {
    console.error("error getting game view", e);
    return fillCollections([]);
  }
};
