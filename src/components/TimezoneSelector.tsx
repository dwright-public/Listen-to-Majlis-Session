import React, { useState, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";

interface TimezoneOption {
  value: string;
  label: string;
  offset: string;
}

interface TimezoneSelectorProps {
  selectedTimezone?: string;
  onTimezoneChange?: (timezone: string) => void;
}

const TimezoneSelector = ({
  selectedTimezone: propSelectedTimezone,
  onTimezoneChange = () => {},
}: TimezoneSelectorProps) => {
  // Generate list of common timezones
  const timezones: TimezoneOption[] = [
    { value: "America/New_York", label: "New York", offset: "UTC-04:00" },
    { value: "America/Chicago", label: "Chicago", offset: "UTC-05:00" },
    { value: "America/Denver", label: "Denver", offset: "UTC-06:00" },
    { value: "America/Los_Angeles", label: "Los Angeles", offset: "UTC-07:00" },
    { value: "Europe/London", label: "London", offset: "UTC+01:00" },
    { value: "Europe/Paris", label: "Paris", offset: "UTC+02:00" },
    { value: "Asia/Tokyo", label: "Tokyo", offset: "UTC+09:00" },
    { value: "Australia/Sydney", label: "Sydney", offset: "UTC+10:00" },
    { value: "Pacific/Auckland", label: "Auckland", offset: "UTC+12:00" },
  ];

  // Detect user's timezone
  const getUserTimezone = (): string => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return "America/New_York"; // Default fallback
    }
  };

  const [selectedTimezone, setSelectedTimezone] = useState<string>(
    propSelectedTimezone || getUserTimezone(),
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (propSelectedTimezone && propSelectedTimezone !== selectedTimezone) {
      setSelectedTimezone(propSelectedTimezone);
    }
  }, [propSelectedTimezone]);

  const handleSelect = (timezone: string) => {
    setSelectedTimezone(timezone);
    onTimezoneChange(timezone);
    setOpen(false);
  };

  const selectedOption = timezones.find(
    (tz) => tz.value === selectedTimezone,
  ) || {
    value: selectedTimezone,
    label:
      selectedTimezone.split("/").pop()?.replace("_", " ") || selectedTimezone,
    offset: "",
  };

  return (
    <div className="w-full max-w-xs bg-white p-4 rounded-lg shadow-sm">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Timezone
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-white border border-gray-300 hover:bg-gray-50"
          >
            <span className="truncate">
              {selectedOption.label}{" "}
              {selectedOption.offset && `(${selectedOption.offset})`}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search timezone..." className="h-9" />
            <CommandList>
              <CommandEmpty>No timezone found.</CommandEmpty>
              <CommandGroup>
                {timezones.map((timezone) => (
                  <CommandItem
                    key={timezone.value}
                    value={timezone.value}
                    onSelect={() => handleSelect(timezone.value)}
                    className="flex items-center justify-between"
                  >
                    <span>{timezone.label}</span>
                    <div className="flex items-center">
                      <span className="text-xs text-gray-500 mr-2">
                        {timezone.offset}
                      </span>
                      {selectedTimezone === timezone.value && (
                        <Check className="h-4 w-4" />
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TimezoneSelector;
