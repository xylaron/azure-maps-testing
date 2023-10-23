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
  treeMap: any[];
  value: string;
  setValue: (value: string) => void;
  isLoading: boolean;
  className?: string;
}

export function Combobox({
  treeMap,
  value,
  setValue,
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
          {value !== "None" ? value : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty className="p-2 text-sm text-center">
            Location not found.
          </CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-40 pr-4">
              {isLoading ? (
                <CommandItem disabled className="text-neutral-400">
                  Loading...
                </CommandItem>
              ) : (
                treeMap.map((node) => {
                  if (node.type == "road") return;
                  if (node.type == "exit") return;
                  return (
                    <CommandItem
                      key={node.id}
                      onSelect={(currentValue) => {
                        console.log(node.type);
                        setValue(
                          currentValue === value
                            ? "None"
                            : currentValue
                                .split(" ")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() +
                                    word.slice(1).toLowerCase()
                                )
                                .join(" ")
                        );
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === node.name ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {node.name}
                    </CommandItem>
                  );
                })
              )}
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
