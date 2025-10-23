import { z } from "zod";

const TICKETMASTER_API_URL = "https://app.ticketmaster.com/discovery/v2";
const CHICAGO_DMA_ID = "249"; // Chicago Designated Market Area

interface TicketmasterEvent {
  id: string;
  name: string;
  url: string;
  images: Array<{ url: string; width: number; height: number }>;
  dates: {
    start: {
      localDate: string;
      localTime?: string;
    };
  };
  classifications?: Array<{
    segment?: { name: string };
    genre?: { name: string };
  }>;
  _embedded?: {
    venues?: Array<{
      name: string;
    }>;
  };
  priceRanges?: Array<{
    min: number;
    max: number;
  }>;
}

interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[];
  };
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  price?: string;
  image: string;
  category: "sports" | "music";
  url: string;
  description?: string;
}

export class TicketmasterAPI {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private formatEvent(event: TicketmasterEvent): Event {
    const category = this.determineCategory(event);
    const date = new Date(`${event.dates.start.localDate}T${event.dates.start.localTime || "00:00"}`);
    
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    
    const formattedTime = event.dates.start.localTime 
      ? date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : "TBD";

    const venue = event._embedded?.venues?.[0]?.name || "Venue TBD";
    
    const image = event.images
      .sort((a, b) => b.width - a.width)[0]?.url || "";

    const price = event.priceRanges?.[0]
      ? `From $${event.priceRanges[0].min}`
      : undefined;

    return {
      id: event.id,
      title: event.name,
      date: `${formattedDate} · ${formattedTime}`,
      time: formattedTime,
      venue,
      price,
      image,
      category,
      url: event.url,
    };
  }

  private determineCategory(event: TicketmasterEvent): "sports" | "music" {
    const segment = event.classifications?.[0]?.segment?.name?.toLowerCase() || "";
    
    if (segment.includes("sport")) {
      return "sports";
    }
    return "music";
  }

  async searchEvents(params: {
    keyword?: string;
    classificationName?: string;
    startDateTime?: string;
    endDateTime?: string;
    size?: number;
  }): Promise<Event[]> {
    const queryParams = new URLSearchParams({
      apikey: this.apiKey,
      dmaId: CHICAGO_DMA_ID,
      size: (params.size || 50).toString(),
      sort: "date,asc",
    });
    
    // Add date range if specified
    if (params.startDateTime) {
      queryParams.append("startDateTime", params.startDateTime);
    }
    
    if (params.endDateTime) {
      queryParams.append("endDateTime", params.endDateTime);
    }

    if (params.keyword) {
      queryParams.append("keyword", params.keyword);
    }

    if (params.classificationName) {
      queryParams.append("classificationName", params.classificationName);
    }

    const url = `${TICKETMASTER_API_URL}/events.json?${queryParams}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error("Ticketmaster API error:", response.status, response.statusText);
        return [];
      }

      const data: TicketmasterResponse = await response.json();
      
      if (!data._embedded?.events) {
        console.log(`No events found for query: ${params.keyword || params.classificationName}`);
        return [];
      }

      console.log(`Found ${data._embedded.events.length} events for query: ${params.keyword || params.classificationName}`);
      
      // Log first event for debugging
      if (data._embedded.events.length > 0) {
        const firstEvent = data._embedded.events[0];
        console.log(`Sample event: ${firstEvent.name}, Date: ${firstEvent.dates.start.localDate}, Venue: ${firstEvent._embedded?.venues?.[0]?.name}`);
      }

      return data._embedded.events.map(event => this.formatEvent(event));
    } catch (error) {
      console.error("Failed to fetch events from Ticketmaster:", error);
      return [];
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getSportsEvents(teamKeywords?: string[]): Promise<Event[]> {
    if (teamKeywords && teamKeywords.length > 0) {
      const allEvents: Event[] = [];
      
      for (const keyword of teamKeywords) {
        const events = await this.searchEvents({ keyword, classificationName: "Sports" });
        allEvents.push(...events);
        
        if (teamKeywords.indexOf(keyword) < teamKeywords.length - 1) {
          await this.delay(200);
        }
      }
      
      return allEvents;
    }

    return this.searchEvents({ classificationName: "Sports" });
  }

  async getMusicEvents(artistKeywords?: string[]): Promise<Event[]> {
    if (artistKeywords && artistKeywords.length > 0) {
      const allEvents: Event[] = [];
      
      for (const keyword of artistKeywords) {
        const events = await this.searchEvents({ keyword, classificationName: "Music" });
        allEvents.push(...events);
        
        if (artistKeywords.indexOf(keyword) < artistKeywords.length - 1) {
          await this.delay(200);
        }
      }
      
      return allEvents;
    }

    return this.searchEvents({ classificationName: "Music" });
  }

  async getAllChicagoEvents(): Promise<Event[]> {
    // Fetch all sports and music events in Chicago
    const sportsEvents = await this.searchEvents({ 
      classificationName: "Sports",
      size: 200 
    });
    
    await this.delay(300);
    
    const musicEvents = await this.searchEvents({ 
      classificationName: "Music",
      size: 200 
    });

    const allEvents = [...sportsEvents, ...musicEvents];
    
    // Remove duplicates
    const uniqueEvents = allEvents.filter((event, index, self) =>
      index === self.findIndex(e => e.id === event.id)
    );

    console.log(`Total Chicago events fetched: ${uniqueEvents.length}`);
    return uniqueEvents;
  }

  async getRecommendedEvents(preferences: {
    teams?: string[];
    artists?: string[];
    venues?: string[];
  }): Promise<Event[]> {
    // Get all Chicago events
    const allEvents = await this.getAllChicagoEvents();
    
    // If no preferences, return all events
    if ((!preferences.teams || preferences.teams.length === 0) &&
        (!preferences.artists || preferences.artists.length === 0) &&
        (!preferences.venues || preferences.venues.length === 0)) {
      return allEvents;
    }

    // Filter events based on user preferences
    const filteredEvents = allEvents.filter(event => {
      const eventTitle = event.title.toLowerCase();
      const eventVenue = event.venue.toLowerCase();
      
      // Check if event matches any team preference
      const matchesTeam = preferences.teams?.some(team => 
        eventTitle.includes(team.toLowerCase())
      ) || false;
      
      // Show all music events (no artist filtering for better discovery)
      const isMusic = event.category === "music";
      
      // Check if event matches any venue preference
      const matchesVenue = preferences.venues?.some(venue => 
        eventVenue.includes(venue.toLowerCase())
      ) || false;
      
      // Return true if matches team preference OR is music OR matches venue
      return matchesTeam || isMusic || matchesVenue;
    });

    console.log(`Filtered to ${filteredEvents.length} events based on preferences`);
    return filteredEvents;
  }
}

export const ticketmasterAPI = new TicketmasterAPI(
  process.env.TICKETMASTER_API_KEY || ""
);
