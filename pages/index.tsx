import { Inter } from "next/font/google";
import dynamic from "next/dynamic";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const DynamicIndoorMap = dynamic(() => import("../components/IndoorMap"), {
    ssr: false,
  });
  return (
    <>
      <Head>
        <title>Home - Azure Indoor Maps</title>
        <meta
          name="description"
          content="Indoor Path Finding using Next.js and Azure Maps API"
        />
        <meta
          name="thumbnail"
          content="https://cdn.discordapp.com/attachments/689832675040559249/1159419624425791509/image.png"
        />
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-center gap-8 ${inter.className}`}
      >
        {/* <h1 className="text-4xl font-bold">Azure Map Testing</h1> */}
        <div className="min-w-full flex flex-col gap-4">
          {/* <h2 className="text-2xl font-bold">Map with Indoor Map:</h2> */}
          <DynamicIndoorMap />
        </div>
        {/* <div className="min-w-full flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Default Map:</h2>
        <DynamicMap />
      </div> */}
      </main>
    </>
  );
}
