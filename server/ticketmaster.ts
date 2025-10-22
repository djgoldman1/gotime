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

  async getRecommendedEvents(preferences: {
    teams?: string[];
    artists?: string[];
    venues?: string[];
  }): Promise<Event[]> {
    const sportsEvents = await this.getSportsEvents(preferences.teams);
    
    await this.delay(200);
    
    const musicEvents = await this.getMusicEvents(preferences.artists);

    const allEvents = [...sportsEvents, ...musicEvents];
    
    // Filter to only show events within the next 6 months
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sixMonthsFromNow = new Date(today);
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
    
    const filteredByDate = allEvents.filter(event => {
      // Parse the date from the formatted event
      const eventDateStr = event.date.split(' · ')[0]; // e.g., "Oct 22, 2025"
      const eventDate = new Date(eventDateStr);
      return eventDate >= today && eventDate <= sixMonthsFromNow;
    });
    
    const uniqueEvents = filteredByDate.filter((event, index, self) =>
      index === self.findIndex(e => e.id === event.id)
    );

    if (preferences.venues && preferences.venues.length > 0) {
      return uniqueEvents.filter(event => 
        preferences.venues!.some(venue => 
          event.venue.toLowerCase().includes(venue.toLowerCase())
        )
      );
    }

    return uniqueEvents;
  }
}

export const ticketmasterAPI = new TicketmasterAPI(
  process.env.TICKETMASTER_API_KEY || ""
);
