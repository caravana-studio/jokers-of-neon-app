import Rox, { Flag } from 'rox-browser'

export const VALID_NAMESPACES = [
  'global',
] as const

interface FlagValue {
  [key: string]: Rox.Flag
}

export interface IContainer {
  [namespace: string]: { [flag: string]: Rox.Flag };
}

// All Feature Management flags, divided by "namespace".  A namespace is a group of flags.
export const namespaceFlags: IContainer = {
  global: {
    showMods: new Flag(false),
    tournamentEnabled: new Flag(false),
    hideTutorial: new Flag(false),
  },
}
