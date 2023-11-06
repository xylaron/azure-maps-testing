import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface SymbolPropertiesProps {
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSymbol: any;
  setTreeMap: React.Dispatch<React.SetStateAction<any>>;
  isPanoOpen: boolean;
  setIsPanoOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SymbolProperties: React.FC<SymbolPropertiesProps> = ({
  setIsMenuOpen,
  selectedSymbol,
  isPanoOpen,
  setIsPanoOpen,
}) => {
  const [title, setTitle] = useState(selectedSymbol.title);
  const [icon, setIcon] = useState(selectedSymbol.icon);

  const [isChangingLocation, setIsChangingLocation] = useState(false);

  const updateSymbol = () => {
    console.log("Current Title: ", title);
    console.log("Current Icon: ", icon);
    toast.success("Marker Updated");
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setTitle(selectedSymbol.title);
    setIcon(selectedSymbol.icon);
    setIsChangingLocation(false);
    setIsPanoOpen(false);
  }, [selectedSymbol]);

  return (
    <div className="flex flex-col min-h-full justify-between space-y-8">
      <div className="flex flex-col gap-3">
        <div className="font-bold text-xl px-2">Edit Marker</div>
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label className="text-sm font-medium">Icon</label>
          <Select onValueChange={(value) => setIcon(value)} value={icon}>
            <SelectTrigger>
              <SelectValue placeholder={selectedSymbol.icon} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">none</SelectItem>
              <SelectItem value="marker-black">marker-black</SelectItem>
              <SelectItem value="marker-red">marker-red</SelectItem>
              <SelectItem value="marker-yellow">marker-yellow</SelectItem>
              <SelectItem value="pin-round-blue">pin-round-blue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          className="mt-4"
          variant={isChangingLocation ? "default" : "secondary"}
          onClick={() => {
            setIsChangingLocation(!isChangingLocation);
            if (!isChangingLocation) {
              toast("Click on the Map to choose a new location");
            }
            if (isChangingLocation) {
              toast.success("Location Changed");
            }
          }}
        >
          {isChangingLocation ? "Save" : "Change Marker Location"}
        </Button>
        <Button
          className="mt-4"
          variant={isPanoOpen ? "default" : "secondary"}
          onClick={() => {
            setIsPanoOpen(!isPanoOpen);
          }}
        >
          {isPanoOpen ? "Close Street View" : "Open Street View"}
        </Button>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          variant={"secondary"}
          className="mx-4 bg-green-600 hover:bg-green-700"
          onClick={() => updateSymbol()}
        >
          Save
        </Button>
        <Button
          className="mx-4"
          onClick={() => {
            setIsMenuOpen(false);
            setIsPanoOpen(false);
          }}
        >
          Back
        </Button>
      </div>
    </div>
  );
};

export default SymbolProperties;
