import { GameApi } from "../GameApi";
import {
  ActiveRun,
  BuyCardInput,
  BuyCardResult,
  EndRunInput,
  EndRunResult,
  ProfileProgress,
  QueuedUnlock,
  RunConfig,
  ShopState,
} from "../../domain/roguelike/types";

const notImplemented = (): never => {
  throw new Error("ContractGameApi is not implemented yet.");
};

export class ContractGameApi implements GameApi {
  async getProfile(): Promise<ProfileProgress> {
    return notImplemented();
  }

  async getProgress(): Promise<ProfileProgress> {
    return notImplemented();
  }

  async getActiveRun(): Promise<ActiveRun | null> {
    return notImplemented();
  }

  async startRun(_config: RunConfig): Promise<ActiveRun> {
    return notImplemented();
  }

  async advanceRound(_runId: string): Promise<ActiveRun> {
    return notImplemented();
  }

  async defeatBoss(_runId: string): Promise<ActiveRun> {
    return notImplemented();
  }

  async buyRunUpgrade(_runId: string, _upgradeId: string): Promise<ActiveRun> {
    return notImplemented();
  }

  async setRunGold(_runId: string, _gold: number): Promise<ActiveRun> {
    return notImplemented();
  }

  async getShop(_runId: string): Promise<ShopState> {
    return notImplemented();
  }

  async buyCard(_input: BuyCardInput): Promise<BuyCardResult> {
    return notImplemented();
  }

  async endRun(_runId: string, _input: EndRunInput): Promise<EndRunResult> {
    return notImplemented();
  }

  async peekNextUnlock(): Promise<QueuedUnlock | null> {
    return notImplemented();
  }

  async consumeNextUnlock(): Promise<QueuedUnlock | null> {
    return notImplemented();
  }
}
