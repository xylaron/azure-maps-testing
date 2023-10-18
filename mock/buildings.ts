import { Room } from "@/mock/rooms";

export interface Building {
  id: number;
  name: string;
  coordinates: [number, number];
  type: string;
  imageUrl: string;
  imageCenter: [number, number];
  treeMapId: number;
  rooms?: Room[];
}

export const mockLocations: Building[] = [
  {
    id: 1,
    name: "The Hong Kong Jockey Club Atrium",
    coordinates: [114.26887130320836, 22.334141590268203],
    type: "building",
    imageUrl: "https://pathadvisor.ust.hk/api/floors/G/map-image",
    imageCenter: [0, 0],
    treeMapId: 2,
  },
  {
    id: 2,
    name: "Shaw Auditorium",
    coordinates: [114.26812908819306, 22.331018942275094],
    type: "building",
    imageUrl: "https://pathadvisor.ust.hk/api/floors/SAG/map-image",
    imageCenter: [-0.005970503841894015, 0.005317988167703902],
    treeMapId: 3,
  },
];

export const mockFetchBuildings = (): Promise<Building[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLocations);
    }, 1000);
  });
};
