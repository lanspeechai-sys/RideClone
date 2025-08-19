import { createContext, useContext, useState, ReactNode } from "react";
import type { Location, TripRequest } from "@shared/schema";

interface SearchContextType {
  searchData: TripRequest | null;
  setSearchData: (data: TripRequest | null) => void;
  clearSearchData: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchData, setSearchData] = useState<TripRequest | null>(null);

  const clearSearchData = () => {
    setSearchData(null);
  };

  return (
    <SearchContext.Provider 
      value={{ 
        searchData, 
        setSearchData, 
        clearSearchData 
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchProvider");
  }
  return context;
}