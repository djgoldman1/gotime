import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserPreferenceSchema } from "@shared/schema";
import { ticketmasterAPI } from "./ticketmaster";

export async function registerRoutes(app: Express): Promise<Server> {
  
  app.get("/api/user/:userId", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/user/:userId/preferences", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(req.params.userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.get("/api/user/:userId/preferences/:type", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferencesByType(
        req.params.userId,
        req.params.type
      );
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.post("/api/user/:userId/preferences", async (req, res) => {
    try {
      const validatedData = insertUserPreferenceSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const preference = await storage.addUserPreference(validatedData);
      res.json(preference);
    } catch (error) {
      res.status(400).json({ error: "Invalid preference data" });
    }
  });

  app.delete("/api/user/:userId/preferences/:itemId", async (req, res) => {
    try {
      await storage.removeUserPreference(req.params.userId, req.params.itemId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete preference" });
    }
  });

  app.delete("/api/user/:userId/preferences/type/:type", async (req, res) => {
    try {
      await storage.clearUserPreferencesByType(req.params.userId, req.params.type);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear preferences" });
    }
  });

  app.get("/api/events", async (req, res) => {
    try {
      const { category, keyword } = req.query;
      
      let events;
      if (category === "sports") {
        events = await ticketmasterAPI.getSportsEvents(
          keyword ? [keyword as string] : undefined
        );
      } else if (category === "music") {
        events = await ticketmasterAPI.getMusicEvents(
          keyword ? [keyword as string] : undefined
        );
      } else {
        const [sports, music] = await Promise.all([
          ticketmasterAPI.getSportsEvents(),
          ticketmasterAPI.getMusicEvents(),
        ]);
        events = [...sports, ...music];
      }
      
      res.json(events);
    } catch (error) {
      console.error("Failed to fetch events:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/user/:userId/recommended-events", async (req, res) => {
    try {
      const preferences = await storage.getUserPreferences(req.params.userId);
      
      const teams = preferences
        .filter(p => p.type === "team")
        .map(p => p.itemName);
      
      const artists = preferences
        .filter(p => p.type === "artist")
        .map(p => p.itemName);
      
      const venues = preferences
        .filter(p => p.type === "venue")
        .map(p => p.itemName);

      const events = await ticketmasterAPI.getRecommendedEvents({
        teams,
        artists,
        venues,
      });

      res.json(events);
    } catch (error) {
      console.error("Failed to fetch recommended events:", error);
      res.status(500).json({ error: "Failed to fetch recommended events" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
