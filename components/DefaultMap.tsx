import {
  AzureMap,
  AzureMapsProvider,
  IAzureMapControls,
  IAzureMapOptions,
} from "react-azure-maps";
import { AuthenticationType, ControlOptions } from "azure-maps-control";
import "azure-maps-control/dist/atlas.min.css";

const DefaultMap: React.FC = () => {
  const option: IAzureMapOptions = {
    center: [-122.13315, 47.63559],
    authOptions: {
      authType: AuthenticationType.subscriptionKey,
      subscriptionKey: process.env.NEXT_PUBLIC_AZURE_MAPS_KEY,
    },
    zoom: 18.5,
  };

  const controls: IAzureMapControls[] = [
    {
      controlName: "StyleControl",
      controlOptions: { mapStyles: "all" },
      options: { position: "top-right" } as ControlOptions,
    },
    {
      controlName: "ZoomControl",
      options: { position: "top-right" } as ControlOptions,
    },
    {
      controlName: "CompassControl",
      controlOptions: { rotationDegreesDelta: 10, style: "dark" },
      options: { position: "bottom-right" } as ControlOptions,
    },
    {
      controlName: "PitchControl",
      controlOptions: { pitchDegreesDelta: 5, style: "dark" },
      options: { position: "bottom-right" } as ControlOptions,
    },
    {
      controlName: "TrafficControl",
      controlOptions: { incidents: true },
      options: { position: "top-left" } as ControlOptions,
    },
    {
      controlName: "TrafficLegendControl",
      controlOptions: {},
      options: { position: "bottom-left" } as ControlOptions,
    },
  ];

  return (
    <AzureMapsProvider>
      <div className="h-[600px] min-w-full">
        <AzureMap options={option} controls={controls} />
      </div>
    </AzureMapsProvider>
  );
};

export default DefaultMap;
