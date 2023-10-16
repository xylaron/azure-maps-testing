import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Calculator: NextPage = () => {
  const [pointA, setPointA] = useState<string>("");
  const [pointB, setPointB] = useState<string>("");
  const [distance, setDistance] = useState<number>(0);

  const calDistance = () => {
    const formattedPointA = pointA.slice(1, -1);
    const formattedPointB = pointB.slice(1, -1);
    const x1 = parseFloat(formattedPointA.split(", ")[0]);
    const y1 = parseFloat(formattedPointA.split(", ")[1]);
    const x2 = parseFloat(formattedPointB.split(", ")[0]);
    const y2 = parseFloat(formattedPointB.split(", ")[1]);

    //find distance from lat and long using haversine formula in meters
    const R = 6371e3;
    const φ1 = (x1 * Math.PI) / 180;
    const φ2 = (x2 * Math.PI) / 180;
    const Δφ = ((x2 - x1) * Math.PI) / 180;
    const Δλ = ((y2 - y1) * Math.PI) / 180;
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c;

    setDistance(distance);
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center flex-col gap-16 ${inter.className}`}
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-xl font-bold">distance: {distance},</h1>
        <h1 className="text-xl font-bold">pointA: {pointA}</h1>
        <h1 className="text-xl font-bold">pointB: {pointB}</h1>
      </div>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex flex-row gap-4 items-center">
          A
          <Input onChange={(e) => setPointA(e.target.value)} />
        </div>
        <div className="flex flex-row gap-4 items-center">
          B
          <Input onChange={(e) => setPointB(e.target.value)} />
        </div>
        <Button onClick={() => calDistance()}>Calculate</Button>
      </div>
    </main>
  );
};

export default Calculator;
