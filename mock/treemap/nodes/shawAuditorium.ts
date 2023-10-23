import { type Node } from "@/mock/treemap/treemap";

export const shawAuditoriumNodes: Node[] = [
  {
    id: 1,
    name: "Exit A",
    coordinates: [-0.006197036195374039, 0.000611782916379866],
    type: "exit",
    connections: [
      {
        id: 2,
        distance: 75.53402603909569,
      },
      {
        id: 5,
        distance: 581.6090783084334,
      },
    ],
  },
  {
    id: 2,
    coordinates: [-0.0055193318350461595, 0.0006582252295999069],
    type: "road",
    connections: [
      {
        id: 1,
        distance: 75.53402603909569,
      },
      {
        id: 3,
        distance: 347.96938822015295,
      },
    ],
  },
  {
    id: 3,
    coordinates: [-0.005598885966861644, 0.003786577765652055],
    type: "road",
    connections: [
      {
        id: 2,
        distance: 347.96938822015295,
      },
      {
        id: 4,
        distance: 190.68152574882893,
      },
    ],
  },
  {
    id: 4,
    name: "G01",
    coordinates: [-0.006363191993756345, 0.005321671605059919],
    type: "room",
    connections: [
      {
        id: 3,
        distance: 190.68152574882893,
      },
    ],
  },
  {
    id: 5,
    coordinates: [-0.010282956033648816, 0.0018584421791700834],
    type: "road",
    connections: [
      {
        id: 1,
        distance: 581.6090783084334,
      },
      {
        id: 6,
        distance: 118.25652597244317,
      },
      {
        id: 7,
        distance: 369.06573684003484,
      },
    ],
  },
  {
    id: 6,
    name: "G16",
    coordinates: [-0.010148909070352374, 0.002913467059471486],
    type: "room",
    connections: [
      {
        id: 5,
        distance: 118.25652597244317,
      },
    ],
  },
  {
    id: 7,
    coordinates: [-0.012002570576811422, 0.005666698591198838],
    type: "road",
    connections: [
      {
        id: 5,
        distance: 369.06573684003484,
      },
      {
        id: 8,
        distance: 174.2962703470111,
      },
    ],
  },
  {
    id: 8,
    name: "G12",
    coordinates: [-0.010449281093372065, 0.005456227862623564],
    type: "room",
    connections: [
      {
        id: 7,
        distance: 174.2962703470111,
      },
    ],
  },
];
