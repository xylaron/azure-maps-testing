import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ComboboxProps {
  rooms: any[];
  value: string;
  setValue: (value: string) => void;
  currentLevel: number;
  isLoading: boolean;
  className?: string;
}

export function Combobox({
  rooms,
  value,
  setValue,
  currentLevel,
  isLoading,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {value !== "None" ? value : "Select location..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandEmpty className="p-2 text-sm text-center">
            Location not found.
          </CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-80 pr-4">
              {isLoading ? (
                <CommandItem disabled className="text-neutral-400">
                  Loading...
                </CommandItem>
              ) : (
                rooms.map(
                  (room) =>
                    room.levelOrdinal == currentLevel && (
                      <CommandItem
                        key={room.name}
                        onSelect={(currentValue) => {
                          setValue(
                            currentValue === value
                              ? "None"
                              : currentValue.toUpperCase()
                          );
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === room.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {room.name}
                      </CommandItem>
                    )
                )
              )}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
