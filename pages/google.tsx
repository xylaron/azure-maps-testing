import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { useCallback, useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";

const inter = Inter({ subsets: ["latin"] });

const center = {
  lat: 114.27068710327148,
  lng: 22.333478832257015,
};

const Google: NextPage = () => {
  const { isLoaded: isMapLoaded, loadError: loadMapError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    console.log("Map loaded", map);
    setMap(map);
  }, []);

  const onMapUnmount = useCallback((map: google.maps.Map) => {
    setMap(null);
  }, []);

  if (loadMapError) {
    return (
      <main
        className={`min-h-screen flex items-center justify-center flex-col gap-16 ${inter.className}`}
      >
        <div>Map cannot be loaded right now, sorry.</div>
      </main>
    );
  }
  return (
    <main
      className={`min-h-screen flex items-center justify-center flex-col gap-16 ${inter.className}`}
    >
      <div className="min-w-full flex flex-row">
        <div className="flex flex-col justify-between w-4/12 px-6 py-8">
          hello world
        </div>
        {isMapLoaded && (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100vh" }}
            center={center}
            zoom={10}
            onLoad={onMapLoad}
            onUnmount={onMapUnmount}
          ></GoogleMap>
        )}
      </div>
    </main>
  );
};

export default Google;
