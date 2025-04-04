// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("crusade");

db.getCollection("forces").insertMany([
  {
    id: 0,
    name: "Litanists of the Abyss",
    supplyLimit: 1000,
    supplyUsed: 1000,
    battleTally: 0,
    victories: 0,
    requisitionPoints: 0,
    units: [
      {
        id: 0,
        name: "Chaos Lord",
        pointsValue: 105,
        crusadePoints: 0,
      },
      {
        id: 1,
        name: "Master of Executions",
        pointsValue: 95,
        crusadePoints: 0,
      },
      {
        id: 2,
        name: "Master of Possession",
        pointsValue: 95,
        crusadePoints: 0,
      },
      {
        id: 3,
        name: "Cultist Mob",
        pointsValue: 50,
        crusadePoints: 0,
      },
      {
        id: 4,
        name: "Legionaries",
        pointsValue: 170,
        crusadePoints: 0,
      },
      {
        id: 5,
        name: "Chosen",
        pointsValue: 125,
        crusadePoints: 0,
      },
      {
        id: 6,
        name: "Helbrute",
        pointsValue: 130,
        crusadePoints: 0,
      },
      {
        id: 7,
        name: "Possessed",
        pointsValue: 120,
        crusadePoints: 0,
      },
      {
        id: 8,
        name: "Venomcrawler",
        pointsValue: 120,
        crusadePoints: 0,
      },
    ],
    recordOfAchivement: [],
  },
]);
