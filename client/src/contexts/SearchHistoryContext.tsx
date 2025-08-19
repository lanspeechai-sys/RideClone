import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Location, TripRequest } from "@shared/schema";

interface SearchHistoryEntry {
  id: string;
  pickup: Location;
  dropoff: Location;
  timestamp: Date;
}

interface SearchHistoryContextType {
  history: SearchHistoryEntry[];
  addToHistory: (request: TripRequest) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextType | undefined>(undefined);

const STORAGE_KEY = "ridecompare_search_history";
const MAX_HISTORY_ENTRIES = 10;

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedHistory = JSON.parse(stored).map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        }));
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.warn("Failed to load search history from localStorage:", error);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.warn("Failed to save search history to localStorage:", error);
    }
  }, [history]);

  const addToHistory = (request: TripRequest) => {
    const newEntry: SearchHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      pickup: request.pickup,
      dropoff: request.dropoff,
      timestamp: new Date(),
    };

    setHistory(prev => {
      // Remove duplicate entries (same pickup and dropoff addresses)
      const filtered = prev.filter(entry => 
        !(entry.pickup.address === request.pickup.address && 
          entry.dropoff.address === request.dropoff.address)
      );
      
      // Add new entry at the beginning and limit to MAX_HISTORY_ENTRIES
      return [newEntry, ...filtered].slice(0, MAX_HISTORY_ENTRIES);
    });
  };

  const removeFromHistory = (id: string) => {
    setHistory(prev => prev.filter(entry => entry.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <SearchHistoryContext.Provider 
      value={{ 
        history, 
        addToHistory, 
        removeFromHistory, 
        clearHistory 
      }}
    >
      {children}
    </SearchHistoryContext.Provider>
  );
}

export function useSearchHistory() {
  const context = useContext(SearchHistoryContext);
  if (context === undefined) {
    throw new Error("useSearchHistory must be used within a SearchHistoryProvider");
  }
  return context;
}