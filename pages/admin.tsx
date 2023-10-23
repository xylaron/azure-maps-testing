//@ts-nocheck
/*
 Current atlas libraries from npm does not support indoor maps and routing, therefore we have to import the libraries from CDN of Azure Maps as a workaround using script tag
 However, this will cause typescript to throw errors as it cannot find the types for the libraries, hence we have to use //@ts-nocheck to ignore the errors
*/

import { NextPage } from "next";
import { Inter } from "next/font/google";
import Head from "next/head";
import "azure-maps-control/dist/atlas.min.css";
import "azure-maps-indoor/dist/atlas-indoor.min.css";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import getWayfinderPath from "@/services/getWayfinderPath";
import { Combobox } from "@/components/ui/combobox";
import { mockFetchBuildings, type Building } from "@/mock/buildings";
import { Node, mockFetchTreeMap } from "@/mock/treemap/treemap";
import { getSinglePath } from "@/services/getSinglePath";

const inter = Inter({ subsets: ["latin"] });

const Admin: NextPage = () => {
  const [map, setMap] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pointA, setPointA] = useState<number>(1);
  const [pointB, setPointB] = useState<number>(1);
  const [locations, setLocations] = useState<Building[]>([]);
  const [treeMap, setTreeMap] = useState<Node[]>([]);
  const [currentTreeMap, setCurrentTreeMap] = useState<number>(1);

  const [mapConfig, setMapConfig] = useState<string>(
    "3e22b555-b7ec-011f-9085-d15560fea8ea"
  );

  useEffect(() => {
    const region = "us";
    atlas.setDomain(`${region}.atlas.microsoft.com`);

    // let southwest = new atlas.data.Position(-122.13407, 47.63515);
    // let northeast = new atlas.data.Position(-122.13221, 47.63601);

    // let boundingBox = new atlas.data.BoundingBox(southwest, northeast);
    const map = new atlas.Map("map", {
      center: [114.27068710327148, 22.333478832257015],
      zoom: 15,
      minZoom: 15,
      // maxBounds: boundingBox,
      mapConfiguration: mapConfig,
      styleAPIVersion: "2023-03-01-preview",
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
      },
    });
    setMap(map);

    map.events.add("ready", () => {
      map.controls.add([new atlas.control.ZoomControl()], {
        position: "top-right",
      });

      setIsLoading(true);
      mockFetchBuildings().then((response) => {
        console.log("Mock Locations:", response);
        setLocations(response);
        setIsLoading(false);
      });

      setIsLoading(true);
      mockFetchTreeMap(1).then((response) => {
        console.log("Mock TreeMap:", response);
        setTreeMap(response);
        setIsLoading(false);
      });

      //map event handlers
      map.events.add("click", (e: any) => {
        console.log("Camera bound ", map.getCamera().bounds);
        console.log("Mouse click position:", e.position);
      });
    });
  }, []);

  // location symbol layers and event handlers
  useEffect(() => {
    if (!map) return;
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
        visible: true,
      }
    );
    for (let i = 0; i < locations.length; i++) {
      const point = new atlas.data.Feature(
        new atlas.data.Point(locations[i].coordinates),
        {
          icon: "marker-red",
          title: locations[i].name,
          imageUrl: locations[i].imageUrl,
          imageCenter: locations[i].imageCenter,
          treeMapId: locations[i].treeMapId,
        }
      );
      locationSymbolDataSource.add(point);
    }
    map.layers.add(locationSymbolLayer);
    map.events.add("click", locationSymbolLayer, (e: any) => {
      const symbol = map.layers.getRenderedShapes(e.position);
      if (!symbol) return;
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
    });

    map.events.add("mouseover", locationSymbolLayer, (e: any) => {
      map.getCanvasContainer().style.cursor = "pointer";
    });

    map.events.add("mouseout", locationSymbolLayer, (e: any) => {
      map.getCanvasContainer().style.cursor = "grab";
    });
  }, [locations]);

  useEffect(() => {
    setIsLoading(true);
    mockFetchTreeMap(currentTreeMap).then((response) => {
      console.log("Mock TreeMap:", response);
      setTreeMap(response);
      setIsLoading(false);
    });
  }, [currentTreeMap]);

  useEffect(() => {
    if (!map) return;
    const treeSymbolDataSource = new atlas.source.DataSource();
    map.sources.add(treeSymbolDataSource);

    const treeMapLayer = map.layers.getLayerById("treemap-symbols");
    if (treeMapLayer) map.layers.remove(treeMapLayer);

    const newTreeMapLayer = new atlas.layer.SymbolLayer(
      treeSymbolDataSource,
      "treemap-symbols",
      {
        iconOptions: {
          image: ["get", "icon"],
          allowOverlap: true,
          ignorePlacement: true,
          offset: [0, 10],
          size: 0.75,
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
        visible: true,
      }
    );
    for (let i = 0; i < treeMap.length; i++) {
      const point = new atlas.data.Feature(
        new atlas.data.Point(treeMap[i].coordinates),
        {
          icon: "pin-round-blue",
          title: treeMap[i].id,
        }
      );
      treeSymbolDataSource.add(point);
    }
    map.layers.add(newTreeMapLayer);
  }, [treeMap, currentTreeMap]);

  const resetDrawing = () => {
    const pathLineLayer = map.layers.getLayerById("path-route");
    if (pathLineLayer) {
      map.layers.remove(pathLineLayer);
    }
  };

  const testPath = () => {
    const path = getSinglePath(treeMap, pointA, pointB);

    const pathCoordinates = path.map((id) => {
      const node = treeMap.find((node) => node.id === id);
      console.log("Node:", node);
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
    map.layers.add(newLineLayer);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-8 ${inter.className}`}
    >
      <div className="min-w-full flex flex-col gap-4">
        <div className="flex flex-row">
          <div className="flex flex-col w-4/12 px-6 py-12 justify-between">
            <div className="flex flex-col gap-8">
              <div className="font-bold text-2xl px-2">Azure Maps Admin</div>
              <Input
                type="number"
                placeholder="PointA"
                onChange={(e) => setPointA(e.target.value)}
              />
              <Input
                type="number"
                placeholder="PointB"
                onChange={(e) => setPointB(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-4">
              <Button
                className="mx-4"
                onClick={() => {
                  map.setCamera({
                    center: [114.27068710327148, 22.333478832257015],
                    zoom: 15,
                  });
                  setCurrentTreeMap(1);
                }}
              >
                Go to HKUST
              </Button>
              <Button className="mx-4" onClick={() => testPath()}>
                Test Path
              </Button>
            </div>
          </div>
          <div id="map" className="w-full min-h-screen bg-neutral-800"></div>
        </div>
      </div>
    </main>
  );
};

export default Admin;
