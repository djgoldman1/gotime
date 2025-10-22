import { type User, type UpsertUser, type UserPreference, type InsertUserPreference } from "@shared/schema";
import { users, userPreferences } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  
  getUserPreferences(userId: string): Promise<UserPreference[]>;
  getUserPreferencesByType(userId: string, type: string): Promise<UserPreference[]>;
  addUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
  removeUserPreference(userId: string, itemId: string): Promise<void>;
  clearUserPreferencesByType(userId: string, type: string): Promise<void>;
}

export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const result = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result[0];
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getUserPreferences(userId: string): Promise<UserPreference[]> {
    return await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
  }

  async getUserPreferencesByType(userId: string, type: string): Promise<UserPreference[]> {
    return await db.select()
      .from(userPreferences)
      .where(and(eq(userPreferences.userId, userId), eq(userPreferences.type, type)));
  }

  async addUserPreference(preference: InsertUserPreference): Promise<UserPreference> {
    const result = await db.insert(userPreferences).values(preference).returning();
    return result[0];
  }

  async removeUserPreference(userId: string, itemId: string): Promise<void> {
    await db.delete(userPreferences)
      .where(and(eq(userPreferences.userId, userId), eq(userPreferences.itemId, itemId)));
  }

  async clearUserPreferencesByType(userId: string, type: string): Promise<void> {
    await db.delete(userPreferences)
      .where(and(eq(userPreferences.userId, userId), eq(userPreferences.type, type)));
  }
}

export const storage = new DbStorage();
