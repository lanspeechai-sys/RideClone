import { useState } from "react";
import { Check, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountry, COUNTRIES, type Country } from "@/contexts/CountryContext";
import { cn } from "@/lib/utils";

export function CountrySelector() {
  const [open, setOpen] = useState(false);
  const { selectedCountry, setSelectedCountry } = useCountry();

  const onCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between border-2 hover:border-primary/40 transition-colors"
          data-testid="button-country-selector"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="truncate font-medium">{selectedCountry.name}</span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0 card-modern" data-testid="popover-country-list">
        <Command>
          <CommandInput 
            placeholder="Search countries..." 
            className="h-9"
            data-testid="input-country-search"
          />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((country) => (
                <CommandItem
                  key={country.code}
                  value={`${country.name} ${country.code}`}
                  onSelect={() => onCountrySelect(country)}
                  className="flex items-center justify-between cursor-pointer p-3 hover:bg-accent"
                  data-testid={`item-country-${country.code.toLowerCase()}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{country.name}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{country.currencySymbol} {country.currency}</span>
                        <span>•</span>
                        <span>{country.services.length} service{country.services.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4 text-primary",
                      selectedCountry.code === country.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}