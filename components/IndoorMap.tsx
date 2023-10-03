//@ts-nocheck
/*
 Current atlas libraries from npm does not support indoor maps and routing, therefore we have to import the libraries from CDN of Azure Maps as a workaround using script tag
 However, this will cause typescript to throw errors as it cannot find the types for the libraries, hence we have to use //@ts-nocheck to ignore the errors
*/
import "azure-maps-control/dist/atlas.min.css";
import "azure-maps-indoor/dist/atlas-indoor.min.css";
import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [pointA, setPointA] = useState({
    name: "None",
    lat: 0,
    long: 0,
  });
  const [selectingPointA, setSelectingPointA] = useState<boolean>(false);
  const selectingPointARef = useRef(selectingPointA);

  const [pointB, setPointB] = useState({
    name: "None",
    lat: 0,
    long: 0,
  });
  const [selectingPointB, setSelectingPointB] = useState<boolean>(false);
  const selectingPointBRef = useRef(selectingPointB);

  useEffect(() => {
    const mapConfig = "3e22b555-b7ec-011f-9085-d15560fea8ea";
    const region = "us";
    atlas.setDomain(`${region}.atlas.microsoft.com`);

    const map = new atlas.Map("map", {
      center: [-122.13315, 47.635575],
      zoom: 19.2,
      mapConfiguration: mapConfig,
      styleAPIVersion: "2023-03-01-preview",
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
      },
    });
    setMap(map);

    map.events.add("click", async (e: any) => {
      const position: [number, number] = [e.position![1], e.position![0]];
      console.log("clicked on map", position);
    });
    map.events.add("ready", () => {
      map.controls.add(
        [
          new atlas.control.ZoomControl(),
          new atlas.control.PitchControl(),
          new atlas.control.CompassControl(),
          new atlas.control.StyleControl({
            mapStyles: "all",
          }),
        ],
        {
          position: "top-right",
        }
      );

      const indoorManager = new atlas.indoor.IndoorManager(map, {
        levelControl: new atlas.control.LevelControl({ position: "top-right" }),
      });

      map.events.add("levelchanged", indoorManager, (e: any) => {
        console.log("The level has changed:", e);
        const lineLayer = map.layers.getLayerById("path-route");
        const symbolLayer = map.layers.getLayerById("path-symbols");
        if (lineLayer) {
          map.layers.remove(lineLayer);
        }
        if (symbolLayer) {
          map.layers.remove(symbolLayer);
        }
        setPointA({
          name: "None",
          lat: 0,
          long: 0,
        });
        setPointB({
          name: "None",
          lat: 0,
          long: 0,
        });
        setSelectingPointA(false);
        setSelectingPointB(false);
        selectingPointARef.current = false;
        selectingPointBRef.current = false;
        setCurrentLevel(e.levelNumber - 1);
      });

      map.events.add("facilitychanged", indoorManager, (e: any) => {
        console.log("The facility has changed:", e);
      });

      map.events.add("click", (e: any) => {
        const features = map.layers.getRenderedShapes(e.position);
        const checkArray = (input: any): boolean => {
          if (Array.isArray(input)) {
            return input.every((item: any) => Array.isArray(item));
          }
          return false;
        };
        if (features.length > 0 && features[0].properties) {
          console.log("Feature FULL:", features[0]);
          console.log("Feature properties:", features[0].properties);
          console.log("Location:", features[0].geometry.coordinates);
          if (
            features[0].properties.layerName == "RM$" &&
            !Array.isArray(features[0].geometry.coordinates[0])
          ) {
            const currentSelectingPointA = selectingPointARef.current;
            const currentSelectingPointB = selectingPointBRef.current;
            if (currentSelectingPointA) {
              setPointA({
                name: "Room " + features[0].properties.name,
                lat: checkArray(features[0].geometry.coordinates)
                  ? features[0].geometry.coordinates[0][0][1]
                  : features[0].geometry.coordinates[1],
                long: checkArray(features[0].geometry.coordinates)
                  ? features[0].geometry.coordinates[0][0][0]
                  : features[0].geometry.coordinates[0],
              });
              setSelectingPointA(false);
              selectingPointARef.current = false;
            }
            if (currentSelectingPointB) {
              setPointB({
                name: "Room " + features[0].properties.name,
                lat: checkArray(features[0].geometry.coordinates)
                  ? features[0].geometry.coordinates[0][0][1]
                  : features[0].geometry.coordinates[1],
                long: checkArray(features[0].geometry.coordinates)
                  ? features[0].geometry.coordinates[0][0][0]
                  : features[0].geometry.coordinates[0],
              });
              setSelectingPointB(false);
              selectingPointBRef.current = false;
            }
          }
        }
      });
    });
  }, []);

  const generatePath = async () => {
    const { lat: latA, long: longA } = pointA;
    const { lat: latB, long: longB } = pointB;
    console.log("Point A:", pointA);
    console.log("Point B:", pointB);

    if (pointA.name == "None" || pointB.name == "None") {
      toast.error("Please select both points");
      return;
    }

    const fetch = axios.get("https://us.atlas.microsoft.com/wayfinding/path", {
      params: {
        "api-version": "2023-03-01-preview",
        "subscription-key": process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
        routesetid: "e6c980b0-2e26-a5a2-ff29-958642fb1d11",
        facilityid: "ff4ebf40-ba9a-4783-a489-66bd6fdb7ab7",
        fromPoint: `${latA},${longA}`,
        fromLevel: currentLevel,
        toPoint: `${latB},${longB}`,
        toLevel: currentLevel,
        minWidth: "0.8",
      },
    });

    const response = await toast
      .promise(fetch, {
        loading: "Generating path...",
        success: "Path generated",
        error: "Error generating path",
      })
      .then((res) => {
        console.log("Path Response:", res);
        return res;
      })
      .catch((err) => {
        console.log("Path Error:", err);
      });

    if (!response) {
      return;
    }

    const pathCoordinates = response.data.paths[0].legs[0].points.map(
      (point) => [point.longitude, point.latitude]
    );
    const pathLineString = new atlas.data.LineString(pathCoordinates);

    const dataSource = new atlas.source.DataSource();
    dataSource.add(pathLineString);
    map.sources.add(dataSource);

    const lineLayer = new atlas.layer.LineLayer(dataSource, "path-route", {
      strokeColor: "#5CE600",
      strokeWidth: 4,
      minZoom: 15,
    });
    map.layers.add(lineLayer);

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

    const startPoint = new atlas.data.Feature(
      new atlas.data.Point([longA, latA]),
      {
        icon: "marker-red",
      }
    );
    const endPoint = new atlas.data.Feature(
      new atlas.data.Point([longB, latB]),
      {
        icon: "marker-blue",
      }
    );
    dataSource.add([startPoint, endPoint]);
  };

  const resetPath = () => {
    const lineLayer = map.layers.getLayerById("path-route");
    const symbolLayer = map.layers.getLayerById("path-symbols");
    if (lineLayer) {
      map.layers.remove(lineLayer);
    }
    if (symbolLayer) {
      map.layers.remove(symbolLayer);
    }
  };

  const resetSelection = () => {
    setPointA({
      name: "None",
      lat: 0,
      long: 0,
    });
    setPointB({
      name: "None",
      lat: 0,
      long: 0,
    });
    setSelectingPointA(false);
    setSelectingPointB(false);
    selectingPointARef.current = false;
    selectingPointBRef.current = false;
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col justify-between w-3/12 px-8 py-12">
        <div className="flex flex-col gap-8">
          <div className="font-bold text-2xl">Azure Maps Demo</div>
          <div className="font-bold text-lg">
            Current Floor:{" "}
            <span className="font-medium">{currentLevel + 1}</span>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="flex flex-row items-center font-bold text-lg">
              <MapPin className="pr-1 text-red-600" size={36} />
              <div className="pr-2">Start Point:</div>
              <span className="font-medium">
                {selectingPointA ? "Selecting..." : pointA.name}
              </span>
            </h1>
            <Button
              className="mx-4"
              onClick={() => {
                if (selectingPointB) {
                  setSelectingPointB(false);
                  selectingPointBRef.current = false;
                }
                if (selectingPointA) {
                  setSelectingPointA(false);
                  selectingPointBRef.current = false;
                } else {
                  setSelectingPointA(true);
                  selectingPointARef.current = true;
                }
              }}
            >
              {selectingPointA ? "Cancel" : "Select"}
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="flex flex-row items-center font-bold text-lg">
              <MapPin className="pr-1 text-blue-600" size={36} />
              <div className="pr-2">End Point:</div>
              <span className="font-medium">
                {selectingPointB ? "Selecting..." : pointB.name}
              </span>
            </h1>
            <Button
              className="mx-4"
              variant={"default"}
              onClick={() => {
                if (selectingPointA) {
                  setSelectingPointA(false);
                  selectingPointARef.current = false;
                }
                if (selectingPointB) {
                  setSelectingPointB(false);
                  selectingPointBRef.current = false;
                } else {
                  setSelectingPointB(true);
                  selectingPointBRef.current = true;
                }
              }}
            >
              {selectingPointB ? "Cancel" : "Select"}
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            variant={"secondary"}
            className="bg-green-600 mx-4 hover:bg-green-800"
            onClick={() => generatePath()}
          >
            Find Path
          </Button>
          <Button
            variant={"secondary"}
            className="mx-4"
            onClick={() => {
              resetSelection();
              resetPath();
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <div id="map" className="w-full min-h-screen"></div>
    </div>
  );
};

export default MapComponent;
