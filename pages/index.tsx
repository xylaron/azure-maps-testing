//@ts-nocheck
/*
  Originally this page was used to test the Azure Maps Routing API and the Indoor Map module, but since the Indoor Map module does not have a npm pacakage, we needed to import it via script tag.
  However, the Indoor Maps Module is no longer used in this page, therefore the script tag is no longer needed and can use the Azure Maps npm package instead.
  To-do: Convert this page to use the Azure Maps npm package instead of the script tag, to reenable TypeScript and to remove the @ts-nocheck comment.
*/
import { Inter } from "next/font/google";
import Head from "next/head";
import dynamic from "next/dynamic";
import "azure-maps-control/dist/atlas.min.css";
import "azure-maps-indoor/dist/atlas-indoor.min.css";
import { useEffect, useState } from "react";
import { MapPin, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Combobox } from "@/components/ui/combobox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockFetchBuildings, type Building } from "@/mock/buildings";
import {
  Node,
  TreeMap,
  mockFetchFullTreeMap,
  mockFetchTreeMap,
} from "@/mock/treemap/treemap";
import { getFullPath } from "@/services/getFullPath";
import SymbolProperties from "@/components/SymbolProperties";

const inter = Inter({ subsets: ["latin"] });

const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer
    ),
  {
    ssr: false,
  }
);

const Home = () => {
  const [map, setMap] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [locationsA, setLocationsA] = useState<any>([]);
  const [locationsB, setLocationsB] = useState<any>([]);
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [treeMap, setTreeMap] = useState<Node[]>([]);
  const [fullTreeMap, setFullTreemap] = useState<TreeMap[]>([]);
  const [currentTreeMap, setCurrentTreeMap] = useState<number>(1);
  const [selectedBuildingA, setSelectedBuildingA] = useState<string>("None");
  const [selectedBuildingB, setSelectedBuildingB] = useState<string>("None");
  const [selectedLocationA, setSelectedLocationA] = useState<string>("None");
  const [selectedLocationB, setSelectedLocationB] = useState<string>("None");
  const [selectedPointA, setSelectedPointA] = useState<any>({});
  const [selectedPointB, setSelectedPointB] = useState<any>({});
  const [allPaths, setAllPaths] = useState<any>([]);
  const [mapConfig, setMapConfig] = useState<string>(
    "3e22b555-b7ec-011f-9085-d15560fea8ea"
  );

  //indoor symbol states
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [selectedSymbol, setSelectedSymbol] = useState<any>({});
  const [isPanoOpen, setIsPanoOpen] = useState<boolean>(false);

  //map onload
  useEffect(() => {
    const region = "us";
    atlas.setDomain(`${region}.atlas.microsoft.com`);

    let southwest = new atlas.data.Position(
      114.25533413886734,
      22.32392661393618
    );
    let northeast = new atlas.data.Position(
      114.28604006767,
      22.343040319755985
    );

    let boundingBox = new atlas.data.BoundingBox(southwest, northeast);
    const map = new atlas.Map("map", {
      center: [114.27068710327148, 22.333478832257015],
      zoom: 16,
      minZoom: 15,
      maxBounds: boundingBox,
      mapConfiguration: mapConfig,
      styleAPIVersion: "2023-03-01-preview",
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
      },
    });
    console.log("Map", map);
    setMap(map);

    setIsLoading(true);
    mockFetchFullTreeMap().then((response) => {
      console.log("Mock Full TreeMap:", response);
      setFullTreemap(response);
      console.log("Mock Treemap: ", response[currentTreeMap - 1].nodes);
      setTreeMap(response[currentTreeMap - 1].nodes);
      setIsLoading(false);
    });

    map.events.add("ready", () => {
      map.controls.add([new atlas.control.ZoomControl()], {
        position: "top-right",
      });

      setIsLoading(true);
      mockFetchBuildings().then((response) => {
        console.log("Mock Locations:", response);
        setBuildings(response);
        setIsLoading(false);
      });

      //map event handlers
      map.events.add("click", (e: any) => {
        console.log("Camera bound ", map.getCamera().bounds);
        console.log("Mouse click position:", e.position);
      });
    });

    //map cleanup
    return () => {
      map.dispose();
      setMap(null);
    };
  }, []);

  //map configuration change
  useEffect(() => {
    if (map) {
      map.setServiceOptions({
        mapConfiguration: mapConfig,
      });
    }
  }, [mapConfig]);

  //location symbol layers and event handlers
  useEffect(() => {
    if (!map) return;
    // if (map.ready == false) return;
    const locationSymbolDataSource = new atlas.source.DataSource();
    map.sources.add(locationSymbolDataSource);

    const locationSymbolLayer = new atlas.layer.SymbolLayer(
      locationSymbolDataSource,
      "location-symbols",
      {
        iconOptions: {
          image: ["get", "icon"],
          allowOverlap: true,
          ignorePlacement: true,
          size: 1,
        },
        textOptions: {
          allowOverlap: true,
          ignorePlacement: true,
          textField: ["get", "title"],
          offset: [0, 0.5],
          color: "#000000",
          haloColor: "#FFFFFF",
          haloWidth: 1,
          font: ["StandardFont-Bold"],
          size: 14,
          anchor: "top",
        },
        filter: ["==", ["geometry-type"], "Point"],
        minZoom: 15,
      }
    );
    for (let i = 0; i < buildings.length; i++) {
      const point = new atlas.data.Feature(
        new atlas.data.Point(buildings[i].coordinates),
        {
          icon: "marker-red",
          title: buildings[i].name,
          imageUrl: buildings[i].imageUrl,
          imageCenter: buildings[i].imageCenter,
          treeMapId: buildings[i].treeMapId,
        }
      );
      locationSymbolDataSource.add(point);
    }
    map.layers.add(locationSymbolLayer);
    map.events.add("click", locationSymbolLayer, (e: any) => {
      const symbol = map.layers.getRenderedShapes(
        e.position,
        locationSymbolLayer
      );
      console.log("Symbol Geometry:", symbol[0].data.geometry);
      console.log("Symbol Properties:", symbol[0].data.properties);

      const indoorMapLayer = map.layers.getLayerById("indoor-map");
      if (indoorMapLayer) map.layers.remove(indoorMapLayer);

      const imageWidth = 4992;
      const imageHeight = 3532;

      const pixelSize = 0.0000075;

      const imageTopLeft = [
        (-imageWidth / 2) * pixelSize,
        (imageHeight / 2) * pixelSize,
      ];
      const imageTopRight = [
        (imageWidth / 2) * pixelSize,
        (imageHeight / 2) * pixelSize,
      ];
      const imageBottomRight = [
        (imageWidth / 2) * pixelSize,
        (-imageHeight / 2) * pixelSize,
      ];
      const imageBottomLeft = [
        (-imageWidth / 2) * pixelSize,
        (-imageHeight / 2) * pixelSize,
      ];

      map.layers.add(
        new atlas.layer.ImageLayer(
          {
            url: symbol[0].data.properties.imageUrl,
            coordinates: [
              imageTopLeft,
              imageTopRight,
              imageBottomRight,
              imageBottomLeft,
            ],
          },
          "indoor-map"
        )
      );

      map.setCamera({
        center: symbol[0].data.properties.imageCenter,
        zoom: 15,
      });

      const southwest = new atlas.data.Position(
        imageBottomLeft[0],
        imageBottomLeft[1]
      );
      const northeast = new atlas.data.Position(
        imageTopRight[0],
        imageTopRight[1]
      );
      map.setCamera({
        maxBounds: new atlas.data.BoundingBox(southwest, northeast),
      });
      setCurrentTreeMap(symbol[0].data.properties.treeMapId);
      setTreeMap([]);
    });

    map.events.add("mouseover", locationSymbolLayer, (e: any) => {
      map.getCanvasContainer().style.cursor = "pointer";
    });

    map.events.add("mouseout", locationSymbolLayer, (e: any) => {
      map.getCanvasContainer().style.cursor = "grab";
    });
  }, [buildings]);

  //indoor map symbol layers
  useEffect(() => {
    if (!map) return;
    if (currentTreeMap === 1) return;
    const treeSymbolDataSource = new atlas.source.DataSource();
    map.sources.add(treeSymbolDataSource);

    const treeMapLayer = map.layers.getLayerById("indoor-symbols");
    if (treeMapLayer) map.layers.remove(treeMapLayer);

    const newTreeMapLayer = new atlas.layer.SymbolLayer(
      treeSymbolDataSource,
      "indoor-symbols",
      {
        iconOptions: {
          image: ["get", "icon"],
          allowOverlap: true,
          ignorePlacement: true,
          size: ["get", "size"],
          offset: ["get", "iconOffset"],
        },
        textOptions: {
          allowOverlap: true,
          ignorePlacement: true,
          textField: ["get", "title"],
          offset: ["get", "textOffset"],
          color: "#000000",
          haloColor: "#FFFFFF",
          haloWidth: 1,
          font: ["StandardFont-Bold"],
          size: 12,
          anchor: "top",
        },
        filter: ["==", ["geometry-type"], "Point"],
        minZoom: 15,
      }
    );
    for (let i = 0; i < treeMap.length; i++) {
      if (treeMap[i].type === "room") {
        const point = new atlas.data.Feature(
          new atlas.data.Point(treeMap[i].coordinates),
          {
            icon: "none",
            title: treeMap[i].name,
            size: 1,
          }
        );
        treeSymbolDataSource.add(point);
      }
      if (treeMap[i].type === "exit") {
        const point = new atlas.data.Feature(
          new atlas.data.Point(treeMap[i].coordinates),
          {
            icon: "pin-round-blue",
            title: treeMap[i].name,
            size: 0.75,
            iconOffset: [0, 10],
            textOffset: [0, 0.5],
          }
        );
        treeSymbolDataSource.add(point);
      }
    }
    map.layers.add(newTreeMapLayer);
    map.events.add("click", newTreeMapLayer, (e: any) => {
      const symbol = map.layers.getRenderedShapes(e.position, newTreeMapLayer);
      console.log("Symbol Geometry:", symbol[0].data.geometry);
      console.log("Symbol Properties:", symbol[0].data.properties);
      setSelectedSymbol(symbol[0].data.properties);
      setIsMenuOpen(true);
    });
    map.events.add("mouseover", newTreeMapLayer, (e: any) => {
      map.getCanvasContainer().style.cursor = "pointer";
    });

    map.events.add("mouseout", newTreeMapLayer, (e: any) => {
      map.getCanvasContainer().style.cursor = "grab";
    });
  }, [treeMap]);

  //user selection handlers
  useEffect(() => {
    if (selectedBuildingA === "None") return;
    setLocationsA(
      fullTreeMap.find((treeMap) => treeMap.name === selectedBuildingA).nodes
    );
    setSelectedLocationA("None");
  }, [selectedBuildingA]);

  useEffect(() => {
    if (selectedBuildingB === "None") return;
    setLocationsB(
      fullTreeMap.find((treeMap) => treeMap.name === selectedBuildingB).nodes
    );
    setSelectedLocationB("None");
  }, [selectedBuildingB]);

  useEffect(() => {
    setSelectedPointA({
      building: selectedBuildingA,
      location: selectedLocationA,
    });
  }, [selectedLocationA]);

  useEffect(() => {
    setSelectedPointB({
      building: selectedBuildingB,
      location: selectedLocationB,
    });
  }, [selectedLocationB]);

  const resetDrawing = () => {
    const pathLineLayer = map.layers.getLayerById("path-route");
    const pathSymbolLayer = map.layers.getLayerById("path-symbols");
    if (pathLineLayer) {
      map.layers.remove(pathLineLayer);
    }
    if (pathSymbolLayer) {
      map.layers.remove(pathSymbolLayer);
    }
  };

  const resetSelection = () => {
    setSelectedLocationA("None");
    setSelectedLocationB("None");
    setSelectedBuildingA("None");
    setSelectedBuildingB("None");
    setSelectedPointA({});
    setSelectedPointB({});
  };

  const generatePath = () => {
    if (
      selectedBuildingA === "None" ||
      selectedBuildingB === "None" ||
      selectedLocationA === "None" ||
      selectedLocationB === "None"
    ) {
      resetDrawing();
      setAllPaths([]);
      return toast.error("Please select start and end points.");
    }
    if (
      selectedBuildingB === selectedLocationA ||
      selectedBuildingA === selectedLocationB ||
      selectedLocationA === selectedLocationB
    ) {
      resetDrawing();
      setAllPaths([]);
      return toast.error("Please select different start and end points.");
    }

    const testFullPath = getFullPath(
      fullTreeMap,
      selectedBuildingA,
      selectedLocationA,
      selectedBuildingB,
      selectedLocationB
    );
    setAllPaths(testFullPath);
    toast.success("Path generated!");
  };

  //path layers
  useEffect(() => {
    setIsLoading(true);
    console.log("Current TreeMap: ", currentTreeMap);
    mockFetchTreeMap(currentTreeMap).then((response) => {
      console.log("Changed TreeMap:", response);
      setTreeMap(response);
      setIsLoading(false);
    });
    if (treeMap.length === 0) return;

    if (allPaths.length === 0) return;
    console.log("Path: ", allPaths);

    const currentPath = allPaths.find((path) => path.id === currentTreeMap);
    console.log("Current Path: ", currentPath);
    if (!currentPath) return;

    console.log("Current treeMap: ", treeMap);
    const pointA = treeMap.find((node) => node.id === currentPath.path[0]);
    const pointB = treeMap.find(
      (node) => node.id === currentPath.path[currentPath.path.length - 1]
    );

    const pathCoordinates = currentPath.path.map((id) => {
      const node = treeMap.find((node) => node.id === id);
      return [node.coordinates[0], node.coordinates[1]];
    });

    const pathLineString = new atlas.data.LineString(pathCoordinates);

    const dataSource = new atlas.source.DataSource();
    dataSource.add(pathLineString);
    map.sources.add(dataSource);

    resetDrawing();

    const newLineLayer = new atlas.layer.LineLayer(dataSource, "path-route", {
      strokeColor: "#5CE600",
      strokeWidth: 4,
      minZoom: 15,
    });

    map.layers.add(
      newLineLayer,
      currentTreeMap === 1 ? "location-symbols" : "indoor-symbols"
    );

    const symbolLayer = new atlas.layer.SymbolLayer(
      dataSource,
      "path-symbols",
      {
        iconOptions: {
          image: ["get", "icon"],
          allowOverlap: true,
          ignorePlacement: true,
          size: 1,
        },
        filter: ["==", ["geometry-type"], "Point"],
        minZoom: 15,
      }
    );
    map.layers.add(symbolLayer);

    console.log("Point A: ", pointA);
    console.log("Point B: ", pointB);

    const startPoint = new atlas.data.Feature(
      new atlas.data.Point([pointA?.coordinates[0], pointA?.coordinates[1]]),
      {
        icon: "pin-red",
      }
    );
    const endPoint = new atlas.data.Feature(
      new atlas.data.Point([pointB?.coordinates[0], pointB?.coordinates[1]]),
      {
        icon: "pin-blue",
      }
    );
    dataSource.add([startPoint, endPoint]);
  }, [allPaths, treeMap]);

  return (
    <>
      <Head>
        <title>Home - Azure Indoor Maps</title>
        <meta
          name="description"
          content="Indoor Path Finding using Next.js and Azure Maps API"
        />
        <meta
          name="thumbnail"
          content="https://cdn.discordapp.com/attachments/689832675040559249/1159419624425791509/image.png"
        />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-8 ${inter.className}`}
      >
        <div className="min-w-full flex flex-col gap-4">
          <div className="flex flex-row">
            <div className="flex flex-col w-4/12 px-6 py-8 h-screen overflow-y-auto">
              {isMenuOpen ? (
                <SymbolProperties
                  setIsMenuOpen={setIsMenuOpen}
                  selectedSymbol={selectedSymbol}
                  setSelectedSymbol={setSelectedSymbol}
                  isPanoOpen={isPanoOpen}
                  setIsPanoOpen={setIsPanoOpen}
                />
              ) : (
                <>
                  <Tabs defaultValue="pathfinder" className="px-2">
                    <TabsList className="w-full grid grid-cols-2">
                      <TabsTrigger value="pathfinder" className="">
                        Pathfinder
                      </TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent value="pathfinder">
                      <div className="flex flex-col mt-8 gap-8">
                        <div className="flex flex-col gap-6">
                          <div className="font-bold text-xl px-2">
                            HKUST Path Advisor Demo
                          </div>
                          <div className="font-bold text-base px-2">
                            Current View:{" "}
                            <span className="font-medium">
                              {fullTreeMap[currentTreeMap - 1]
                                ? fullTreeMap[currentTreeMap - 1].name
                                : "Loading..."}
                            </span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <h1 className="flex flex-row items-center justify-between ml-2 mr-4 font-semibold text-base">
                              <div className="flex flex-row items-center">
                                <MapPin
                                  className="pr-1 text-red-600"
                                  size={24}
                                />
                                <div className="pr-2">Start Point:</div>
                              </div>
                            </h1>
                            <div className="mx-4 flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Location
                              </label>
                              <Combobox
                                className="w-auto bg-white text-black hover:bg-netural-300 hover:text-black"
                                treeMap={fullTreeMap}
                                value={selectedBuildingA}
                                setValue={setSelectedBuildingA}
                                isLoading={isLoading}
                              />
                            </div>
                            <div className="mx-4 flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Room/Building
                              </label>
                              <Combobox
                                className="w-auto bg-white text-black hover:bg-netural-300 hover:text-black"
                                disabled={selectedBuildingA === "None"}
                                treeMap={locationsA}
                                value={selectedLocationA}
                                setValue={setSelectedLocationA}
                                isLoading={isLoading}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <h1 className="flex flex-row items-center justify-between ml-2 mr-4 font-semibold text-base">
                              <div className="flex flex-row items-center">
                                <MapPin
                                  className="pr-1 text-blue-600"
                                  size={24}
                                />
                                <div className="pr-2">End Point:</div>
                              </div>
                            </h1>
                            <div className="mx-4 flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Location
                              </label>
                              <Combobox
                                className="w-auto  bg-white text-black hover:bg-netural-300 hover:text-black"
                                treeMap={fullTreeMap}
                                value={selectedBuildingB}
                                setValue={setSelectedBuildingB}
                                isLoading={isLoading}
                              />
                            </div>
                            <div className="mx-4 flex flex-col gap-2">
                              <label className="text-sm font-medium">
                                Room/Building
                              </label>
                              <Combobox
                                className="w-auto bg-white text-black hover:bg-netural-300 hover:text-black"
                                disabled={selectedBuildingB === "None"}
                                treeMap={locationsB}
                                value={selectedLocationB}
                                setValue={setSelectedLocationB}
                                isLoading={isLoading}
                              />
                            </div>
                          </div>
                          {allPaths.length > 0 && (
                            <div className="flex flex-col gap-3 text-sm">
                              <h1 className="ml-2 mr-4 flex flex-row text-base font-semibold mt-2 items-center">
                                <Info className="pr-1 text-white" size={24} />
                                <div className="pr-2">Paths:</div>
                              </h1>
                              {allPaths.map((path: any, index: number) => {
                                return (
                                  <button
                                    key={"path " + index}
                                    className="flex flex-col gap-1 mx-4"
                                    onClick={() => {
                                      if (path.id === currentTreeMap) return;
                                      if (path.id === 1) {
                                        map.setCamera({
                                          center: [
                                            114.27068710327148,
                                            22.333478832257015,
                                          ],
                                          zoom: 16,
                                        });
                                        setCurrentTreeMap(1);
                                        setTreeMap([]);
                                        let southwest = new atlas.data.Position(
                                          114.25533413886734,
                                          22.32392661393618
                                        );
                                        let northeast = new atlas.data.Position(
                                          114.28604006767,
                                          22.343040319755985
                                        );

                                        let boundingBox =
                                          new atlas.data.BoundingBox(
                                            southwest,
                                            northeast
                                          );
                                        map.setCamera({
                                          maxBounds: boundingBox,
                                        });
                                      } else {
                                        const indoorMapLayer =
                                          map.layers.getLayerById("indoor-map");
                                        if (indoorMapLayer)
                                          map.layers.remove(indoorMapLayer);

                                        const imageWidth = 4992;
                                        const imageHeight = 3532;

                                        const pixelSize = 0.0000075;

                                        const imageTopLeft = [
                                          (-imageWidth / 2) * pixelSize,
                                          (imageHeight / 2) * pixelSize,
                                        ];
                                        const imageTopRight = [
                                          (imageWidth / 2) * pixelSize,
                                          (imageHeight / 2) * pixelSize,
                                        ];
                                        const imageBottomRight = [
                                          (imageWidth / 2) * pixelSize,
                                          (-imageHeight / 2) * pixelSize,
                                        ];
                                        const imageBottomLeft = [
                                          (-imageWidth / 2) * pixelSize,
                                          (-imageHeight / 2) * pixelSize,
                                        ];

                                        map.layers.add(
                                          new atlas.layer.ImageLayer(
                                            {
                                              url: buildings.find(
                                                (building) =>
                                                  building.treeMapId === path.id
                                              )?.imageUrl,
                                              coordinates: [
                                                imageTopLeft,
                                                imageTopRight,
                                                imageBottomRight,
                                                imageBottomLeft,
                                              ],
                                            },
                                            "indoor-map"
                                          )
                                        );

                                        map.setCamera({
                                          center: buildings.find(
                                            (building) =>
                                              building.treeMapId === path.id
                                          )?.imageCenter,
                                          zoom: 15,
                                        });

                                        const southwest =
                                          new atlas.data.Position(
                                            imageBottomLeft[0],
                                            imageBottomLeft[1]
                                          );
                                        const northeast =
                                          new atlas.data.Position(
                                            imageTopRight[0],
                                            imageTopRight[1]
                                          );
                                        map.setCamera({
                                          maxBounds: new atlas.data.BoundingBox(
                                            southwest,
                                            northeast
                                          ),
                                        });
                                        setCurrentTreeMap(
                                          buildings.find(
                                            (building) =>
                                              building.treeMapId === path.id
                                          )?.treeMapId
                                        );
                                        setTreeMap([]);
                                      }
                                    }}
                                  >
                                    <div className="font-semibold">
                                      {
                                        fullTreeMap.find(
                                          (node) => node.id === path.id
                                        )?.name
                                      }
                                      :
                                    </div>
                                    <div className="text-left">
                                      From{" "}
                                      <span className="underline">
                                        {
                                          fullTreeMap
                                            .find((node) => node.id === path.id)
                                            ?.nodes.find(
                                              (point) =>
                                                point.id === path.path[0]
                                            )?.name
                                        }
                                      </span>{" "}
                                      to{" "}
                                      <span className="underline">
                                        {
                                          fullTreeMap
                                            .find((node) => node.id === path.id)
                                            ?.nodes.find(
                                              (point) =>
                                                point.id ===
                                                path.path[path.path.length - 1]
                                            )?.name
                                        }
                                      </span>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <Button
                            variant={"secondary"}
                            className="mx-4 bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              generatePath();
                            }}
                          >
                            Show Path
                          </Button>
                          <Button
                            variant={"secondary"}
                            className="mx-4"
                            onClick={() => {
                              resetSelection();
                              resetDrawing();
                              setAllPaths([]);
                            }}
                          >
                            Reset
                          </Button>
                          <Button
                            className="mx-4"
                            onClick={() => {
                              map.setCamera({
                                center: [
                                  114.27068710327148, 22.333478832257015,
                                ],
                                zoom: 16,
                              });
                              setCurrentTreeMap(1);
                              setTreeMap([]);
                              setIsPanoOpen(false);
                              let southwest = new atlas.data.Position(
                                114.25533413886734,
                                22.32392661393618
                              );
                              let northeast = new atlas.data.Position(
                                114.28604006767,
                                22.343040319755985
                              );

                              let boundingBox = new atlas.data.BoundingBox(
                                southwest,
                                northeast
                              );
                              map.setCamera({
                                maxBounds: boundingBox,
                              });
                            }}
                          >
                            Go to HKUST
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="settings">
                      <div className="flex flex-col gap-8 mt-8">
                        <div className="flex flex-col gap-6">
                          <div className="font-bold text-xl px-2">
                            HKUST Path Advisor Settings
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              )}
            </div>
            <div className="flex flex-col w-full h-screen">
              <div id="map" className="w-full bg-neutral-800 h-screen"></div>
              {isPanoOpen && (
                <ReactPhotoSphereViewer
                  src={
                    "https://pathadvisor.ust.hk/api/pano/images/5daac91c9ce12a5d92f51405"
                  }
                  container={""}
                  littlePlanet={false}
                  height={"100vh"}
                  width={"100%"}
                  defaultZoomLvl={70}
                  panoData={(image: HTMLImageElement) => ({
                    fullWidth: image.width,
                    fullHeight: image.width / 2,
                    croppedWidth: image.width,
                    croppedHeight: image.height,
                    croppedX: 0,
                    croppedY: 1045,
                  })}
                  moveInertia={false}
                  navbar={["fullscreen"]}
                ></ReactPhotoSphereViewer>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
