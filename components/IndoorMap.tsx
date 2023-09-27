//@ts-nocheck: Atlas is loaded via script tag
import "azure-maps-control/dist/atlas.min.css";
import "azure-maps-indoor/dist/atlas-indoor.min.css";
import { useEffect, useRef, useState } from "react";
// import { response } from "@/examples/wayfinder_res";
import { useQuery } from "react-query";
import axios from "axios";

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<any>(null);
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
      center: [-122.13315, 47.63559],
      zoom: 18.5,
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
          if (features[0].properties.layerName == "RM$") {
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

    const response = await axios
      .get("https://us.atlas.microsoft.com/wayfinding/path", {
        params: {
          "api-version": "2023-03-01-preview",
          "subscription-key": process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
          routesetid: "e6c980b0-2e26-a5a2-ff29-958642fb1d11",
          facilityid: "ff4ebf40-ba9a-4783-a489-66bd6fdb7ab7",
          fromPoint: `${latA},${longA}`,
          fromLevel: "0",
          toPoint: `${latB},${longB}`,
          toLevel: "0",
          minWidth: "0.5",
        },
      })
      .catch((err) => {
        console.log("Error:", err);
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

    const lineLayer = new atlas.layer.LineLayer(dataSource, "path", {
      strokeColor: "red",
      strokeWidth: 3,
    });
    map.layers.add(lineLayer);
  };

  const removePath = () => {
    const lineLayer = map.layers.getLayerById("path");
    if (lineLayer) {
      map.layers.remove(lineLayer);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between px-24">
          <h1 className="font-bold text-lg">
            Point A:{" "}
            <span className="font-medium">
              {selectingPointA ? "Selecting..." : pointA.name}
            </span>
          </h1>
          <button
            className="bg-red-600 px-2 py-1 rounded-md font-medium hover:bg-red-700 active:bg-red-800"
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
            {selectingPointA ? "Cancel" : "Select Point A"}
          </button>
        </div>
        <div className="flex flex-row justify-between px-24">
          <h1 className="font-bold text-lg">
            Point B:{" "}
            <span className="font-medium">
              {selectingPointB ? "Selecting..." : pointB.name}
            </span>
          </h1>
          <button
            className="bg-green-600 px-2 py-1 rounded-md font-medium hover:bg-green-700 active:bg-green-800"
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
            {selectingPointB ? "Cancel" : "Select Point B"}
          </button>
        </div>
        <div className="flex flex-row justify-between px-24">
          <button
            className="bg-yellow-600 px-2 py-1 rounded-md font-medium hover:bg-yellow-700 active:bg-yellow-800"
            onClick={() => {
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
              removePath();
            }}
          >
            Reset
          </button>
          <button
            className="bg-blue-600 px-2 py-1 rounded-md font-medium hover:bg-blue-700 active:bg-blue-800"
            onClick={() => generatePath()}
          >
            Find Path
          </button>
        </div>
      </div>
      <div id="map" style={{ width: "100%", height: "800px" }}></div>
    </div>
  );
};

export default MapComponent;
