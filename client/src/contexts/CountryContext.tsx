import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Country {
  code: string;
  name: string;
  currency: string;
  currencySymbol: string;
  language: string;
  flag: string;
  services: ("uber" | "bolt" | "yango")[];
  priceMultiplier: number; // Base price multiplier for the region
}

export const COUNTRIES: Country[] = [
  {
    code: "US",
    name: "United States",
    currency: "USD",
    currencySymbol: "$",
    language: "en",
    flag: "🇺🇸",
    services: ["uber", "bolt"],
    priceMultiplier: 1.0
  },
  {
    code: "GB",
    name: "United Kingdom", 
    currency: "GBP",
    currencySymbol: "£",
    language: "en",
    flag: "🇬🇧",
    services: ["uber", "bolt"],
    priceMultiplier: 0.8
  },
  {
    code: "DE",
    name: "Germany",
    currency: "EUR",
    currencySymbol: "€",
    language: "en", // Could be "de" for German
    flag: "🇩🇪",
    services: ["uber", "bolt"],
    priceMultiplier: 0.9
  },
  {
    code: "FR",
    name: "France",
    currency: "EUR",
    currencySymbol: "€",
    language: "en", // Could be "fr" for French
    flag: "🇫🇷",
    services: ["uber", "bolt"],
    priceMultiplier: 0.95
  },
  {
    code: "CA",
    name: "Canada",
    currency: "CAD",
    currencySymbol: "C$",
    language: "en",
    flag: "🇨🇦",
    services: ["uber", "bolt"],
    priceMultiplier: 0.75
  },
  {
    code: "AU",
    name: "Australia",
    currency: "AUD",
    currencySymbol: "A$",
    language: "en",
    flag: "🇦🇺",
    services: ["uber", "bolt"],
    priceMultiplier: 0.7
  },
  {
    code: "IN",
    name: "India",
    currency: "INR",
    currencySymbol: "₹",
    language: "en",
    flag: "🇮🇳",
    services: ["uber", "bolt", "yango"],
    priceMultiplier: 0.25
  },
  {
    code: "BR",
    name: "Brazil",
    currency: "BRL",
    currencySymbol: "R$",
    language: "en", // Could be "pt" for Portuguese
    flag: "🇧🇷",
    services: ["uber", "bolt"],
    priceMultiplier: 0.35
  },
  {
    code: "RU",
    name: "Russia",
    currency: "RUB",
    currencySymbol: "₽",
    language: "en", // Could be "ru" for Russian
    flag: "🇷🇺",
    services: ["yango", "bolt"],
    priceMultiplier: 0.4
  },
  {
    code: "ZA",
    name: "South Africa",
    currency: "ZAR",
    currencySymbol: "R",
    language: "en",
    flag: "🇿🇦",
    services: ["uber", "bolt"],
    priceMultiplier: 0.3
  }
];

interface CountryContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  formatPrice: (price: number) => string;
  convertPrice: (basePrice: number) => number;
  availableServices: ("uber" | "bolt" | "yango")[];
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const STORAGE_KEY = "ridecompare_selected_country";

export function CountryProvider({ children }: { children: ReactNode }) {
  // Default to United States if no preference saved
  const [selectedCountry, setSelectedCountryState] = useState<Country>(COUNTRIES[0]);

  // Load country preference from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const countryCode = JSON.parse(stored);
        const country = COUNTRIES.find(c => c.code === countryCode);
        if (country) {
          setSelectedCountryState(country);
        }
      }
    } catch (error) {
      console.warn("Failed to load country preference:", error);
    }
  }, []);

  // Save country preference to localStorage whenever it changes
  const setSelectedCountry = (country: Country) => {
    setSelectedCountryState(country);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(country.code));
    } catch (error) {
      console.warn("Failed to save country preference:", error);
    }
  };

  // Format price with local currency symbol and formatting
  const formatPrice = (price: number): string => {
    const convertedPrice = convertPrice(price);
    return `${selectedCountry.currencySymbol}${convertedPrice.toFixed(2)}`;
  };

  // Convert base USD price to local currency (simplified conversion)
  const convertPrice = (basePrice: number): number => {
    return basePrice * selectedCountry.priceMultiplier;
  };

  // Get services available in the selected country
  const availableServices = selectedCountry.services;

  return (
    <CountryContext.Provider 
      value={{ 
        selectedCountry,
        setSelectedCountry,
        formatPrice,
        convertPrice,
        availableServices
      }}
    >
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error("useCountry must be used within a CountryProvider");
  }
  return context;
}