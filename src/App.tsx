import { useComponentValue } from "@dojoengine/react";
import { Entity } from "@dojoengine/recs";
import { getEntityIdFromKeys } from "@dojoengine/utils";
import { useEffect, useState } from "react";
import "./App.css";
import { useDojo } from "./dojo/useDojo";
import { Cards } from "./enums/cards";
import { Suits } from "./enums/suits";
import { Card } from "./types/card";

function App() {
  const {
    setup: {
      systemCalls: { checkHand },
      clientComponents: { Card, PokerHandEvent, Game },
    },
    account,
  } = useDojo();

  const [clipboardStatus, setClipboardStatus] = useState({
    message: "",
    isError: false,
  });

  // entity id we are syncing
  const entityId = getEntityIdFromKeys([
    BigInt(account?.account.address),
  ]) as Entity;

  // get current component values
  const card = useComponentValue(Card, entityId);
  const pokerHandEvent = useComponentValue(PokerHandEvent, entityId);
  const game = useComponentValue(Game, entityId);

  console.log(game, card, pokerHandEvent);

  const handleRestoreBurners = async () => {
    try {
      await account?.applyFromClipboard();
      setClipboardStatus({
        message: "Burners restored successfully!",
        isError: false,
      });
    } catch (error) {
      setClipboardStatus({
        message: `Failed to restore burners from clipboard`,
        isError: true,
      });
    }
  };

  useEffect(() => {
    if (clipboardStatus.message) {
      const timer = setTimeout(() => {
        setClipboardStatus({ message: "", isError: false });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [clipboardStatus.message]);

  const cards: Card[] = [
/*     {
      value: Cards.FOUR,
      suit: Suits.CLUBS,
    },
    {
      value: Cards.FOUR,
      suit: Suits.HEARTS,
    }, */
    {
      value: Cards.THREE,
      suit: Suits.DIAMONDS,
    },
    {
      value: Cards.THREE,
      suit: Suits.SPADES,
    },
    {
      value: Cards.THREE,
      suit: Suits.HEARTS,
    },
  ];

  return (
    <>
      <button onClick={() => account?.create()}>
        {account?.isDeploying ? "deploying burner" : "create burner"}
      </button>
      {account && account?.list().length > 0 && (
        <button onClick={async () => await account?.copyToClipboard()}>
          Save Burners to Clipboard
        </button>
      )}
      <button onClick={handleRestoreBurners}>
        Restore Burners from Clipboard
      </button>
      {clipboardStatus.message && (
        <div className={clipboardStatus.isError ? "error" : "success"}>
          {clipboardStatus.message}
        </div>
      )}

      <div className="card">
        <div>{`burners deployed: ${account.count}`}</div>
        <div>
          select signer:{" "}
          <select
            value={account ? account.account.address : ""}
            onChange={(e) => account.select(e.target.value)}
          >
            {account?.list().map((account, index) => {
              return (
                <option value={account.address} key={index}>
                  {account.address}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <button onClick={() => account.clear()}>Clear burners</button>
          <p>
            You will need to Authorise the contracts before you can use a
            burner. See readme.
          </p>
        </div>
      </div>

      <div className="card">
        <button onClick={() => checkHand(account.account, cards)}>
          Check hand
        </button>
      </div>
    </>
  );
}

export default App;
