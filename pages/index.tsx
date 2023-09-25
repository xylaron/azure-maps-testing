import Image from "next/image";
import { Inter } from "next/font/google";
import dynamic from "next/dynamic";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const DynamicMap = dynamic(() => import("../components/Map"), {
    ssr: false,
  });
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center p-24 gap-8 ${inter.className}`}
    >
      <div className="text-4xl font-bold">Azure Map Testing</div>
      <DynamicMap />
    </main>
  );
}
