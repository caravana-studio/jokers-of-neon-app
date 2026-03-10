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
} from "../domain/roguelike/types";

export interface GameApi {
  getProfile(): Promise<ProfileProgress>;
  getProgress(): Promise<ProfileProgress>;
  getActiveRun(): Promise<ActiveRun | null>;
  startRun(config: RunConfig): Promise<ActiveRun>;
  advanceRound(runId: string): Promise<ActiveRun>;
  defeatBoss(runId: string): Promise<ActiveRun>;
  buyRunUpgrade(runId: string, upgradeId: string): Promise<ActiveRun>;
  setRunGold(runId: string, gold: number): Promise<ActiveRun>;
  getShop(runId: string): Promise<ShopState>;
  buyCard(input: BuyCardInput): Promise<BuyCardResult>;
  endRun(runId: string, input: EndRunInput): Promise<EndRunResult>;
  peekNextUnlock(): Promise<QueuedUnlock | null>;
  consumeNextUnlock(): Promise<QueuedUnlock | null>;
}
