import { academicBuildingNodes } from "./nodes/academicBuilding";
import { outdoorNodes } from "./nodes/outdoor";

export interface TreeMap {
  id: number;
  name: string;
  nodes: Node[];
}

export interface Node {
  id: number;
  name?: string;
  coordinates: [number, number];
  type: "building" | "room" | "exit" | "road" | "stairs" | "elevator";
  connections: Connection[];
}

export interface Connection {
  id: number;
  distance: number;
}

export const mockTreeMap: TreeMap[] = [
  {
    id: 1,
    name: "Outdoor",
    nodes: outdoorNodes,
  },
  {
    id: 2,
    name: "Academic Building",
    nodes: academicBuildingNodes,
  },
];

export const mockFetchTreeMap = (id: number): Promise<Node[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTreeMap[id - 1].nodes);
    }, 1000);
  });
};
