import axios from "axios";
import toast from "react-hot-toast";

const getWayfinderPath = async (
  latA: number,
  longA: number,
  latB: number,
  longB: number,
  currentLevel: number
) => {
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

  return response;
};

export default getWayfinderPath;
