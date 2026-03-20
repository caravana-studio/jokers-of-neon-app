import { NativeAudio } from "@capacitor-community/native-audio";
import { App } from "@capacitor/app";
import { Capacitor, PluginListenerHandle } from "@capacitor/core";
import { Howl } from "howler";
import {
  getSfxVolumeMultiplier,
  SFX_REGISTRY,
  normalizePath,
  toNativeAssetId,
  toNativeAssetPath,
  toWebAssetPath,
} from "./audioRegistry";

class AudioManager {
  private static instance: AudioManager;
  private isNative: boolean;
  private isInitialized = false;
  private isInitializing = false;

  // Web audio storage
  private howlCache: Map<string, Howl> = new Map();

  // Native audio tracking
  private nativePreloadedIds: Set<string> = new Set();
  private nativePathByAssetId: Map<string, string> = new Map();

  // Settings
  private volume = 1;
  private sfxOn = true;

  // Pause listener (single instance)
  private pauseListenerHandle: PluginListenerHandle | null = null;

  private constructor() {
    this.isNative = Capacitor.isNativePlatform();
  }

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.isInitialized || this.isInitializing) {
      return;
    }

    this.isInitializing = true;

    try {
      // Preload all SFX
      await this.preloadAllSounds();

      // Set up single pause listener for native
      if (this.isNative) {
        await this.setupPauseListener();
      }

      this.isInitialized = true;
    } finally {
      this.isInitializing = false;
    }
  }

  private async preloadAllSounds(): Promise<void> {
    const preloadPromises = SFX_REGISTRY.map(async ({ path, channels }) => {
      const normalizedPath = normalizePath(path);

      if (this.isNative) {
        await this.preloadNativeSound(path, channels);
      } else {
        this.preloadWebSound(normalizedPath);
      }
    });

    // Use allSettled to not fail on individual sound errors
    await Promise.allSettled(preloadPromises);
  }

  private getEffectiveVolume(path: string): number {
    const volume = this.volume * getSfxVolumeMultiplier(path);
    return Math.max(0, Math.min(1, volume));
  }

  private async preloadNativeSound(
    path: string,
    channels: number
  ): Promise<void> {
    const assetId = toNativeAssetId(path);
    const nativePath = toNativeAssetPath(path);
    const normalizedPath = normalizePath(path);

    try {
      await NativeAudio.preload({
        assetId,
        assetPath: nativePath,
        audioChannelNum: channels,
        channels,
        isUrl: false,
      } as any);

      await NativeAudio.setVolume({
        assetId,
        volume: this.getEffectiveVolume(normalizedPath),
      }).catch(() => {});

      this.nativePreloadedIds.add(assetId);
      this.nativePathByAssetId.set(assetId, normalizedPath);
    } catch {
      // Silent fail for preload errors
    }
  }

  private preloadWebSound(normalizedPath: string): void {
    if (this.howlCache.has(normalizedPath)) {
      return;
    }

    const howl = new Howl({
      src: [toWebAssetPath(normalizedPath)],
      preload: true,
      volume: this.getEffectiveVolume(normalizedPath),
    });

    this.howlCache.set(normalizedPath, howl);
  }

  private async setupPauseListener(): Promise<void> {
    if (this.pauseListenerHandle) {
      return;
    }

    this.pauseListenerHandle = await App.addListener("pause", async () => {
      // Stop all SFX when app pauses
      for (const assetId of this.nativePreloadedIds) {
        await NativeAudio.stop({ assetId }).catch(() => {});
      }
    });
  }

  play(path: string): void {
    if (!this.sfxOn || !this.isInitialized) {
      return;
    }

    const normalizedPath = normalizePath(path);

    if (this.isNative) {
      const assetId = toNativeAssetId(path);
      NativeAudio.play({ assetId }).catch(() => {});
    } else {
      const howl = this.howlCache.get(normalizedPath);
      if (howl) {
        howl.play();
      }
    }
  }

  stop(path: string): void {
    const normalizedPath = normalizePath(path);

    if (this.isNative) {
      const assetId = toNativeAssetId(path);
      NativeAudio.stop({ assetId }).catch(() => {});
    } else {
      const howl = this.howlCache.get(normalizedPath);
      if (howl) {
        howl.stop();
      }
    }
  }

  setVolume(volume: number): void {
    this.volume = volume;

    if (this.isNative) {
      for (const assetId of this.nativePreloadedIds) {
        const normalizedPath = this.nativePathByAssetId.get(assetId) ?? "";
        NativeAudio.setVolume({
          assetId,
          volume: this.getEffectiveVolume(normalizedPath),
        }).catch(() => {});
      }
    } else {
      for (const [normalizedPath, howl] of this.howlCache.entries()) {
        howl.volume(this.getEffectiveVolume(normalizedPath));
      }
    }
  }

  setSfxOn(on: boolean): void {
    this.sfxOn = on;
  }

  getSfxOn(): boolean {
    return this.sfxOn;
  }

  getVolume(): number {
    return this.volume;
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  async cleanup(): Promise<void> {
    // Remove pause listener
    if (this.pauseListenerHandle) {
      await this.pauseListenerHandle.remove();
      this.pauseListenerHandle = null;
    }

    // Unload native sounds
    if (this.isNative) {
      for (const assetId of this.nativePreloadedIds) {
        await NativeAudio.unload({ assetId }).catch(() => {});
      }
      this.nativePreloadedIds.clear();
      this.nativePathByAssetId.clear();
    }

    // Unload web sounds
    for (const howl of this.howlCache.values()) {
      howl.unload();
    }
    this.howlCache.clear();

    this.isInitialized = false;
  }
}

export default AudioManager;
