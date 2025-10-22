import CalendarView from '../CalendarView';

const mockEvents = [
  { id: "1", title: "Bears vs Packers", time: "7:00 PM", category: "sports" as const },
  { id: "2", title: "Spoon Concert", time: "8:00 PM", category: "music" as const },
  { id: "3", title: "Bulls vs Lakers", time: "6:30 PM", category: "sports" as const },
];

export default function CalendarViewExample() {
  return (
    <div className="p-4">
      <CalendarView
        events={mockEvents}
        onEventClick={(id) => console.log('Event clicked:', id)}
      />
    </div>
  );
}
