export const storesConfig = [
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
          { height:65, columns: [{id: "level-up-table", width: 100 }] },
          { height: 20, columns: [{ id: "modifiers", width: 100 }] },
        ],
      },
    },
  },
];
