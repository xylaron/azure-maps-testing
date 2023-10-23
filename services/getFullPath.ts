import { TreeMap } from "@/mock/treemap/treemap";
import { getSinglePath } from "@/services/getSinglePath";

export const getFullPath = (
  fullTreeMap: TreeMap[],
  startBuilding: string,
  startLocation: string,
  endBuilding: string,
  endLocation: string
) => {
  const startBuildingTree = fullTreeMap.find(
    (building) => building.name === startBuilding
  );
  console.log("startBuildingTree: ", startBuildingTree);

  const endBuildingTree = fullTreeMap.find(
    (building) => building.name === endBuilding
  );
  console.log("endBuildingTree: ", endBuildingTree);

  const startLocationNode = startBuildingTree?.nodes.find(
    (node) => node.name === startLocation
  );
  console.log("startLocationNode: ", startLocationNode);

  const endLocationNode = endBuildingTree?.nodes.find(
    (node) => node.name === endLocation
  );
  console.log("endLocationNode: ", endLocationNode);

  //check if the start and end are in the same building
  if (startBuildingTree?.id === endBuildingTree?.id) {
    return [
      {
        id: startBuildingTree?.id,
        path: getSinglePath(
          startBuildingTree!.nodes,
          startLocationNode!.id,
          endLocationNode!.id
        ),
      },
    ];
  }

  //get the outdoor path
  const outdoorTree = fullTreeMap.find(
    (building) => building.name === "Campus Map"
  );
  console.log("outdoorTree: ", outdoorTree);
  const outdoorStart =
    outdoorTree?.nodes.find((node) => node.name === startBuilding) ??
    startLocationNode;
  const outdoorEnd =
    outdoorTree?.nodes.find((node) => node.name === endBuilding) ??
    endLocationNode;
  console.log("outdoorStart: ", outdoorStart);
  console.log("outdoorEnd: ", outdoorEnd);
  if (outdoorStart === outdoorEnd) {
    return [{ id: outdoorTree?.id, path: [] }];
  }
  const outdoorPath = getSinglePath(
    outdoorTree!.nodes,
    outdoorStart!.id,
    outdoorEnd!.id
  );
  console.log("outdoorPath: ", outdoorPath);

  //find the exits used in the outdoor path
  const outdoorStartExit = outdoorTree?.nodes.find(
    (node) => node.id === outdoorPath[1]
  )?.name;
  const outdoorEndExit = outdoorTree?.nodes.find(
    (node) => node.id === outdoorPath[outdoorPath.length - 2]
  )?.name;

  const outdoorStartExitText = "Exit " + outdoorStartExit?.slice(-1);
  const outdoorEndExitText = "Exit " + outdoorEndExit?.slice(-1);

  const outdoorStartExitNode = startBuildingTree?.nodes.find(
    (node) => node.name === outdoorStartExitText
  );
  const outdoorEndExitNode = endBuildingTree?.nodes.find(
    (node) => node.name === outdoorEndExitText
  );

  if (!outdoorStartExitNode) {
    return [
      {
        id: outdoorTree?.id,
        path: outdoorPath,
      },
      {
        id: endBuildingTree?.id,
        path: getSinglePath(
          endBuildingTree!.nodes,
          outdoorEndExitNode!.id,
          endLocationNode!.id
        ),
      },
    ];
  }

  if (!outdoorEndExitNode) {
    return [
      {
        id: startBuildingTree?.id,
        path: getSinglePath(
          startBuildingTree!.nodes,
          startLocationNode!.id,
          outdoorStartExitNode!.id
        ),
      },
      {
        id: outdoorTree?.id,
        path: outdoorPath,
      },
    ];
  }

  console.log("outdoorStartExitNode: ", outdoorStartExitNode);
  console.log("outdoorEndExitNode: ", outdoorEndExitNode);

  const startBuildingPath = getSinglePath(
    startBuildingTree!.nodes,
    startLocationNode!.id,
    outdoorStartExitNode!.id
  );

  const endBuildingPath = getSinglePath(
    endBuildingTree!.nodes,
    outdoorEndExitNode!.id,
    endLocationNode!.id
  );

  return [
    {
      id: startBuildingTree?.id,
      path: startBuildingPath,
    },
    {
      id: outdoorTree?.id,
      path: outdoorPath,
    },
    {
      id: endBuildingTree?.id,
      path: endBuildingPath,
    },
  ];
};
