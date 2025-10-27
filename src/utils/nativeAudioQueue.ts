let nativeAudioQueue: Promise<unknown> = Promise.resolve();

export const runNativeAudioTask = <T>(task: () => Promise<T>): Promise<T> => {
  const nextTask = nativeAudioQueue.then(task);
  nativeAudioQueue = nextTask.catch(() => {});
  return nextTask;
};
