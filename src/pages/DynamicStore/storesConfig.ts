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
                width: 80,
              },
              {
                id: "burn",
                width: 20,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          { height: 30, columns: [{ id: "traditionals", width: 100 }] },
          { height: 40, columns: [{ id: "modifiers", width: 100 }] },
          { height: 30, columns: [{ id: "burn", width: 100 }] },
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
            height: 70,
            columns: [
              {
                id: "specials",
                width: 100,
              },
            ],
          },
          {
            height: 30,
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
            height: 75,
            columns: [
              {
                id: "specials",
                width: 100,
                doubleRow: true,
              },
            ],
          },
          {
            height: 25,
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
    id: "level-up",
    name: "Level up",
    distribution: {
      desktop: {
        rows: [
          {
            height: 50,
            columns: [
              {
                id: "level-up-table",
                width: 100,
              },
            ],
          },
          {
            height: 50,
            columns: [
              {
                id: "modifiers",
                width: 75,
              },
              {
                id: "power-ups",
                width: 25,
              },
            ],
          },
        ],
      },
      mobile: {
        rows: [
          { height: 65, columns: [{ id: "level-up-table", width: 100 }] },
          {
            height: 20,
            columns: [
              {
                id: "power-ups",
                width: 100,
                doubleRow: true,
              },
            ],
          },
        ],
      },
    },
  },
];
