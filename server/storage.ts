import { type Location, type User, type UpsertUser } from "@shared/schema";
import { users } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations for authentication
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: UpsertUser & { password: string }): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  validatePassword(user: User, password: string): Promise<boolean>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.email, email));
      return user || undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(userData: UpsertUser & { password: string }): Promise<User> {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const { password, ...userWithoutPassword } = userData;
    
    const [user] = await db
      .insert(users)
      .values({
        ...userWithoutPassword,
        preferences: { hashedPassword },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    const bcrypt = require('bcryptjs');
    const preferences = user.preferences as any;
    if (!preferences?.hashedPassword) return false;
    return bcrypt.compare(password, preferences.hashedPassword);
  }
}

// Simple in-memory storage for demo purposes with demo users
export class MemStorage implements IStorage {
  private demoUsers = [
    {
      id: 'demo-user-1',
      username: 'demo',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      phone: '+1234567890',
      profileImageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      dateOfBirth: null,
      preferences: { hashedPassword: '$2a$10$Xk9qP1KmZ7vYlCvOJxQvBOiXOqFGrOHBLfYJVKzAzEJKbfWnJ1KjW' }, // password: 'demo123'
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
      preferences: { hashedPassword: '$2a$10$Xk9qP1KmZ7vYlCvOJxQvBOiXOqFGrOHBLfYJVKzAzEJKbfWnJ1KjW' }, // password: 'demo123'
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
    const bcrypt = require('bcryptjs');
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
    const bcrypt = require('bcryptjs');
    const preferences = user.preferences as any;
    if (!preferences?.hashedPassword) return false;
    return bcrypt.compare(password, preferences.hashedPassword);
  }
}

export const storage = new MemStorage();
