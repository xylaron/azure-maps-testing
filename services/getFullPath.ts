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
};
