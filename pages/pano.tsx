import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const ReactPhotoSphereViewer = dynamic(
  () =>
    import("react-photo-sphere-viewer").then(
      (mod) => mod.ReactPhotoSphereViewer
    ),
  {
    ssr: false,
  }
);

const Panorama: NextPage = () => {
  const router = useRouter();

  return (
    <main
      className={`min-h-screen flex items-center justify-center flex-col gap-16 ${inter.className}`}
    >
      <div className="min-w-full flex flex-row">
        <div className="flex flex-col justify-between w-4/12 px-6 py-8">
          <h1 className="text-xl font-bold px-2">Parnorama View</h1>
          <Button
            className="mx-4"
            onClick={() => {
              router.push("/");
            }}
          >
            Go to HKUST
          </Button>
        </div>
        <ReactPhotoSphereViewer
          src={
            "https://pathadvisor.ust.hk/api/pano/images/5daac91c9ce12a5d92f51405"
          }
          container={""}
          littlePlanet={false}
          height={"100vh"}
          width={"100%"}
          defaultZoomLvl={70}
          panoData={(image: any) => ({
            fullWidth: image.width,
            fullHeight: image.width / 2,
            croppedWidth: image.width,
            croppedHeight: image.height,
            croppedX: 0,
            croppedY: 1045,
          })}
          navbar={["fullscreen"]}
        ></ReactPhotoSphereViewer>
      </div>
    </main>
  );
};

export default dynamic(() => Promise.resolve(Panorama), {
  ssr: false,
});
