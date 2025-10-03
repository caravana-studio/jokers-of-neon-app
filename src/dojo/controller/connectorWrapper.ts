import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";
import SessionConnector from "@cartridge/connector/session";

class SessionConnectorWrapper extends SessionConnector {
  private connectionPromise:
    | PromiseWithResolvers<{ account?: string; chaindId?: bigint }>
    | undefined;

  constructor(options: any) {
    super(options);
    this.setupAppStateListeners();
  }

  private setupAppStateListeners() {
    App.addListener("resume", async () => {
      try {
        // If we weren't expecting a connection, don't do anything
        if (!this.connectionPromise) return;

        // The app just resumed from switching windows. This means the user probably came back from the browser, so we don't want to reopen it.
        this.controller.reopenBrowser = false;
        const account = await super.connect();
        this.connectionPromise?.resolve(account);
      } catch (error) {
        console.error("after app resumed", error);
        this.connectionPromise?.reject(error);
      }
    });

    App.addListener("pause", () => {});

    App.addListener("appUrlOpen", ({ url }) => {
      if (
        url.startsWith("jokers://open") ||
        url.startsWith("https://jokersofneon.com/open")
      ) {
        try {
          Browser.close();
        } catch {}
      }
    });
  }

  private async handleConnect() {
    try {
      // This will throw an error if the browser opens as the graphql subscription will be interupted
      // The case where it doesn't throw an error is if the session is available in the local storage
      this.controller.reopenBrowser = true;
      const account = await super.connect();
      this.connectionPromise?.resolve(account);
    } catch (error) {
      if ((error as Error).message.includes("Failed to fetch")) {
        console.error(
          "Error expected, app stopped and the graphQL subscription failed."
        );
        return;
      }
      throw error;
    }
  }

  async connect(): Promise<{ chainId?: bigint; account?: string }> {
    try {
      if (this.controller.account) {
        return {
          account: this.controller.account.address,
          chainId: await this.chainId(),
        };
      }
      if (
        !this.connectionPromise ||
        !this.connectionPromise.promise ||
        Object.keys(this.connectionPromise.promise).length === 0
      ) {
        this.connectionPromise = Promise.withResolvers();
        this.handleConnect();
      }

      const account = await this.connectionPromise.promise;
      if (this.controller.account) {
        this.connectionPromise = undefined;
      }

      return account;
    } catch (e) {
      this.connectionPromise = undefined;
      throw e;
    }
  }
}

export default SessionConnectorWrapper;
