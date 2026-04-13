export interface StoreConfig {
  id: string;
  name: string;
  distribution: {
    desktop: {
      rows: Array<{
        height: number;
        columns: Array<{
          id: string;
          width: number;
          doubleRow?: boolean;
        }>;
      }>;
    };
    mobile: {
      rows: Array<{
        height: number;
        columns: Array<{
          id: string;
          width: number;
          doubleRow?: boolean;
        }>;
      }>;
    };
  };
}

export type StoreSectionId =
  | "traditionals"
  | "modifiers"
  | "specials"
  | "loot-boxes"
  | "level-up-table"
  | "power-ups"
  | "burn";

export interface StoreDistributionContext {
  sectionCounts?: Partial<Record<StoreSectionId, number>>;
}

type StoreDistribution = StoreConfig["distribution"];

interface CountCondition {
  eq?: number;
  gte?: number;
  lte?: number;
}

type SectionCountConditions = Partial<Record<StoreSectionId, CountCondition>>;

interface StoreDistributionOverride {
  id: string;
  storeId: StoreConfig["id"];
  conditions: SectionCountConditions;
  patch: Partial<StoreDistribution>;
}

export const storesConfig: StoreConfig[] = [
  {
    id: "deck",
    name: "Deck",
    distribution: {
      desktop: {
        rows: [
          {
            height: 50,
            columns: [
              {
                id: "traditionals",
                width: 100,
              },
            ],
          },
          {
            height: 50,
            columns: [
              {
                id: "modifiers",
                width: 78,
              },
              {
                id: "burn",
                width: 22,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          { height: 30, columns: [{ id: "traditionals", width: 100 }] },
          { height: 45, columns: [{ id: "modifiers", width: 100 }] },
          { height: 25, columns: [{ id: "burn", width: 100 }] },
        ],
      },
    },
  },
  {
    id: "global",
    name: "Global",
    distribution: {
      desktop: {
        rows: [
          {
            height: 65,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
          {
            height: 35,
            columns: [
              {
                id: "power-ups",
                width: 100,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          {
            height: 65,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
          {
            height: 35,
            columns: [
              {
                id: "power-ups",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "specials",
    name: "Specials",
    distribution: {
      desktop: {
        rows: [
          {
            height: 40,
            columns: [
              {
                id: "loot-boxes",
                width: 100,
              },
            ],
          },
          {
            height: 60,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          {
            height: 40,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
          {
            height: 60,
            columns: [
              {
                id: "loot-boxes",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "level-ups",
    name: "Level ups",
    distribution: {
      desktop: {
        rows: [
          {
            height: 45,
            columns: [
              {
                id: "level-up-table",
                width: 100,
              },
            ],
          },
          {
            height: 55,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          { height: 55, columns: [{ id: "level-up-table", width: 100 }] },
          {
            height: 45,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "modifiers",
    name: "Modifiers",
    distribution: {
      desktop: {
        rows: [
          {
            height: 40,
            columns: [
              {
                id: "loot-boxes",
                width: 100,
              },
            ],
          },
          {
            height: 60,
            columns: [
              {
                id: "modifiers",
                width: 100,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          { height: 40, columns: [{ id: "modifiers", width: 100 }] },
          {
            height: 60,
            columns: [
              {
                id: "loot-boxes",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mix",
    name: "Mix",
    distribution: {
      desktop: {
        rows: [
          {
            height: 55,
            columns: [
              {
                id: "loot-boxes",
                width: 75,
              },
              {
                id: "power-ups",
                width: 25,
                doubleRow: true,
              },
            ],
          },
          {
            height: 45,
            columns: [
              {
                id: "level-up-table",
                width: 100,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          {
            height: 40,
            columns: [
              {
                id: "loot-boxes",
                width: 65,
              },
              {
                id: "power-ups",
                width: 35,
                doubleRow: true,
              },
            ],
          },
          {
            height: 60,
            columns: [
              {
                id: "level-up-table",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
];

const storeDistributionOverrides: StoreDistributionOverride[] = [
  {
    id: "specials-mobile-balanced-when-extra-loot-boxes",
    storeId: "specials",
    conditions: {
      "loot-boxes": { gte: 3 },
    },
    patch: {
      mobile: {
        rows: [
          {
            height: 50,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
          {
            height: 50,
            columns: [
              {
                id: "loot-boxes",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "mix-adjusted-layout-when-three-loot-boxes",
    storeId: "mix",
    conditions: {
      "loot-boxes": { eq: 3 },
    },
    patch: {
      desktop: {
        rows: [
          {
            height: 40,
            columns: [
              {
                id: "loot-boxes",
                width: 80,
              },
              {
                id: "power-ups",
                width: 20,
                doubleRow: true,
              },
            ],
          },
          {
            height: 60,
            columns: [
              {
                id: "level-up-table",
                width: 100,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          {
            height: 35,
            columns: [
              {
                id: "loot-boxes",
                width: 67,
              },
              {
                id: "power-ups",
                width: 33,
                doubleRow: true,
              },
            ],
          },
          {
            height: 65,
            columns: [
              {
                id: "level-up-table",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
  {
    id: "modifiers-mobile-balanced-when-extra-loot-boxes",
    storeId: "modifiers",
    conditions: {
      "loot-boxes": { gte: 3 },
    },
    patch: {
      mobile: {
        rows: [
          {
            height: 50,
            columns: [
              {
                id: "modifiers",
                width: 100,
              },
            ],
          },
          {
            height: 50,
            columns: [
              {
                id: "loot-boxes",
                width: 100,
              },
            ],
          },
        ],
      },
    },
  },
];

const matchesCountCondition = (
  count: number,
  condition: CountCondition,
): boolean => {
  if (condition.eq !== undefined && count !== condition.eq) return false;
  if (condition.gte !== undefined && count < condition.gte) return false;
  if (condition.lte !== undefined && count > condition.lte) return false;

  return true;
};

const matchesOverrideConditions = (
  conditions: SectionCountConditions,
  sectionCounts: Partial<Record<StoreSectionId, number>>,
): boolean =>
  Object.entries(conditions).every(([sectionId, condition]) =>
    matchesCountCondition(
      sectionCounts[sectionId as StoreSectionId] ?? 0,
      condition as CountCondition,
    ),
  );

const applyDistributionPatch = (
  distribution: StoreDistribution,
  patch: Partial<StoreDistribution>,
): StoreDistribution => ({
  desktop: patch.desktop ?? distribution.desktop,
  mobile: patch.mobile ?? distribution.mobile,
});

export const resolveStoreDistribution = (
  store: StoreConfig,
  context?: StoreDistributionContext,
): StoreDistribution => {
  const sectionCounts = context?.sectionCounts;
  if (!sectionCounts) {
    return store.distribution;
  }

  return storeDistributionOverrides
    .filter((override) => override.storeId === store.id)
    .reduce((distribution, override) => {
      if (!matchesOverrideConditions(override.conditions, sectionCounts)) {
        return distribution;
      }

      return applyDistributionPatch(distribution, override.patch);
    }, store.distribution);
};

export const getStoreConfigById = (
  storeId?: string,
  context?: StoreDistributionContext,
): StoreConfig | undefined => {
  if (!storeId) return undefined;

  const store = storesConfig.find((config) => config.id === storeId);
  if (!store) return undefined;

  const resolvedDistribution = resolveStoreDistribution(store, context);
  if (resolvedDistribution === store.distribution) {
    return store;
  }

  return {
    ...store,
    distribution: resolvedDistribution,
  };
};
