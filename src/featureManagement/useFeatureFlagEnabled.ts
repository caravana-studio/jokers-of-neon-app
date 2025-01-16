import { useMemo } from 'react'

import { useFeatureFlagContext } from './FeatureFlagProvider'
import { IContainer } from './flags';

/**
 * `useFeatureFlagEnabled` custom hook is used to memoize the returned value of
 * `.isEnabled()` Flag's method. It is needed to reduce the number of calls to
 * https://analytic.rollout.io that are triggered after every rerender of the
 * parent component.
 *
 * @param {string} containerName
 * @param {string} flagName
 * @returns {boolean} memoized boolean value representing that flag is enabled
 */
export const useFeatureFlagEnabled = (containerName: string, flagName: string): boolean => {
  const featureFlags = useFeatureFlagContext() as IContainer;

  return useMemo(
    () => featureFlags[containerName]?.[flagName]?.isEnabled() ?? false,
    [featureFlags, containerName, flagName],
  );
};