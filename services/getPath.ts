interface Connections {
  [key: string]: number;
}

interface Nodes {
  [key: string]: Connections;
}

interface GraphData {
  points: {
    name: string;
    connections: {
      name: string;
      distance: number;
    }[];
  }[];
}

const graphData = {
  points: [
    {
      name: "A",
      connections: [
        {
          name: "D",
          distance: 1,
        },
      ],
    },
    {
      name: "B",
      connections: [
        {
          name: "C",
          distance: 2,
        },
        {
          name: "D",
          distance: 6,
        },
        {
          name: "E",
          distance: 1,
        },
      ],
    },
    {
      name: "C",
      connections: [
        {
          name: "B",
          distance: 2,
        },
        {
          name: "D",
          distance: 1,
        },
      ],
    },
    {
      name: "D",
      connections: [
        {
          name: "A",
          distance: 1,
        },
        {
          name: "B",
          distance: 6,
        },
        {
          name: "C",
          distance: 1,
        },
      ],
    },
    {
      name: "E",
      connections: [
        {
          name: "B",
          distance: 1,
        },
      ],
    },
  ],
};

class Graph {
  nodes: Nodes;

  constructor() {
    this.nodes = {};
  }

  addNode(node: string, edges: Connections): void {
    this.nodes[node] = edges;
  }
}

interface QueueElement {
  element: string;
  priority: number;
}

class PriorityQueue {
  collection: QueueElement[];

  constructor() {
    this.collection = [];
  }

  enqueue(element: string, priority: number): void {
    if (this.isEmpty()) {
      this.collection.push({ element, priority });
    } else {
      let added = false;
      for (let i = 0; i < this.collection.length; i++) {
        if (priority < this.collection[i].priority) {
          this.collection.splice(i, 0, { element, priority });
          added = true;
          break;
        }
      }
      if (!added) this.collection.push({ element, priority });
    }
  }

  dequeue(): string | null {
    //@ts-ignore
    return this.collection.shift().element;
  }

  isEmpty(): boolean {
    return this.collection.length === 0;
  }
}

const shortestPath = (
  graph: Graph,
  startNode: string,
  endNode: string
): string[] => {
  let distances: { [key: string]: number } = {};
  let previous: { [key: string]: string } = {};
  let queue = new PriorityQueue();

  queue.enqueue(startNode, 0);
  distances[startNode] = 0;

  for (let node in graph.nodes) {
    if (node !== startNode) distances[node] = Infinity;
  }

  while (!queue.isEmpty()) {
    let shortestNode = queue.dequeue();

    if (shortestNode === endNode) {
      let path: string[] = [];
      let current = endNode;
      while (current) {
        path.unshift(current);
        current = previous[current];
      }
      return path;
    }

    if (!shortestNode || distances[shortestNode] === Infinity) continue;

    for (let neighbor in graph.nodes[shortestNode]) {
      let distanceFromStart =
        distances[shortestNode] + graph.nodes[shortestNode][neighbor];

      if (distanceFromStart < distances[neighbor]) {
        distances[neighbor] = distanceFromStart;
        previous[neighbor] = shortestNode;
        queue.enqueue(neighbor, distanceFromStart);
      }
    }
  }

  return [];
};

const graph = new Graph();
for (const point of graphData.points) {
  graph.addNode(
    point.name,
    point.connections.reduce(
      (acc: Connections, connection: { name: string; distance: number }) => {
        acc[connection.name] = connection.distance;
        return acc;
      },
      {}
    )
  );
}

let start: string = "A";
let end: string = "E";
let shortestPathResult = shortestPath(graph, start, end);
console.log(`The path from ${start} to ${end}: `, shortestPathResult);
