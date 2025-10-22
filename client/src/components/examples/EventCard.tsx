import EventCard from '../EventCard';
import bearsLogo from '@assets/generated_images/Chicago_Bears_team_logo_b4c6c9fa.png';
import concertImage from '@assets/generated_images/Live_concert_stage_atmosphere_69ab46e5.png';

export default function EventCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
      <EventCard
        id="1"
        title="Chicago Bears vs Green Bay Packers"
        date="Nov 24, 2024 · 7:00 PM"
        venue="Soldier Field"
        price="From $85"
        image={bearsLogo}
        category="sports"
        onClick={() => console.log('Event clicked')}
      />
      <EventCard
        id="2"
        title="Spoon with Special Guests"
        date="Dec 5, 2024 · 8:00 PM"
        venue="The Riviera Theatre"
        price="From $45"
        image={concertImage}
        category="music"
        isSaved={true}
        onClick={() => console.log('Event clicked')}
      />
    </div>
  );
}
