const roads = [
  "House A-House B",
  "House A-Cabin",
  "House A-Post Office",
  "House B-Town Hall",
  "House D-House E",
  "House D-Town Hall",
  "House E-House G",
  "House G-Farm",
  "House G-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Market Place-Town Hall",
  "Shop-Town Hall",
];

const roadGraph = buildGraph(roads);

function buildGraph(edges) {
  let graph = Object.create(null);

  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges.map((it) => it.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }

  return graph;
}

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((it) => {
          if (it.place != this.place) return it;
          return { place: destination, address: it.address };
        })
        .filter((it) => it.place != it.address);
      return new VillageState(destination, parcels);
    }
  }

  static random(parcelCount = 5) {
    let parcels = [];
    for (let i = 0; i < parcelCount; i++) {
      let address = randomPick(Object.keys(roadGraph));
      let place;
      do {
        place = randomPick(Object.keys(roadGraph));
      } while (place == address);
      parcels.push({ place, address });
    }
    return new VillageState("Post Office", parcels);
  }
}

function runRobot(state, robot, memory) {
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns.`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}.`);
  }
}

console.log(` ===== Service Day ${new Date().toUTCString()} ===== `);
console.log("\n");
console.log(" === Random Robot === ");
runRobot(VillageState.random(), randomRobot);
