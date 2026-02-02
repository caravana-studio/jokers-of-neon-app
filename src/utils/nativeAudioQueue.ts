const nativeAudioQueues = new Map<string, Promise<unknown>>();

export const runNativeAudioTask = <T>(
  task: () => Promise<T>,
  key: string = "global"
): Promise<T> => {
  const previous = nativeAudioQueues.get(key) ?? Promise.resolve();
  const nextTask = previous.then(task);
  nativeAudioQueues.set(key, nextTask.catch(() => {}));
  return nextTask;
};
