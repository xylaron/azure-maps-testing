import { academicBuildingNodes } from "./nodes/academicBuilding";
import { campusMapNodes } from "./nodes/campusMap";
import { shawAuditoriumNodes } from "./nodes/shawAuditorium";

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
    name: "Campus Map",
    nodes: campusMapNodes,
  },
  {
    id: 2,
    name: "Academic Building",
    nodes: academicBuildingNodes,
  },
  {
    id: 3,
    name: "Shaw Auditorium",
    nodes: shawAuditoriumNodes,
  },
];

export const mockFetchFullTreeMap = (): Promise<TreeMap[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTreeMap);
    }, 1000);
  });
};

export const mockFetchTreeMap = (id: number): Promise<Node[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTreeMap[id - 1].nodes);
    }, 1000);
  });
};
