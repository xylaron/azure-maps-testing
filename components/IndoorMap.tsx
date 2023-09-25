import { useEffect } from "react";
import * as indoor from "azure-maps-indoor";
import * as atlas from "azure-maps-control";
import { AuthenticationType } from "react-azure-maps";
import "azure-maps-control/dist/atlas.min.css";
import "azure-maps-indoor/dist/atlas-indoor.min.css";

const MapComponent: React.FC = () => {
  useEffect(() => {
    const mapConfig = "3e22b555-b7ec-011f-9085-d15560fea8ea";
    const region = "us";
    atlas.setDomain(`${region}.atlas.microsoft.com`);

    const map = new atlas.Map("map-id", {
      center: [-122.13315, 47.63559],
      authOptions: {
        authType: AuthenticationType.subscriptionKey,
        subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
      },
      zoom: 18.5,
      mapConfiguration: mapConfig,
      styleAPIVersion: "2023-03-01-preview",
    });

    map.events.add("click", async (e) => {
      const position: [number, number] = [e.position![1], e.position![0]];
      console.log("clicked on map", position);
    });

    map.events.add("ready", () => {
      const response = {
        noResultExplanation: "NoExplanation",
        paths: [
          {
            lengthInMeters: 47.4224,
            timeInSeconds: 48,
            legs: [
              {
                mode: "Default",
                lengthInMeters: 47.4224,
                timeInSeconds: 48,
                startLevel: 0,
                endLevel: 0,
                points: [
                  {
                    latitude: 47.6356585,
                    longitude: -122.1333624,
                  },
                  {
                    latitude: 47.635631,
                    longitude: -122.1333113,
                  },
                  {
                    latitude: 47.6356282,
                    longitude: -122.1333062,
                  },
                  {
                    latitude: 47.6356236,
                    longitude: -122.1332976,
                  },
                  {
                    latitude: 47.6356226,
                    longitude: -122.1332958,
                  },
                  {
                    latitude: 47.6356222,
                    longitude: -122.1332947,
                  },
                  {
                    latitude: 47.6356212,
                    longitude: -122.1332899,
                  },
                  {
                    latitude: 47.6356183,
                    longitude: -122.133276,
                  },
                  {
                    latitude: 47.6356166,
                    longitude: -122.1332676,
                  },
                  {
                    latitude: 47.6356163,
                    longitude: -122.1332666,
                  },
                  {
                    latitude: 47.6356162,
                    longitude: -122.1332659,
                  },
                  {
                    latitude: 47.6356142,
                    longitude: -122.1332373,
                  },
                  {
                    latitude: 47.6356115,
                    longitude: -122.1331988,
                  },
                  {
                    latitude: 47.6356123,
                    longitude: -122.1331959,
                  },
                  {
                    latitude: 47.6356156,
                    longitude: -122.1331918,
                  },
                  {
                    latitude: 47.6356162,
                    longitude: -122.1331913,
                  },
                  {
                    latitude: 47.635618,
                    longitude: -122.1331901,
                  },
                  {
                    latitude: 47.6356222,
                    longitude: -122.1331874,
                  },
                  {
                    latitude: 47.6356505,
                    longitude: -122.1331693,
                  },
                  {
                    latitude: 47.6356511,
                    longitude: -122.1331689,
                  },
                  {
                    latitude: 47.6356533,
                    longitude: -122.1331675,
                  },
                  {
                    latitude: 47.6356542,
                    longitude: -122.1331669,
                  },
                  {
                    latitude: 47.6356558,
                    longitude: -122.1331668,
                  },
                  {
                    latitude: 47.6356601,
                    longitude: -122.1331688,
                  },
                  {
                    latitude: 47.6356604,
                    longitude: -122.1331689,
                  },
                  {
                    latitude: 47.6356629,
                    longitude: -122.13317,
                  },
                  {
                    latitude: 47.6356651,
                    longitude: -122.1331692,
                  },
                  {
                    latitude: 47.6356767,
                    longitude: -122.1331525,
                  },
                  {
                    latitude: 47.635678,
                    longitude: -122.1331506,
                  },
                  {
                    latitude: 47.6356811,
                    longitude: -122.1331462,
                  },
                  {
                    latitude: 47.63569,
                    longitude: -122.1331333,
                  },
                  {
                    latitude: 47.6356903,
                    longitude: -122.1331329,
                  },
                  {
                    latitude: 47.635698,
                    longitude: -122.1331217,
                  },
                  {
                    latitude: 47.6357014,
                    longitude: -122.1331168,
                  },
                  {
                    latitude: 47.6357462,
                    longitude: -122.1330522,
                  },
                  {
                    latitude: 47.6357598,
                    longitude: -122.1330325,
                  },
                  {
                    latitude: 47.6357613,
                    longitude: -122.1330305,
                  },
                  {
                    latitude: 47.6357782,
                    longitude: -122.133006,
                  },
                  {
                    latitude: 47.6357826,
                    longitude: -122.1329997,
                  },
                  {
                    latitude: 47.6357831,
                    longitude: -122.132999,
                  },
                  {
                    latitude: 47.6358356,
                    longitude: -122.1329232,
                  },
                  {
                    latitude: 47.635839,
                    longitude: -122.1329183,
                  },
                ],
              },
            ],
          },
        ],
      };
      const pathCoordinates = response.paths[0].legs[0].points.map((point) => [
        point.longitude,
        point.latitude,
      ]);
      const pathLineString = new atlas.data.LineString(pathCoordinates);
      const dataSource = new atlas.source.DataSource();
      dataSource.add(pathLineString);
      map.sources.add(dataSource);
      const lineLayer = new atlas.layer.LineLayer(dataSource, undefined, {
        strokeColor: "red",
        strokeWidth: 3,
      });
      map.layers.add(lineLayer);
    });
  }, []);
  return (
    <>
      <div id="map-id" style={{ width: "100%", height: "600px" }}></div>
    </>
  );
};

export default MapComponent;
