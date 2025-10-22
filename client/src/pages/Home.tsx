import { useState } from "react";
import Header from "@/components/Header";
import CalendarView from "@/components/CalendarView";
import EventCard from "@/components/EventCard";
import EventDetailModal from "@/components/EventDetailModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import bearsLogo from '@assets/generated_images/Chicago_Bears_team_logo_b4c6c9fa.png';
import bullsLogo from '@assets/generated_images/Chicago_Bulls_team_logo_a3692be6.png';
import concertImage from '@assets/generated_images/Live_concert_stage_atmosphere_69ab46e5.png';
import festivalImage from '@assets/generated_images/Chicago_music_festival_scene_c12c5f26.png';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const mockCalendarEvents = [
    {
      id: "1",
      title: "Bears vs Packers",
      time: "7:00 PM",
      date: "Nov 24, 2024 · 7:00 PM",
      venue: "Soldier Field",
      price: "From $85",
      category: "sports" as const,
      logo: bearsLogo,
    },
    {
      id: "2",
      title: "Spoon Concert",
      time: "8:00 PM",
      date: "Dec 5, 2024 · 8:00 PM",
      venue: "The Riviera Theatre",
      price: "From $45",
      category: "music" as const,
    },
    {
      id: "3",
      title: "Bulls vs Lakers",
      time: "6:30 PM",
      date: "Dec 10, 2024 · 6:30 PM",
      venue: "United Center",
      price: "From $95",
      category: "sports" as const,
      logo: bullsLogo,
    },
  ];

  const mockEvents = [
    {
      id: "1",
      title: "Chicago Bears vs Green Bay Packers",
      date: "Nov 24, 2024 · 7:00 PM",
      venue: "Soldier Field",
      price: "From $85",
      image: bearsLogo,
      category: "sports" as const,
      description: "Classic rivalry game at Soldier Field. Don't miss this intense NFC North matchup!",
    },
    {
      id: "2",
      title: "Spoon with Special Guests",
      date: "Dec 5, 2024 · 8:00 PM",
      venue: "The Riviera Theatre",
      price: "From $45",
      image: concertImage,
      category: "music" as const,
      description: "Join us for an unforgettable night with Spoon as they bring their latest tour to Chicago.",
    },
    {
      id: "3",
      title: "Chicago Bulls vs Los Angeles Lakers",
      date: "Dec 10, 2024 · 6:30 PM",
      venue: "United Center",
      price: "From $95",
      image: bullsLogo,
      category: "sports" as const,
      description: "Watch the Bulls take on the Lakers in this exciting NBA matchup!",
    },
    {
      id: "4",
      title: "Lollapalooza After Show",
      date: "Dec 15, 2024 · 9:00 PM",
      venue: "Metro Chicago",
      price: "From $35",
      image: festivalImage,
      category: "music" as const,
      description: "Exclusive after show featuring top festival performers in an intimate venue.",
    },
  ];

  const filteredEvents = selectedCategory === "all"
    ? mockEvents
    : mockEvents.filter(e => e.category === selectedCategory);

  const selectedEvent = mockEvents.find(e => e.id === selectedEventId);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6">Your Event Calendar</h2>
          <CalendarView
            events={mockCalendarEvents}
            onEventClick={(id) => setSelectedEventId(id)}
          />
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold">Recommended Events</h2>
            <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">All</TabsTrigger>
                <TabsTrigger value="sports" data-testid="tab-sports">Sports</TabsTrigger>
                <TabsTrigger value="music" data-testid="tab-music">Music</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                {...event}
                onClick={() => setSelectedEventId(event.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {selectedEvent && (
        <EventDetailModal
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          event={selectedEvent}
        />
      )}
    </div>
  );
}
