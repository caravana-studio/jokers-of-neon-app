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