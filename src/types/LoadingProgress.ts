export interface LoadingProgress {
    text: string,
    showAt: number,
} 

export interface LoadingScreenHandle {
    nextStep: () => void;
    resetProgress: () => void;
  }