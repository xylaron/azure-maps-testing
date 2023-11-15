import { type Node } from "@/mock/treemap/treemap";

export const academicBuildingNodes: Node[] = [
  {
    id: 1,
    name: "Exit A",
    coordinates: [-0.0018486518701763544, -0.00013117136404616758],
    type: "exit",
    pano: "https://pathadvisor.ust.hk/api/pano/images/5daac2b49ce12a5d92f513f7",
    connections: [
      {
        id: 2,
        distance: 204.22247258869862,
      },
      {
        id: 7,
        distance: 339.84249083473827,
      },
    ],
  },
  {
    id: 2,
    coordinates: [-0.00001459869022824023, -0.00022817794689444781],
    type: "road",
    connections: [
      {
        id: 1,
        distance: 204.22247258869862,
      },
      {
        id: 3,
        distance: 316.0800890130527,
      },
    ],
  },
  {
    id: 3,
    coordinates: [0.0024128500830613575, -0.00170727692852779],
    type: "road",
    connections: [
      {
        id: 2,
        distance: 316.0800890130527,
      },
      {
        id: 4,
        distance: 197.96072536570648,
      },
    ],
  },
  {
    id: 4,
    coordinates: [0.0037973990193904683, -0.0005881232018936089],
    type: "road",
    connections: [
      {
        id: 3,
        distance: 197.96072536570648,
      },
      {
        id: 5,
        distance: 97.1326286805884,
      },
    ],
  },
  {
    id: 5,
    coordinates: [0.003214577928872586, 0.00006255527347320822],
    type: "road",
    connections: [
      {
        id: 4,
        distance: 97.1326286805884,
      },
      {
        id: 6,
        distance: 60.096571194249044,
      },
    ],
  },
  {
    id: 6,
    coordinates: [0.0035226833645651823, 0.0005065931313339433],
    name: "G106",
    type: "room",
    pano: "https://pathadvisor.ust.hk/api/pano/images/5daac8339ce12a5d92f513fe",
    connections: [
      {
        id: 5,
        distance: 60.096571194249044,
      },
    ],
  },
  {
    id: 7,
    coordinates: [-0.004708260488854421, -0.0012098127890425303],
    type: "road",
    connections: [
      {
        id: 1,
        distance: 339.84249083473827,
      },
      {
        id: 8,
        distance: 117.4363497994231,
      },
    ],
  },
  {
    id: 8,
    coordinates: [-0.0056528909444466535, -0.0007374941810951441],
    name: "Starbucks Coffee",
    type: "room",
    pano: "https://pathadvisor.ust.hk/api/pano/images/5daac91c9ce12a5d92f51405",
    connections: [
      {
        id: 7,
        distance: 117.4363497994231,
      },
      {
        id: 9,
        distance: 217.4018537431742,
      },
    ],
  },
  {
    id: 9,
    coordinates: [-0.007205294324364786, 0.000451044159774483],
    name: "Tsang Shiu Tim Art Hall",
    type: "room",
    pano: "https://pathadvisor.ust.hk/api/pano/images/5daac8f69ce12a5d92f51403",
    connections: [
      {
        id: 8,
        distance: 217.4018537431742,
      },
    ],
  },
];
