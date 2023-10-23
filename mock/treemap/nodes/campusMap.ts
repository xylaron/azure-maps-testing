import { type Node } from "@/mock/treemap/treemap";

export const campusMapNodes: Node[] = [
  {
    id: 1,
    name: "The Hong Kong Jockey Club Atrium",
    coordinates: [114.26887130320836, 22.334141590268203],
    type: "building",
    connections: [
      {
        id: 4,
        distance: 78.21540971752178,
      },
    ],
  },
  {
    id: 3,
    name: "Shaw Auditorium",
    coordinates: [114.26812908819306, 22.331018942275094],
    type: "building",
    connections: [
      {
        id: 14,
        distance: 15.7111296822275,
      },
    ],
  },
  {
    id: 4,
    name: "The Hong Kong Jockey Club Atrium Exit A",
    coordinates: [114.2681902784787, 22.334569884435595],
    type: "exit",
    connections: [
      {
        id: 1,
        distance: 78.21540971752178,
      },
      {
        id: 5,
        distance: 30.726223034893145,
      },
    ],
  },
  {
    id: 5,
    coordinates: [114.26791739609797, 22.334675718863238],
    type: "road",
    connections: [
      {
        id: 4,
        distance: 30.726223034893145,
      },
      {
        id: 6,
        distance: 5.666789872904679,
      },
    ],
  },
  {
    id: 6,
    coordinates: [114.26787982239733, 22.334591948834557],
    type: "road",
    connections: [
      {
        id: 5,
        distance: 5.666789872904679,
      },
      {
        id: 7,
        distance: 9.210344271276515,
      },
    ],
  },
  {
    id: 7,
    coordinates: [114.26779789266567, 22.33456230624175],
    type: "road",
    connections: [
      {
        id: 6,
        distance: 9.210344271276515,
      },
      {
        id: 8,
        distance: 14.490193156250555,
      },
    ],
  },
  {
    id: 8,
    coordinates: [114.26766807079036, 22.334589819759486],
    type: "road",
    connections: [
      {
        id: 7,
        distance: 14.490193156250555,
      },
      {
        id: 9,
        distance: 35.87110058742833,
      },
    ],
  },
  {
    id: 9,
    coordinates: [114.26743835293541, 22.334038743909247],
    type: "road",
    connections: [
      {
        id: 8,
        distance: 35.87110058742833,
      },
      {
        id: 10,
        distance: 33.21445904809246,
      },
    ],
  },
  {
    id: 10,
    coordinates: [114.26737635744615, 22.333327786641377],
    type: "road",
    connections: [
      {
        id: 9,
        distance: 33.21445904809246,
      },
      {
        id: 11,
        distance: 77.28001174217013,
      },
    ],
  },
  {
    id: 11,
    coordinates: [114.26745977212425, 22.331649006621078],
    type: "road",
    connections: [
      {
        id: 10,
        distance: 77.28001174217013,
      },
      {
        id: 12,
        distance: 20.17508225479536,
      },
    ],
  },
  {
    id: 12,
    coordinates: [114.2675537053891, 22.331271313699332],
    type: "road",
    connections: [
      {
        id: 11,
        distance: 20.17508225479536,
      },
      {
        id: 13,
        distance: 43.214351021541006,
      },
    ],
  },
  {
    id: 13,
    coordinates: [114.26788629191515, 22.330782123542818],
    type: "road",
    connections: [
      {
        id: 12,
        distance: 43.214351021541006,
      },
      {
        id: 14,
        distance: 41.15405947937345,
      },
    ],
  },
  {
    id: 14,
    name: "Shaw Auditorium Exit A",
    coordinates: [114.26825491922693, 22.3308625746305],
    type: "exit",
    connections: [
      {
        id: 13,
        distance: 41.15405947937345,
      },
      {
        id: 3,
        distance: 15.7111296822275,
      },
    ],
  },
];
