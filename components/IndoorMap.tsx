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
import toast from "react-hot-toast";
import getWayfinderPath from "@/services/getWayfinderPath";
import getRoomsList from "@/services/getRoomsList";
import { Combobox } from "./ui/combobox";

interface Room {
  name: string;
  levelOrdinal: number;
  roomType: string;
  coordinates: number[][];
}

const MapComponent: React.FC = () => {
  const [map, setMap] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [roomsList, setRoomsList] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pointA, setPointA] = useState({
    name: "None",
    lat: null,
    long: null,
  });
  const [selectedPointA, setSelectedPointA] = useState<string>("None");
  const [pointB, setPointB] = useState({
    name: "None",
    lat: null,
    long: null,
  });
  const [selectedPointB, setSelectedPointB] = useState<string>("None");
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
      center: [-122.13315, 47.635575],
      zoom: 19,
      // minZoom: 19.2,
      // maxBounds: boundingBox,
      mapConfiguration: mapConfig,
      styleAPIVersion: "2023-03-01-preview",
      style: "dark",
      authOptions: {
        authType: "subscriptionKey",
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
      },
    });
    setMap(map);

    setIsLoading(true);
    getRoomsList().then((response) => {
      console.log("Rooms List:", response);
      setRoomsList(response);
      setIsLoading(false);
    });

    map.events.add("ready", () => {
      map.setStyle({ style: "dark" });
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
        resetSelection();
        setCurrentLevel(e.levelNumber - 1);
      });

      //debug
      map.events.add("facilitychanged", indoorManager, (e: any) => {
        console.log("The facility has changed:", e);
      });

      //debug
      map.events.add("click", (e: any) => {
        const features = map.layers.getRenderedShapes(e.position);
        console.log("Position:", e.position);
        if (features.length > 0 && features[0].properties) {
          console.log("Feature FULL:", features[0]);
          console.log("Feature properties:", features[0].properties);
          console.log("Feature geometry:", features[0].geometry.coordinates);
        }
      });
    });
  }, []);

  useEffect(() => {
    setPointA({
      name: selectedPointA,
      lat: roomsList.find((room) => room.name == selectedPointA)?.coordinates
        .lat,
      long: roomsList.find((room) => room.name == selectedPointA)?.coordinates
        .long,
    });
  }, [selectedPointA]);

  useEffect(() => {
    setPointB({
      name: selectedPointB,
      lat: roomsList.find((room) => room.name == selectedPointB)?.coordinates
        .lat,
      long: roomsList.find((room) => room.name == selectedPointB)?.coordinates
        .long,
    });
  }, [selectedPointB]);

  useEffect(() => {
    if (map) {
      map.setServiceOptions({
        mapConfiguration: mapConfig,
      });
    }
  }, [mapConfig]);

  const generatePath = async () => {
    const { lat: latA, long: longA } = pointA;
    const { lat: latB, long: longB } = pointB;
    console.log("Point A:", pointA);
    console.log("Point B:", pointB);

    if (mapConfig !== "3e22b555-b7ec-011f-9085-d15560fea8ea") {
      toast.error("This building does not support routing");
      return;
    }

    if (pointA.name == "None" || pointB.name == "None") {
      toast.error("Please select both points");
      return;
    }

    const response = await getWayfinderPath(
      latA,
      longA,
      latB,
      longB,
      currentLevel
    );

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
      lat: null,
      long: null,
    });
    setPointB({
      name: "None",
      lat: null,
      long: null,
    });
    setSelectedPointA("None");
    setSelectedPointB("None");
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-col justify-between w-4/12 px-6 py-12">
        <div className="flex flex-col gap-8">
          <div className="font-bold text-2xl px-2">Azure Maps Demo</div>
          <div className="font-bold text-lg px-2">
            Current Floor:{" "}
            <span className="font-medium">{currentLevel + 1}</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="flex flex-row items-center justify-between ml-2 mr-4 font-semibold text-base">
              <div className="flex flex-row items-center">
                <MapPin className="pr-1 text-red-600" size={24} />
                <div className="pr-2">Start Point:</div>
              </div>
            </h1>
            <Combobox
              className="w-auto mx-4 bg-white text-black hover:bg-netural-300 hover:text-black"
              rooms={roomsList}
              value={selectedPointA}
              setValue={setSelectedPointA}
              currentLevel={currentLevel}
              isLoading={isLoading}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="flex flex-row items-center justify-between ml-2 mr-4 font-semibold text-base">
              <div className="flex flex-row items-center">
                <MapPin className="pr-1 text-blue-600" size={24} />
                <div className="pr-2">End Point:</div>
              </div>
            </h1>
            <Combobox
              className="w-auto mx-4 bg-white text-black hover:bg-netural-300 hover:text-black"
              rooms={roomsList}
              value={selectedPointB}
              setValue={setSelectedPointB}
              currentLevel={currentLevel}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <Button
            variant={"secondary"}
            className="mx-4 bg-green-600 hover:bg-green-700"
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
          <Button
            className="mx-4"
            onClick={() => {
              if (mapConfig == "3e22b555-b7ec-011f-9085-d15560fea8ea") {
                setMapConfig("1cc23c0f-4efb-fd4f-a72c-60012cd21192");
                map.setCamera({
                  center: [-122.13285531565566, 47.63670444275664],
                  zoom: 19,
                });
                map.clear();
              } else {
                setMapConfig("3e22b555-b7ec-011f-9085-d15560fea8ea");
                map.setCamera({
                  center: [-122.13315, 47.635575],
                  zoom: 19,
                });
                map.clear();
              }
            }}
          >
            Change Building
          </Button>
        </div>
      </div>
      <div id="map" className="w-full min-h-screen bg-neutral-800"></div>
    </div>
  );
};

export default MapComponent;
