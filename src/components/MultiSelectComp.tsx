"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type Option = {
  label: string;
  value: string;
};

type Props = {
  options: Option[];
  selected: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
};

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const toggleOption = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const removeOption = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  const selectedOptions = options.filter((o) => selected.includes(o.value));

  const MAX_VISIBLE = 3;

  return (
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between rounded-xl min-h-[44px] h-auto px-3 py-2"
        >
          <div className="flex flex-wrap gap-1 items-center">
            {selectedOptions.length > 0 ? (
              <>
                {/* 👇 Visible chips */}
                {selectedOptions.slice(0, MAX_VISIBLE).map((option) => (
                  <span
                    key={option.value}
                    className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {option.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeOption(option.value);
                      }}
                    />
                  </span>
                ))}

                {/* 👇 +X more with hover */}
                {selectedOptions.length > MAX_VISIBLE && (
                  <HoverCard openDelay={100}>
                    <HoverCardTrigger asChild>
                      <span
                        className="text-xs text-muted-foreground px-2 cursor-pointer hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        +{selectedOptions.length - MAX_VISIBLE} more
                      </span>
                    </HoverCardTrigger>

                    <HoverCardContent
                      className="rounded-xl p-2 w-56"
                      align="start"
                    >
                      <div className="flex flex-wrap gap-1">
                        {selectedOptions.slice(MAX_VISIBLE).map((option) => (
                          <span
                            key={option.value}
                            className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs"
                          >
                            {option.label}
                            <X
                              className="h-3 w-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeOption(option.value);
                              }}
                            />
                          </span>
                        ))}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                )}
              </>
            ) : (
              <span className="text-muted-foreground text-sm">
                {placeholder}
              </span>
            )}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0 rounded-xl">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup className="max-h-60 overflow-y-auto">
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleOption(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selected.includes(option.value)
                      ? "opacity-100"
                      : "opacity-0",
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
