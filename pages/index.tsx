import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const DynamicMap = dynamic(() => import("../components/DefaultMap"), {
    ssr: false,
  });
  const DynamicIndoorMap = dynamic(() => import("../components/IndoorMap"), {
    ssr: false,
  });
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 gap-8 ${inter.className}`}
    >
      <h1 className="text-4xl font-bold">Azure Map Testing</h1>
      <div className="min-w-full flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Map with Indoor Map:</h2>
        <DynamicIndoorMap />
      </div>
      <div className="min-w-full flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Default Map:</h2>
        <DynamicMap />
      </div>
    </main>
  );
}
