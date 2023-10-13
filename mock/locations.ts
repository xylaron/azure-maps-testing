export interface Building {
  id: number;
  name: string;
  location: [number, number];
  type: string;
}

export const mockLocations: Building[] = [
  {
    id: 1,
    name: "The Hong Kong Jockey Club Atrium",
    location: [114.26887130320836, 22.334141590268203],
    type: "building",
  },
  {
    id: 2,
    name: "Academic Building",
    location: [114.26827757078553, 22.33280142803781],
    type: "building",
  },
];

export const mockFetchLocations = (): Promise<Building[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockLocations);
    }, 1000);
  });
};
