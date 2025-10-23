import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserPreferenceSchema } from "@shared/schema";
import { ticketmasterAPI } from "./ticketmaster";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { spotifyService } from "./spotify";

export async function registerRoutes(app: Express): Promise<Server> {
  await setupAuth(app);

  app.get("/api/auth/user", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/user/:userId/complete-onboarding", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }
      
      const user = await storage.updateUser(req.params.userId, { onboardingCompleted: true });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete onboarding" });
    }
  });

  app.get("/api/user/:userId", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.get("/api/user/:userId/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const preferences = await storage.getUserPreferences(req.params.userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.get("/api/user/:userId/preferences/:type", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const preferences = await storage.getUserPreferencesByType(
        req.params.userId,
        req.params.type
      );
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch preferences" });
    }
  });

  app.post("/api/user/:userId/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      const validatedData = insertUserPreferenceSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const preference = await storage.addUserPreference(validatedData);
      res.json(preference);
    } catch (error) {
      console.error("Failed to add preference:", error);
      res.status(400).json({ error: "Invalid preference data" });
    }
  });

  app.delete("/api/user/:userId/preferences/:itemId", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

      await storage.removeUserPreference(req.params.userId, req.params.itemId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete preference" });
    }
  });

  app.delete("/api/user/:userId/preferences/type/:type", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

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

  app.get("/api/user/:userId/recommended-events", isAuthenticated, async (req: any, res) => {
    try {
      const sessionUserId = req.user.claims.sub;
      if (sessionUserId !== req.params.userId) {
        return res.status(403).json({ error: "Forbidden" });
      }

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

  app.get("/api/spotify/search/artists/:query", isAuthenticated, async (req, res) => {
    try {
      const query = req.params.query;
      if (!query || query.trim().length === 0) {
        return res.json([]);
      }

      const artists = await spotifyService.searchArtists(query, 20);
      res.json(artists);
    } catch (error) {
      console.error("Failed to search Spotify artists:", error);
      res.status(500).json({ error: "Failed to search artists" });
    }
  });

  app.get("/api/spotify/top-artists", isAuthenticated, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const artists = await spotifyService.getUserTopArtistsMultiplePages(limit);
      res.json(artists);
    } catch (error) {
      console.error("Failed to fetch user's top artists:", error);
      res.status(500).json({ error: "Failed to fetch top artists" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
