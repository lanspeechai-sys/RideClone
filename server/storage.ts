import { users, type User, type UpsertUser } from "@shared/schema";
import bcrypt from 'bcryptjs';

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: UpsertUser & { password: string }): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private demoUsers: User[] = [
    {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890',
      profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      dateOfBirth: null,
      // Pre-hashed password for 'demo123'
      preferences: { hashedPassword: '$2b$10$n3W5gLgbBAFtgK4bKlZdr.2yeR.izzR7PEo3dMbMFvJk9w2g6gJGK' },
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'demo-user-2', 
      username: 'john.doe',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1987654321',
      profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      dateOfBirth: null,
      // Pre-hashed password for 'demo123'
      preferences: { hashedPassword: '$2b$10$n3W5gLgbBAFtgK4bKlZdr.2yeR.izzR7PEo3dMbMFvJk9w2g6gJGK' },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  ] as User[];

  async getUser(id: string): Promise<User | undefined> {
    return this.demoUsers.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.demoUsers.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.demoUsers.find(user => user.email === email);
  }

  async createUser(userData: UpsertUser & { password: string }): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser: User = {
      id: `user-${Date.now()}`,
      username: userData.username!,
      email: userData.email!,
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      phone: userData.phone || null,
      profileImageUrl: userData.profileImageUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      dateOfBirth: userData.dateOfBirth || null,
      preferences: { hashedPassword },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.demoUsers.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const userIndex = this.demoUsers.findIndex(user => user.id === id);
    if (userIndex === -1) throw new Error('User not found');
    
    this.demoUsers[userIndex] = {
      ...this.demoUsers[userIndex],
      ...userData,
      updatedAt: new Date(),
    };
    return this.demoUsers[userIndex];
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    const preferences = user.preferences as any;
    if (!preferences?.hashedPassword) return false;
    return bcrypt.compare(password, preferences.hashedPassword);
  }
}

export const storage = new MemStorage();