import { Node } from "@/mock/treemap";

interface Connections {
  [key: string]: number;
}

interface Nodes {
  [key: string]: Connections;
}

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

export const getSinglePath = (
  graphData: Node[],
  start: number,
  end: number
) => {
  const graph = new Graph();
  for (const point of graphData) {
    graph.addNode(
      point.id.toString(),
      point.connections.reduce(
        (acc: Connections, connection: { id: number; distance: number }) => {
          acc[connection.id.toString()] = connection.distance;
          return acc;
        },
        {}
      )
    );
  }

  let shortestPathResult = shortestPath(
    graph,
    start.toString(),
    end.toString()
  );
  //change string array to number array
  let formattedShortestPathResult = shortestPathResult.map((point) =>
    parseInt(point)
  );

  return formattedShortestPathResult;
};
