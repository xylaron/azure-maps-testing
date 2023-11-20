//@ts-nocheck
export const getPanoMarkers = (
  panoRef: any,
  MarkersPlugin: any,
  selectedSymbol: any,
  setSelectedSymbol: any,
  setCurrentPanoUrl: any,
  treeMap: any
) => {
  const markersPlugs = panoRef.getPlugin(MarkersPlugin);
  if (!markersPlugs) return;
  console.log("Marker Plugs: ", markersPlugs);
  markersPlugs.clearMarkers();
  if (selectedSymbol.id === 1) {
    markersPlugs.addMarker({
      id: 6,
      position: {
        yaw: "357.47483852365957deg",
        pitch: "-2.2534132567969127deg",
      },
      image:
        "https://cdn.discordapp.com/attachments/689832675040559249/1176039858117029931/pin-blue.png",
      anchor: "bottom center",
      size: { width: 64, height: 64 },
      tooltip: "G106",
      data: { compass: "blue" },
    });
    markersPlugs.addMarker({
      id: 8,
      position: {
        yaw: "104.1005793087904deg",
        pitch: "-1.2082498481615178deg",
      },
      image:
        "https://cdn.discordapp.com/attachments/689832675040559249/1176039858117029931/pin-blue.png",
      anchor: "bottom center",
      size: { width: 64, height: 64 },
      tooltip: "Starbucks Coffee",
      data: { compass: "blue" },
    });
  }
  if (selectedSymbol.id === 6) {
    markersPlugs.addMarker({
      id: 1,
      position: {
        yaw: "57.61925277747871deg",
        pitch: "-1.3470047925776147deg",
      },
      image:
        "https://cdn.discordapp.com/attachments/689832675040559249/1176039858117029931/pin-blue.png",
      anchor: "bottom center",
      size: { width: 64, height: 64 },
      tooltip: "Exit A",
      data: { compass: "blue" },
    });
  }
  if (selectedSymbol.id === 8) {
    markersPlugs.addMarker({
      id: 1,
      position: {
        yaw: "224.98782274269809deg",
        pitch: "-1.9623514556013808deg",
      },
      image:
        "https://cdn.discordapp.com/attachments/689832675040559249/1176039858117029931/pin-blue.png",
      anchor: "bottom center",
      size: { width: 64, height: 64 },
      tooltip: "Exit A",
      data: { compass: "blue" },
    });
    markersPlugs.addMarker({
      id: 9,
      position: {
        yaw: "39.67253423780906deg",
        pitch: "-6.544768481910557deg",
      },
      image:
        "https://cdn.discordapp.com/attachments/689832675040559249/1176039858117029931/pin-blue.png",
      anchor: "bottom center",
      size: { width: 64, height: 64 },
      tooltip: "Tsang Shiu Tim Art Hall",
      data: { compass: "blue" },
    });
  }
  if (selectedSymbol.id === 9) {
    markersPlugs.addMarker({
      id: 8,
      position: {
        yaw: "220.87520276935894deg",
        pitch: "-2.999880009424887deg",
      },
      image:
        "https://cdn.discordapp.com/attachments/689832675040559249/1176039858117029931/pin-blue.png",
      anchor: "bottom center",
      size: { width: 64, height: 64 },
      tooltip: "Starbucks Coffee",
      data: { compass: "blue" },
    });
  }

  markersPlugs.addEventListener("select-marker", ({ marker }) => {
    console.log(marker);
    setSelectedSymbol({
      id: marker.id,
      icon: "none",
      title: marker.config.tooltip.content,
      pano: treeMap.find((node) => node.id === marker.id)?.pano,
      coordinates: treeMap.find((node) => node.id === marker.id)?.coordinates,
    });
    setCurrentPanoUrl(treeMap.find((node) => node.id === marker.id)?.pano);
  });
};
