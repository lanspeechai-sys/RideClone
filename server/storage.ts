import { type Location } from "@shared/schema";

export interface IStorage {
  // No persistent storage needed for this app
  // All data comes from APIs and user input
}

export class MemStorage implements IStorage {
  constructor() {
    // No storage needed for ride comparison app
  }
}

export const storage = new MemStorage();
