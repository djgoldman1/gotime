import CalendarView from '../CalendarView';
import bearsLogo from '@assets/generated_images/Chicago_Bears_team_logo_b4c6c9fa.png';
import bullsLogo from '@assets/generated_images/Chicago_Bulls_team_logo_a3692be6.png';

const mockEvents = [
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
