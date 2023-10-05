import axios from "axios";

const getRoomsList = async () => {
  const fetch = axios.get(
    "https://us.atlas.microsoft.com/wfs/datasets/442625b4-b7bc-1266-5056-c26b87153039/collections/room/items",
    {
      params: {
        "subscription-key": process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
        "api-version": "2.0",
        limit: 500,
      },
    }
  );

  const response = await fetch
    .then((res) => {
      console.log("Rooms Response:", res);
      return res;
    })
    .catch((err) => {
      console.log("Rooms Error:", err);
    });

  const getMiddle = (
    prop: "lat" | "long",
    coords: {
      long: number;
      lat: number;
    }[]
  ) => {
    //@ts-ignore
    let values = coords.map((coord) => coord[prop]);
    let min = Math.min(...values);
    let max = Math.max(...values);

    if (prop === "long" && max - min > 180) {
      values = values.map((val) => (val < max - 180 ? val + 360 : val));
      min = Math.min(...values);
      max = Math.max(...values);
    }

    let result = (min + max) / 2;

    if (prop === "long" && result > 180) {
      result -= 360;
    }

    return result;
  };

  const findCenter = (coords: any[]) => {
    return {
      lat: getMiddle("lat", coords),
      long: getMiddle("long", coords),
    };
  };

  //@ts-ignore
  const formattedResponse = response.data.features.map((room) => {
    return {
      name: room.properties.name,
      levelOrdinal: room.properties.levelOrdinal,
      roomType: room.properties.roomType,
      geometryType: room.geometry.type,
      coordinates: findCenter(
        room.geometry.coordinates[0].map((coord: number[]) => ({
          long: coord[0],
          lat: coord[1],
        }))
      ),
    };
  });

  const filteredResponse = formattedResponse.filter(
    (room: any) => room.geometryType === "Polygon"
  );

  const sortedResponse = filteredResponse.sort((a: any, b: any) => {
    const numA = parseInt(a.name, 10);
    const numB = parseInt(b.name, 10);

    if (isNaN(numA) || isNaN(numB)) {
      return a.name.localeCompare(b.name);
    }

    return numA - numB;
  });

  return sortedResponse;
};

export default getRoomsList;
