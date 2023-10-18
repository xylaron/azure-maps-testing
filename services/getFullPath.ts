import { TreeMap } from "@/mock/treemap";
import { getSinglePath } from "@/services/getSinglePath";

export const getFullPath = (
  fullTreeMap: TreeMap[],
  startPoint: string,
  endPoint: string
) => {
  const locationA = fullTreeMap.find((treeMap) => {
    return treeMap.nodes.find((node) => node.name === startPoint);
  });

  const locationB = fullTreeMap.find((treeMap) => {
    return treeMap.nodes.find((node) => node.name === endPoint);
  });

  console.log(locationA);
  console.log(locationB);

  if (locationA === locationB) {
    const pointA = locationA?.nodes.find((node) => node.name === startPoint);
    const pointB = locationB?.nodes.find((node) => node.name === endPoint);
    const path = getSinglePath(locationA!.nodes, pointA!.id, pointB!.id);
    return [
      {
        id: locationA!.id,
        path: path,
      },
    ];
  }
};
