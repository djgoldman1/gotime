import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Music2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EventPreviewCard from "./EventPreviewCard";

type ViewMode = "day" | "week" | "month";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  date: string;
  venue: string;
  price?: string;
  category: "sports" | "music";
  logo?: string;
}

interface CalendarViewProps {
  events?: CalendarEvent[];
  onEventClick?: (eventId: string) => void;
}

export default function CalendarView({ events = [], onEventClick }: CalendarViewProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const getWeekDates = () => {
    const week = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      week.push(date);
    }
    return week;
  };

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    setCurrentDate(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const weekDates = getWeekDates();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek("prev")}
            data-testid="button-prev-week"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-2xl font-semibold" data-testid="text-current-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateWeek("next")}
            data-testid="button-next-week"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex gap-2">
          {(["day", "week", "month"] as ViewMode[]).map((mode) => (
            <Button
              key={mode}
              variant={viewMode === mode ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode(mode)}
              data-testid={`button-view-${mode}`}
              className="capitalize"
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      {viewMode === "week" && (
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const dayEvents = events.filter(e => 
              Math.random() > 0.7
            );
            const today = isToday(date);

            return (
              <div
                key={index}
                className={`border rounded-lg p-3 min-h-[200px] ${
                  today ? "bg-primary/5 border-primary" : "bg-card"
                }`}
                data-testid={`calendar-day-${index}`}
              >
                <div className="text-center mb-3">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {weekDays[index]}
                  </div>
                  <div className={`text-lg font-semibold ${today ? "text-primary" : ""}`}>
                    {date.getDate()}
                  </div>
                </div>
                <div className="space-y-2">
                  {dayEvents.slice(0, 3).map((event) => (
                    <Popover key={event.id}>
                      <PopoverTrigger asChild>
                        <div
                          className={`p-2 rounded-md text-xs cursor-pointer hover-elevate active-elevate-2 ${
                            event.category === "sports" ? "bg-sports/10 border-l-2 border-l-sports" : "bg-music/10 border-l-2 border-l-music"
                          }`}
                          onClick={() => onEventClick?.(event.id)}
                          data-testid={`calendar-event-${event.id}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {event.logo ? (
                              <img src={event.logo} alt="" className="w-4 h-4 rounded object-cover shrink-0" />
                            ) : (
                              <Music2 className="w-4 h-4 shrink-0" />
                            )}
                            <div className="font-medium line-clamp-2 flex-1">{event.title}</div>
                          </div>
                          <div className="text-muted-foreground">{event.time}</div>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent side="right" align="start" className="p-0 w-auto">
                        <EventPreviewCard
                          title={event.title}
                          date={event.date}
                          venue={event.venue}
                          price={event.price}
                          category={event.category}
                          logo={event.logo}
                        />
                      </PopoverContent>
                    </Popover>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "day" && (
        <div className="border rounded-lg">
          <div className="bg-card p-4 border-b">
            <div className="text-sm text-muted-foreground">
              {weekDays[currentDate.getDay()]}
            </div>
            <div className="text-2xl font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getDate()}, {currentDate.getFullYear()}
            </div>
          </div>
          <div className="p-4 space-y-3">
            {events.slice(0, 5).map((event) => (
              <Popover key={event.id}>
                <PopoverTrigger asChild>
                  <div
                    className="p-4 border rounded-lg hover-elevate active-elevate-2 cursor-pointer"
                    onClick={() => onEventClick?.(event.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium text-muted-foreground min-w-[80px]">
                        {event.time}
                      </div>
                      {event.logo ? (
                        <img src={event.logo} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                      ) : (
                        <Music2 className="w-8 h-8 shrink-0 text-music" />
                      )}
                      <div className="flex-1">
                        <div className="font-semibold">{event.title}</div>
                      </div>
                      <Badge variant="secondary" className="uppercase text-xs">
                        {event.category}
                      </Badge>
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent side="right" align="start" className="p-0 w-auto">
                  <EventPreviewCard
                    title={event.title}
                    date={event.date}
                    venue={event.venue}
                    price={event.price}
                    category={event.category}
                    logo={event.logo}
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      )}

      {viewMode === "month" && (
        <div className="space-y-4">
          <div className="flex items-center gap-4 px-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-sports"></div>
              <span className="text-sm text-muted-foreground">Sports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-music"></div>
              <span className="text-sm text-muted-foreground">Music</span>
            </div>
          </div>
          <div className="border rounded-lg p-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, index) => {
                const hasEvents = Math.random() > 0.7;
                return (
                  <div
                    key={index}
                    className="aspect-square border rounded-md p-2 hover-elevate active-elevate-2 cursor-pointer"
                    data-testid={`calendar-month-day-${index}`}
                  >
                    <div className="text-sm font-medium">{(index % 30) + 1}</div>
                    {hasEvents && (
                      <div className="flex gap-1 mt-1">
                        <div className="w-2 h-2 rounded-full bg-sports"></div>
                        <div className="w-2 h-2 rounded-full bg-music"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
