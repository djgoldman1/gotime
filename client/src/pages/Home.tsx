import { useState } from "react";
import Header from "@/components/Header";
import CalendarView from "@/components/CalendarView";
import EventCard from "@/components/EventCard";
import EventDetailModal from "@/components/EventDetailModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface HomeProps {
  userId: string;
}

export default function Home({ userId }: HomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const { data: events = [], isLoading } = useQuery({
    queryKey: [`/api/user/${userId}/recommended-events`],
  });

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  const filteredEvents = selectedCategory === "all"
    ? events
    : events.filter((e: any) => e.category === selectedCategory);

  const calendarEvents = events.map((e: any) => ({
    id: e.id,
    title: e.title,
    time: e.time,
    date: e.date,
    venue: e.venue,
    price: e.price,
    category: e.category,
    logo: e.image,
  }));

  const selectedEvent = events.find((e: any) => e.id === selectedEventId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onProfileClick={handleLogout} />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <section>
          <h2 className="text-3xl font-bold mb-6">Your Event Calendar</h2>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No recommended events found. Try adding more preferences!
              </p>
              <Button onClick={handleLogout}>Update Preferences</Button>
            </div>
          ) : (
            <CalendarView
              events={calendarEvents}
              onEventClick={(id) => setSelectedEventId(id)}
            />
          )}
        </section>

        {events.length > 0 && (
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
              {filteredEvents.map((event: any) => (
                <EventCard
                  key={event.id}
                  id={event.id}
                  title={event.title}
                  date={event.date}
                  venue={event.venue}
                  price={event.price}
                  image={event.image}
                  category={event.category}
                  onClick={() => setSelectedEventId(event.id)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedEvent && (
        <EventDetailModal
          isOpen={!!selectedEventId}
          onClose={() => setSelectedEventId(null)}
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            date: selectedEvent.date,
            venue: selectedEvent.venue,
            price: selectedEvent.price,
            image: selectedEvent.image,
            category: selectedEvent.category,
            description: selectedEvent.description,
          }}
        />
      )}
    </div>
  );
}
